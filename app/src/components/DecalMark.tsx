import type { Decal } from '../data/types';
import { CameraIcon, HeartIcon } from './icons';

/**
 * Renders a product's print (either short text like "VIBE" or an icon like
 * the camera mark for photo-print items). Previously this was a duplicated
 * `text()/icon()` helper pasted into catalog.html, favorites.html and
 * cart.html independently, with the signature drifting between copies.
 */
export function DecalMark({ decal, background }: { decal: Decal; background: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        padding: '7px 11px',
        borderRadius: 8,
        background,
      }}
    >
      {decal.kind === 'text' ? (
        <span
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '.02em',
            color: decal.color,
            whiteSpace: 'nowrap',
          }}
        >
          {decal.value}
        </span>
      ) : decal.icon === 'camera' ? (
        <CameraIcon size={14} color={decal.color} />
      ) : (
        <HeartIcon size={14} filled color={decal.color} />
      )}
    </div>
  );
}
