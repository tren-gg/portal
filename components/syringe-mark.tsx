export function SyringeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        transform="rotate(-45 128 128)"
      >
        <path d="M38 126h34" />
        <path d="M38 96v60" />
        <path d="M72 106h92v40H72z" />
        <path d="M164 126h36" />
        <path d="M200 126h24" />
        <path d="M94 106v40" />
        <path d="M116 106v40" />
        <path d="M138 106v40" />
        <path d="M80 86h76" />
        <path d="M80 166h76" />
      </g>
    </svg>
  );
}
