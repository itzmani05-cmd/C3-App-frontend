// Inter for body text and Plus Jakarta Sans for headings, matching the C3 website.
// `extraBold` is the heading face; use it for titles and screen headers.
export const FONT_FAMILY = {
  regular: 'InterRegular',
  medium: 'InterMedium',
  semiBold: 'InterSemiBold',
  bold: 'InterBold',
  extraBold: 'JakartaExtraBold',
  heading: 'JakartaBold',
};

export const TAB_BAR_LABEL_STYLE = {
  fontFamily: FONT_FAMILY.semiBold,
  fontSize: 11,
};

// The text styles used across the app. Use them with <AppText type="section">; a `variant` prop still overrides the
// weight. Pick the closest one instead of inventing a new size.
export const TYPE = {
  display: { variant: 'extraBold', fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  title: { variant: 'extraBold', fontSize: 22, lineHeight: 28, letterSpacing: -0.4 },
  section: { variant: 'extraBold', fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
  heading: { variant: 'bold', fontSize: 15, lineHeight: 21 },
  body: { variant: 'regular', fontSize: 14, lineHeight: 21 },
  small: { variant: 'regular', fontSize: 12.5, lineHeight: 18 },
  caption: { variant: 'medium', fontSize: 11, lineHeight: 15, letterSpacing: 0.2 },
};
