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

  pageBackground: '#F3F6FB',
  appBackground: '#F8FAFC',
  authBackground: '#F5F5F5',
  baseText: '#0F172A',
  white: '#FFFFFF',
  black: '#000000',
};

export const RADII = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 14,
  xxl: 20,
  xxxl: 28,
  pill: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
