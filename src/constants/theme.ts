// TerraVerify Design System Constants
// Restrained, trustworthy, professional real-estate & fintech palette tailored for Cameroon

export const COLORS = {
  // Brand Primary & Secondary (Rich Royal Trust Blue, crisp white, deep cobalt)
  primary: '#0D47A1',        // Rich Royal Trust Blue (not light blue, not blackish)
  primaryLight: '#1976D2',   // Vibrant royal blue
  primaryDark: '#0A3073',    // Deep navy cobalt
  secondary: '#0052CC',      // Strong action blue
  secondaryLight: '#E8F0FE', // Clean subtle blue tint
  accent: '#D97706',         // Prestigious gold/amber badge accent

  // Backgrounds
  background: '#F4F7FB',     // Clean, crisp slight cool-slate background
  surface: '#FFFFFF',        // Crisp pure white container
  surfaceSecondary: '#EDF3F9', // Subtle blue-tinted container background
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#0A192F',    // Deep navy slate
  textSecondary: '#334155',  // Slate 700
  textMuted: '#64748B',      // Slate 500
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',         // Slate 200
  borderLight: '#F1F5F9',    // Slate 100
  borderFocus: '#1D61E1',

  // Status & Feedback (Restrained, subtle backgrounds)
  success: '#059669',        // Forest emerald
  successLight: '#ECFDF5',   // Subtle green bg
  successBorder: '#A7F3D0',

  warning: '#D97706',        // Warm amber
  warningLight: '#FFFBEB',   // Subtle amber bg
  warningBorder: '#FDE68A',

  error: '#DC2626',          // Red
  errorLight: '#FEF2F2',     // Subtle red bg
  errorBorder: '#FECACA',

  info: '#2563EB',           // Blue info
  infoLight: '#EFF6FF',
  infoBorder: '#BFDBFE',

  // Mobile Money Brand Colors
  mtnYellow: '#FFCC00',
  mtnText: '#000000',
  orangeMoney: '#FF6600',
  orangeText: '#FFFFFF',

  // Overlay
  overlay: 'rgba(11, 25, 44, 0.65)',
  cardOverlay: 'rgba(0, 0, 0, 0.4)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  micro: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
