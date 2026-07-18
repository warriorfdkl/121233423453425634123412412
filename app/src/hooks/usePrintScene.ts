import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import type { Layer } from './useLayers';
import { asset } from '../lib/asset';

export type SceneStatus = 'loading' | 'ready' | 'error';

/** Fixed camera angles captured as static images for the constructor's 2D tab. */
export const GARMENT_VIEW_ANGLES: { key: string; label: string; yaw: number }[] = [
  { key: 'front', label: 'Спереди', yaw: 0 },
  { key: 'threeQuarter', label: 'Пол-оборота', yaw: 35 },
  { key: 'side', label: 'Сбоку', yaw: 85 },
  { key: 'back', label: 'Со спины', yaw: 180 },
];

interface PrintSceneOptions {
  /** Decorative mode (home hero): auto-rotates, shows the static brand mark on the chest, ignores drag. */
  decorative?: boolean;
  color: string;
  /** Interactive mode (constructor): uploaded images/text painted onto the chest as a live canvas texture. */
  layers?: Layer[];
}

/**
 * The Three.js bootstrap (renderer, camera, lights, GLTF load, chest decal
 * plane) shared by the home page's decorative hero shirt and the
 * constructor's interactive builder. In the static prototype this exact
 * setup — same camera fov, same two-light rig, same box-fit math — was
 * hand-duplicated between desktop.html and constructor.html and had
 * already drifted (0.9 vs 0.95 hemisphere-light intensity) by the time it
 * was audited. One hook, one place to tune it.
 */
export function usePrintScene(canvasRef: React.RefObject<HTMLCanvasElement | null>, options: PrintSceneOptions) {
  const [status, setStatus] = useState<SceneStatus>('loading');
  const yawRef = useRef(0);
  const groupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const colorRef = useRef(options.color);
  colorRef.current = options.color;

  const layersRef = useRef<Layer[]>(options.layers ?? []);
  layersRef.current = options.layers ?? [];
  const redrawPrintRef = useRef<(() => void) | null>(null);
  const captureViewsRef = useRef<(() => void) | null>(null);
  const [views, setViews] = useState<Record<string, string>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // React 18/19 StrictMode intentionally mounts -> cleans up -> remounts
    // every effect once in dev, to surface exactly this class of bug: a
    // WebGLRenderer bound to a <canvas> whose async GLTF load or rAF loop
    // outlives the first (deliberately-discarded) mount and keeps writing
    // into a scene/renderer that no longer belongs to the current instance.
    // `live` gates every callback that can fire after cleanup.
    let live = true;

    let renderer: THREE.WebGLRenderer;
    try {
      // preserveDrawingBuffer: the constructor's 2D tab captures static
      // toDataURL() snapshots of this same canvas at fixed angles — without
      // it the drawing buffer can be cleared right after compositing and
      // the capture comes back blank.
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: !options.decorative });
    } catch {
      setStatus('error');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.1, 9);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1d, 0.92));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-3, 1, -2);
    scene.add(fill);

    const group = new THREE.Group();
    if (options.decorative) {
      group.rotation.x = THREE.MathUtils.degToRad(14);
      group.rotation.z = THREE.MathUtils.degToRad(-7);
    }
    scene.add(group);
    groupRef.current = group;

    let raf = 0;
    let resizeObserver: ResizeObserver | undefined;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const loader = new GLTFLoader();
    loader.load(
      asset('assets/tshirt.glb'),
      (gltf) => {
        if (!live) return;
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        root.scale.setScalar(2.6 / (size.y || 1));

        const box2 = new THREE.Box3().setFromObject(root);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        root.position.sub(center);

        const size2 = new THREE.Vector3();
        box2.getSize(size2);
        const modelRadius = size2.length() / 2;
        // decorative (home hero) reads better bigger and sitting lower in
        // its frame than the constructor's interactive view: a closer
        // camera enlarges it, and raising the camera (without re-aiming it)
        // pushes the model's apparent position down in the rendered frame
        const distanceMul = options.decorative ? 3.05 : 3.4;
        const verticalBias = options.decorative ? 0.12 : 0.05;
        camera.position.set(0, size2.y * verticalBias, modelRadius * distanceMul);
        // the canvas's real size can still be 0 the moment this effect
        // starts (layout not settled yet), so the synchronous resize()
        // call below may have bailed out before the GLTF finished loading;
        // re-measuring here means the aspect ratio is never left stale/
        // stretched depending on which of the two races won
        resize();

        const materials: THREE.MeshStandardMaterial[] = [];
        root.traverse((obj) => {
          if (!(obj as THREE.Mesh).isMesh) return;
          const mesh = obj as THREE.Mesh;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const mat = m as THREE.MeshStandardMaterial;
            if (!mat?.color) return;
            // source diffuse map is a flat UV pattern-layout, not fabric color
            mat.map = null;
            mat.color.set(colorRef.current);
            mat.roughness = 0.55;
            mat.metalness = 0.05;
            mat.needsUpdate = true;
            materials.push(mat);
          });
        });
        materialsRef.current = materials;
        group.add(root);

        if (options.decorative) {
          const decalTex = new THREE.TextureLoader().load(asset('assets/icon-white.svg'));
          const decalMat = new THREE.MeshBasicMaterial({
            map: decalTex,
            transparent: true,
            depthWrite: false,
            alphaTest: 0.06,
            toneMapped: false,
          });
          const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), decalMat);
          decal.position.set(0, size2.y * 0.02, size2.z * 0.4);
          group.add(decal);
        } else {
          // Constructor mode: uploaded photos/text have no natural 3D
          // representation, so they're composited onto an offscreen 2D
          // canvas (same xPct/yPct the 2D tab uses) and that canvas is
          // reused as a live texture on a decal plane over the chest.
          const printCanvas = document.createElement('canvas');
          printCanvas.width = 1024;
          printCanvas.height = 1024;
          const printCtx = printCanvas.getContext('2d');
          const texture = new THREE.CanvasTexture(printCanvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          const imageCache = new Map<string, HTMLImageElement>();

          const redraw = () => {
            if (!live || !printCtx) return;
            printCtx.clearRect(0, 0, printCanvas.width, printCanvas.height);
            for (const l of layersRef.current) {
              const px = (l.xPct / 100) * printCanvas.width;
              const py = (l.yPct / 100) * printCanvas.height;
              if (l.kind === 'image' && l.src) {
                let img = imageCache.get(l.src);
                if (!img) {
                  img = new Image();
                  img.onload = () => {
                    redraw();
                    captureViewsRef.current?.();
                  };
                  img.src = l.src;
                  imageCache.set(l.src, img);
                }
                if (img.complete && img.naturalWidth) {
                  const targetW = printCanvas.width * 0.58;
                  const targetH = targetW * (img.naturalHeight / img.naturalWidth);
                  printCtx.drawImage(img, px - targetW / 2, py - targetH / 2, targetW, targetH);
                }
              } else if (l.kind === 'text' && l.text) {
                const fontPx = (l.fontSize / 600) * printCanvas.width * 2;
                printCtx.font = `700 ${fontPx}px Inter, sans-serif`;
                printCtx.textAlign = 'center';
                printCtx.textBaseline = 'middle';
                // white text alone disappears on light garments — a dark
                // outline keeps it readable against any garment color
                printCtx.lineWidth = fontPx * 0.09;
                printCtx.strokeStyle = 'rgba(0,0,0,.55)';
                printCtx.lineJoin = 'round';
                printCtx.strokeText(l.text, px, py);
                printCtx.fillStyle = '#fff';
                printCtx.fillText(l.text, px, py);
              }
            }
            texture.needsUpdate = true;
          };
          redrawPrintRef.current = redraw;
          redraw();

          // Deliberately unlit (MeshBasicMaterial): a lit material picks up
          // the hemisphere/directional rig and desaturates the artwork's
          // true colors (brand coral read as muddy brown) — wrong trade for
          // a print *preview*, where color fidelity matters more than PBR
          // realism. A geometry that only spans the chest area — not the
          // whole torso — keeps the plane close to the curved mesh under it
          // instead of visibly hovering off it near the shoulders/hem.
          const decalMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            alphaTest: 0.04,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -4,
          });
          // A flat plane merely parked near the chest always reads as a
          // card hovering next to the shirt, not print on it — no z-offset
          // fixes that, since the plane still can't follow the fabric's
          // curve. Raycast the chest from outside the model to find the
          // actual mesh under the print, then use DecalGeometry to clip a
          // decal that's projected directly onto (and follows) that mesh's
          // real surface, the same way a decal would wrap a curved surface
          // in any 3D editor.
          const decalY = -size2.y * 0.02;
          const decalWidth = size2.x * 0.52;
          const decalHeight = size2.y * 0.64;
          root.updateMatrixWorld(true);
          const hit = new THREE.Raycaster(new THREE.Vector3(0, decalY, size2.z), new THREE.Vector3(0, 0, -1)).intersectObject(root, true)[0];
          const decal = hit
            ? new THREE.Mesh(
                new DecalGeometry(
                  hit.object as THREE.Mesh,
                  hit.point,
                  new THREE.Euler(0, 0, 0),
                  new THREE.Vector3(decalWidth, decalHeight, Math.max(size2.z * 0.4, 0.3)),
                ),
                decalMat,
              )
            : new THREE.Mesh(new THREE.PlaneGeometry(decalWidth, decalHeight), decalMat);
          if (!hit) decal.position.set(0, decalY, size2.z * 0.4);
          group.add(decal);

          // Static angle snapshots for the 2D tab: spin to each preset yaw,
          // render, and grab the pixels — all synchronous within one JS
          // task, so the live 3D view never visibly flickers through them.
          // The print decal is hidden for these: "front" doubles as the
          // plain background behind the constructor's draggable HTML print
          // layers, so baking the print into the pixels too would draw it
          // twice; the decal stays visible for the live 3D tab as normal.
          const captureViews = () => {
            if (!live) return;
            const prevYaw = group.rotation.y;
            const result: Record<string, string> = {};
            for (const v of GARMENT_VIEW_ANGLES) {
              group.rotation.y = THREE.MathUtils.degToRad(v.yaw);
              // "front" keeps its background plain — the constructor overlays
              // live, draggable HTML layers on top of it instead. The other
              // angles are read-only previews, so the print needs to be baked
              // into the captured pixels or it wouldn't show up there at all.
              decal.visible = v.key !== 'front';
              renderer.render(scene, camera);
              result[v.key] = renderer.domElement.toDataURL('image/png');
            }
            group.rotation.y = prevYaw;
            decal.visible = true;
            renderer.render(scene, camera);
            if (live) setViews(result);
          };
          captureViewsRef.current = captureViews;
          captureViews();
        }

        if (live) setStatus('ready');
      },
      undefined,
      () => {
        if (live) setStatus('error');
      },
    );

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const draw = (now: number) => {
      if (!live) return;
      if (options.decorative) {
        group.rotation.y = now * 0.0002;
      } else {
        group.rotation.y = THREE.MathUtils.degToRad(yawRef.current);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      live = false;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scene is built once; color/yaw are pushed via refs below
  }, [canvasRef, options.decorative]);

  // live-update garment color without rebuilding the scene
  useEffect(() => {
    materialsRef.current.forEach((m) => m.color.set(options.color));
    captureViewsRef.current?.();
  }, [options.color]);

  // repaint the chest decal whenever a layer is added/moved/edited/removed,
  // and re-bake the non-front angle snapshots so they stay in sync with it
  useEffect(() => {
    redrawPrintRef.current?.();
    captureViewsRef.current?.();
  }, [options.layers]);

  const setYaw = (deg: number) => {
    yawRef.current = deg;
  };

  return { status, setYaw, views };
}
