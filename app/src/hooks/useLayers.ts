import { useState } from 'react';

export interface Layer {
  id: string;
  kind: 'image' | 'text';
  src?: string;
  text?: string;
  xPct: number;
  yPct: number;
  fontSize: number;
}

/**
 * Print-layer editing (upload an image, add text, drag it around the front
 * print area). Split out of the constructor's single 828-line component so
 * it can be tested and reasoned about independently of the 3D scene code.
 */
export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = crypto.randomUUID();
      setLayers((prev) => [...prev, { id, kind: 'image', src: String(reader.result), xPct: 50, yPct: 42, fontSize: 0 }]);
      setActiveId(id);
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const id = crypto.randomUUID();
    setLayers((prev) => [...prev, { id, kind: 'text', text: 'Твой текст', xPct: 50, yPct: 55, fontSize: 28 }]);
    setActiveId(id);
  };

  const updateLayer = (id: string, patch: Partial<Layer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    setActiveId((current) => (current === id ? null : current));
  };

  const moveLayer = (id: string, xPct: number, yPct: number) => {
    updateLayer(id, {
      xPct: Math.max(8, Math.min(92, xPct)),
      yPct: Math.max(8, Math.min(92, yPct)),
    });
  };

  return { layers, activeId, setActiveId, addImage, addText, updateLayer, deleteLayer, moveLayer };
}
