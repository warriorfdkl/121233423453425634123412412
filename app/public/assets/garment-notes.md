# Garment mockup assets — processing notes

Final assets used by constructor.dc.html (template keys garmentImgFront/garmentImgBack, recolor via mix-blend-mode:multiply + mask-image):
- assets/garment-tshirt-front.png / -back.png
- assets/garment-hoodie-front.png / -back.png
- assets/garment-sweatshirt-front.png / -back.png
garmentHeightMap in logic: tshirt min(96%,470px), hoodie min(98%,478px), sweatshirt min(94%,462px)

Source uploads (front+back side by side in one image):
- T-shirt: uploads/pasted-1783345068098-0.png — 626x470, NO real alpha (checker baked in), split front|back at x=313
- Hoodie: uploads/pasted-1783345084914-0.png — 740x518, NO real alpha (checker + vignette baked in), split at x=370
- Sweatshirt: uploads/pasted-1783345110501-0.png — 360x360, REAL alpha, split at x=179 (front 179w, back 181w)

Extraction pipeline used (tshirt/hoodie): border-seeded flood fill on luminance
(stepTol ~8-18, ceiling ~210-218) -> alpha=0 for bg; remove small components;
morphological closing; smoothing blur on alpha; "fixDarkIntrusions" pass
(local max-filter luminance radius 5-6, drop >60-70 => RGB := white) to kill
dark checker-colored pixels that closing had forced opaque.

Known remaining issues: silhouettes have dents/notches where flood fill ate
into dark shadow folds (hem, sleeve seams); collar shadow looks dark; edges
still slightly ragged. Better fix order: flood fill -> remove small comps ->
LARGE-radius closing + enclosed-hole fill -> inpaint RGB of newly-opaque px
from nearest original-fg px -> alpha blur -> split.
