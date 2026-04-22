export const NODE_COLORS = [
  { id: 'default', label: 'Padrão',   bg: '#0d0d14', border: '#2a2a45', accent: '#00f0ff', glow: 'rgba(0,240,255,0.07)' },
  { id: 'cyan',    label: 'Ciano',    bg: '#071c28', border: '#00c8d4', accent: '#00f0ff', glow: 'rgba(0,240,255,0.22)' },
  { id: 'red',     label: 'Vermelho', bg: '#1c070d', border: '#cc0030', accent: '#ff003c', glow: 'rgba(255,0,60,0.22)'  },
  { id: 'green',   label: 'Verde',    bg: '#071c07', border: '#28cc0e', accent: '#39ff14', glow: 'rgba(57,255,20,0.2)' },
  { id: 'purple',  label: 'Roxo',     bg: '#120820', border: '#9b3dcc', accent: '#bf5fff', glow: 'rgba(191,95,255,0.22)' },
  { id: 'yellow',  label: 'Amarelo',  bg: '#1a1608', border: '#c9bc07', accent: '#fcee0a', glow: 'rgba(252,238,10,0.18)' },
  { id: 'pink',    label: 'Rosa',     bg: '#1c0718', border: '#cc40aa', accent: '#ff57d8', glow: 'rgba(255,87,216,0.22)' },
  { id: 'orange',  label: 'Laranja',  bg: '#1c0e04', border: '#cc5500', accent: '#ff7700', glow: 'rgba(255,119,0,0.22)'  },
];

export const getNodeColor = (colorId) =>
  NODE_COLORS.find((c) => c.id === colorId) ?? NODE_COLORS[0];
