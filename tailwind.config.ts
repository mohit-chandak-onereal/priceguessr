import type { Config } from 'tailwindcss';

// Tailwind v4 uses CSS-based configuration
// This file is kept for backwards compatibility
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;