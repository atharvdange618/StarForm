import { db } from './client';
import { themes } from './schema';

const globalThemes = [
  {
    name: 'startup',
    isGlobal: true,
    config: {
      colors: { primary: '#3b82f6', secondary: '#e0f2fe', background: '#f0f9ff', text: '#0f172a' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'anime',
    isGlobal: true,
    config: {
      colors: { primary: '#f472b6', secondary: '#fce7f3', background: '#fff1f2', text: '#1e1b4b' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'gaming',
    isGlobal: true,
    config: {
      colors: { primary: '#4ade80', secondary: '#14532d', background: '#052e16', text: '#f0fdf4' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'space',
    isGlobal: true,
    config: {
      colors: { primary: '#a78bfa', secondary: '#3b0764', background: '#0f0a1e', text: '#f5f3ff' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'retro',
    isGlobal: true,
    config: {
      colors: { primary: '#fbbf24', secondary: '#78350f', background: '#1c1007', text: '#fffbeb' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
];

const inserted = await db.insert(themes).values(globalThemes).onConflictDoNothing().returning();

console.log(`Seeded ${inserted.length} global themes:`);
inserted.forEach((t) => console.log(` - ${t.name} (${t.id})`));
