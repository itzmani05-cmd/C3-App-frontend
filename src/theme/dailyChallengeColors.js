// Design tokens for the C3 Daily Challenge feature (admin + student screens).
// Scoped to this feature only — the rest of the app keeps its existing look.

export const COLORS = {
  brand50: '#EEF2FF',
  brand100: '#E0E7FF',
  brand500: '#6366F1',
  brand600: '#4F46E5',
  brand700: '#4338CA',

  accent500: '#8B5CF6',
  accent600: '#7C3AED',
  accent700: '#6D28D9',

  success500: '#10B981',
  success600: '#059669',
  successSoft: '#D1FAE5',

  danger500: '#EF4444',
  danger600: '#DC2626',
  danger700: '#B91C1C',
  dangerSoft: '#FEE2E2',

  warning500: '#F59E0B',
  warningSoft: '#FEF3C7',
  warningText: '#92400E',

  info500: '#3B82F6',
  info600: '#2563EB',

  // Tailwind slate scale — neutrals only, no custom greys.
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',

  pageBackground: '#F3F6FB',
  baseText: '#0F172A',
  white: '#FFFFFF',
};

export const RADII = {
  xl: 14,
  xxl: 20,
  xxxl: 28,
  pill: 999,
};

// React Native shadow props approximating the spec's CSS box-shadow tiers.
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 10,
  },
};
