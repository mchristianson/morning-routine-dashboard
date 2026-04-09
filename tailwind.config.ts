import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-clear': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-cloudy': 'linear-gradient(135deg, #667eea 0%, #a8a8a8 100%)',
        'gradient-rainy': 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        'gradient-sunny': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
    },
  },
  plugins: [],
}
export default config
