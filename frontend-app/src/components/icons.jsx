// A handful of hand-picked line icons for the sidebar nav.
// Kept as inline SVGs so the app doesn't need an icon-library dependency.

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

export function IconHome(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9v-6h6v6h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconArrows(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 8h13l-3.5-3.5" />
      <path d="M20 16H7l3.5 3.5" />
    </svg>
  );
}

export function IconTransfer(props) {
  return (
    <svg {...common} {...props}>
      <path d="M17 7 21 11l-4 4" />
      <path d="M3 11h18" />
      <path d="M7 17 3 13l4-4" />
      <path d="M21 13H3" />
    </svg>
  );
}

export function IconLoan(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M7 14h4" />
    </svg>
  );
}

export function IconClipboard(props) {
  return (
    <svg {...common} {...props}>
      <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
      <path d="M9 4.5V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v.5" />
      <path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4.5" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h3" />
      <path d="M15 16l4-4-4-4" />
      <path d="M19 12H9" />
    </svg>
  );
}
