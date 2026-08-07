export const colorTokens = {
  brandPrimary: '#93161E',
  applicationBackground: '#FFFAF6',
  surface: '#FFFFFF',
  onboardingPrimary: '#93161E',
  onboardingBackground: '#FFFAF6',
  onboardingSurface: '#FFFFFF',
  onboardingProductSelected: 'rgba(147, 22, 30, 0.04)',
  onboardingProductSelectedBorder: 'rgba(147, 22, 30, 0.09)',
  onboardingPillBackground: 'rgba(147, 22, 30, 0.06)',
  onboardingMuted: '#71859B',
  onboardingHeading: '#435160',
  onboardingHeadingStrong: '#231F20',
  onboardingAccent: '#C7AA7B',
  onboardingDanger: '#E8402F',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  borderSubtle: '#E5E7EB',
} as const;

export const typographyTokens = {
  fontFamily: {
    primary: "'Mulish', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacingTokens = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const radiusTokens = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  pill: '9999px',
} as const;

export const shadowTokens = {
  xs: '0 1px 2px rgba(17, 24, 39, 0.06)',
  sm: '0 2px 8px rgba(17, 24, 39, 0.08)',
  md: '0 8px 20px rgba(17, 24, 39, 0.12)',
  lg: '0 16px 40px rgba(17, 24, 39, 0.14)',
} as const;

export const designTokens = {
  color: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
} as const;
