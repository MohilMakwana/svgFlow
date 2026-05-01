// ===== Sample SVGs =====

export const sampleSvgs = [
  {
    id: 'abstract-logo',
    name: 'Abstract Logo',
    category: 'logo',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2dd4bf;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.9"/>
  <rect x="65" y="65" width="70" height="70" rx="12" fill="white" opacity="0.25" transform="rotate(45 100 100)"/>
  <circle cx="100" cy="100" r="25" fill="white" opacity="0.8"/>
</svg>`,
  },
  {
    id: 'gear-icon',
    name: 'Settings Gear',
    category: 'icon',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <g transform="translate(100,100)">
    <circle r="30" fill="#94a3b8" />
    <circle r="18" fill="#1e293b" />
    <g id="teeth">
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(45)"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(90)"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(135)"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(180)"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(225)"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(270)"/>
      <rect x="-8" y="-55" width="16" height="20" rx="4" fill="#94a3b8" transform="rotate(315)"/>
    </g>
  </g>
</svg>`,
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'icon',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path d="M100 170 C60 130, 10 110, 10 70 C10 30, 50 20, 70 20 C85 20, 95 30, 100 40 C105 30, 115 20, 130 20 C150 20, 190 30, 190 70 C190 110, 140 130, 100 170Z" fill="#f43f5e"/>
</svg>`,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    category: 'illustration',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <ellipse cx="100" cy="180" rx="30" ry="8" fill="#94a3b8" opacity="0.3"/>
  <path id="rocket-body" d="M100 20 C85 50, 80 80, 80 120 L120 120 C120 80, 115 50, 100 20Z" fill="#6366f1"/>
  <rect x="88" y="115" width="24" height="15" rx="3" fill="#4f46e5"/>
  <circle cx="100" cy="75" r="12" fill="#c7d2fe"/>
  <path d="M80 120 L65 145 L80 135Z" fill="#f59e0b"/>
  <path d="M120 120 L135 145 L120 135Z" fill="#f59e0b"/>
  <path id="flame" d="M90 130 L100 165 L110 130Z" fill="#ef4444" opacity="0.9"/>
  <path d="M95 130 L100 155 L105 130Z" fill="#fbbf24"/>
</svg>`,
  },
  {
    id: 'spinner',
    name: 'Loading Spinner',
    category: 'icon',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="70" fill="none" stroke="#334155" stroke-width="8"/>
  <path d="M100 30 A70 70 0 0 1 170 100" fill="none" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 'wave',
    name: 'Wave Pattern',
    category: 'illustration',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path d="M0 100 Q25 60, 50 100 T100 100 T150 100 T200 100 V200 H0Z" fill="#3b82f6" opacity="0.6"/>
  <path d="M0 120 Q25 80, 50 120 T100 120 T150 120 T200 120 V200 H0Z" fill="#6366f1" opacity="0.4"/>
  <path d="M0 140 Q25 100, 50 140 T100 140 T150 140 T200 140 V200 H0Z" fill="#8b5cf6" opacity="0.3"/>
</svg>`,
  },
  {
    id: 'star',
    name: 'Star',
    category: 'icon',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <polygon points="100,15 125,75 190,85 140,130 155,195 100,165 45,195 60,130 10,85 75,75" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
</svg>`,
  },
  {
    id: 'molecule',
    name: 'Molecule',
    category: 'illustration',
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <line x1="100" y1="100" x2="55" y2="55" stroke="#64748b" stroke-width="3"/>
  <line x1="100" y1="100" x2="145" y2="55" stroke="#64748b" stroke-width="3"/>
  <line x1="100" y1="100" x2="100" y2="155" stroke="#64748b" stroke-width="3"/>
  <circle cx="100" cy="100" r="18" fill="#7c3aed"/>
  <circle cx="55" cy="55" r="12" fill="#2dd4bf"/>
  <circle cx="145" cy="55" r="12" fill="#f43f5e"/>
  <circle cx="100" cy="155" r="12" fill="#fbbf24"/>
</svg>`,
  },
];

export const sampleCategories = ['all', 'logo', 'icon', 'illustration'];
