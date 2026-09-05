export type Language = 'bn' | 'en';

export type BackgroundType = 'transparent' | 'solid' | 'gradient' | 'image' | 'blur';

export interface BackgroundConfig {
  type: BackgroundType;
  color: string;
  gradient: string;
  imageUrl: string | null;
  blurAmount: number; // 0 to 20 px
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowOffsetY: number;
  shadowOpacity: number;
}

export interface ProcessedImage {
  originalUrl: string;
  cutoutUrl: string;
  previewUrl: string;
  width: number;
  height: number;
  filename: string;
}

export type ToolMode = 'preview' | 'compare' | 'erase' | 'restore';

export interface SampleImage {
  id: string;
  titleBn: string;
  titleEn: string;
  tag: string;
  url: string;
}
