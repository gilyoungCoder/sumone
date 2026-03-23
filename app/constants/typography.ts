// 썸원 앱 타이포그래피 시스템
export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
} as const;

// 자주 쓰는 텍스트 스타일 조합
export const TextStyle = {
  heading: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xl * LineHeight.tight,
  },
  subheading: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.lg * LineHeight.tight,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  tiny: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xs * LineHeight.normal,
  },
} as const;
