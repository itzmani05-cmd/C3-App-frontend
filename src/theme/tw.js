import { create } from 'twrnc';

// Tailwind for React Native. The default palette already matches the slate/gray/blue/green/red values in colors.js;
// only the app-specific colors are added here.
const tw = create({
  theme: {
    extend: {
      colors: {
        brand: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 900: '#1E3A8A' },
        ink: { 700: '#1E2A44', 800: '#141D33', 900: '#0D1426' },
        page: '#F4F5F7',
        app: '#F4F5F7',
      },
    },
  },
});

export default tw;
