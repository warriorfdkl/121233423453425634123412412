import type { SVGProps } from 'react';

/**
 * One shared icon set. The static prototype redrew the same star/bag/person
 * <svg> path by hand in every file it appeared in (6 copies of the nav
 * alone) — here each icon exists exactly once and is imported.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
});

export function StarIcon({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" fill={filled ? 'currentColor' : 'none'} {...props}>
      <path d="M12 3.5l2.47 5.18 5.53.62-4.1 3.9 1.08 5.6L12 15.9l-4.98 2.9 1.08-5.6-4.1-3.9 5.53-.62L12 3.5z" />
    </svg>
  );
}

export function BagIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" {...props}>
      <path d="M6 8h12l-1 12.5a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function PersonIcon({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill={filled ? 'currentColor' : 'none'} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-4.1 3.5-6.3 7.5-6.3s7.5 2.2 7.5 6.3" />
    </svg>
  );
}

export function HeartIcon({ size = 24, filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.9} fill={filled ? 'currentColor' : 'none'} {...props}>
      <path d="M12 21C12 21 4 15.5 4 9.8C4 6.6 6.5 4.5 9 4.5C10.5 4.5 11.5 5.3 12 6.2C12.5 5.3 13.5 4.5 15 4.5C17.5 4.5 20 6.6 20 9.8C20 15.5 12 21 12 21Z" />
    </svg>
  );
}

export function CameraIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.9} {...props}>
      <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function BurgerIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SendIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 12L19.5 4.5 13 19.5l-2.2-6.3L4.5 12z" />
    </svg>
  );
}
