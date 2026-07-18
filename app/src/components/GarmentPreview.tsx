import type { Decal } from '../data/types';
import { DecalMark } from './DecalMark';

interface GarmentPreviewProps {
  name: string;
  tintFilter: string;
  decal: Decal;
  decalBackground: string;
}

/** The tinted t-shirt mockup with its print, reused by every card/line-item that shows a product. */
export function GarmentPreview({ name, tintFilter, decal, decalBackground }: GarmentPreviewProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16% 18% 8%',
        }}
      >
        <img
          src="/assets/garment-tshirt-front.png"
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: tintFilter }}
        />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '36%', transform: 'translate(-50%, -50%)' }}>
        <DecalMark decal={decal} background={decalBackground} />
      </div>
    </div>
  );
}
