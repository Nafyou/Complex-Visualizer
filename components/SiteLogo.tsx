interface SiteLogoProps {
  size?: number;
  className?: string;
}

/**
 * A small drawn glyph — the Atlas mark.
 * Two hand-wobbled nodes with an arc between them. Ink on parchment.
 */
export function SiteLogo({ size = 28, className }: SiteLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* left node */}
      <path
        d="M9.2 24.8
           a 7.6 7.2 -3 1 1 14.9 -0.4
           a 7.6 7.2 -5 1 1 -14.9 0.4 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* right node */}
      <path
        d="M24.6 24.5
           a 7.8 7.4 2 1 1 15.1 -0.3
           a 7.8 7.4 4 1 1 -15.1 0.3 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* arc between — slight wobble */}
      <path
        d="M16.5 20 Q 24 12 31.8 20"
        stroke="var(--color-ochre)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* tiny filled dot in the right node — the 'current' */}
      <circle cx="32.2" cy="24.5" r="1.6" fill="var(--color-vermilion)" />
    </svg>
  );
}
