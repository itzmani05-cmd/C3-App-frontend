export const COLORS = {
  // Brand: the C3 logo blue, same scale as the website.
  brand50: '#EFF6FF',
  brand100: '#DBEAFE',
  brand500: '#3B82F6',
  brand600: '#2563EB',
  brand700: '#1D4ED8',
  brand900: '#1E3A8A',

  // Ink: the navy used for dark surfaces on the website.
  ink700: '#1E2A44',
  ink800: '#141D33',
  ink900: '#0D1426',

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

  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue600: '#2563EB',
  blue700: '#1D4ED8',

  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',

  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green300: '#86EFAC',
  green600: '#16A34A',

  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red200: '#FECACA',
  red300: '#FCA5A5',
  red600: '#DC2626',
  red700: '#B91C1C',

  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber600: '#D97706',
  amber800: '#92400E',

  pageBackground: '#F4F5F7',
  appBackground: '#F4F5F7',
  authBackground: '#F5F5F5',
  baseText: '#0F172A',
  white: '#FFFFFF',
  black: '#000000',
};

// Gently rounded corners, as on the website (6 / 8 / 12 / 16).
export const RADII = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 10,
  xxl: 12,
  xxxl: 16,
  pill: 999,
};

// Barely-there shadows; borders do most of the separation.
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};
