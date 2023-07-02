export enum ImageSize {
  small='256',
  medium='512',
  large='1024'
}

export type FormValues={
  count: number;
  prompt: string;
  size: ImageSize | string
}

export type ImageItem = {
  url: string
}

export type Model='openai' | 'sd'

// stable diffusion
// for sd, minimal size is 512px
export enum SDImageSize {
  small='512',
  medium='768'
}

export type SDFormValues={
  count: number;
  prompt: string;
  size: SDImageSize | string;
  steps: number;
  style_preset: StylePreset;
  // scale: number;
  // seed: number;
}

export enum StylePreset {
  '3d-model'='3d-model',
  'analog-film'='analog-film',
  'anime'='anime',
  'cinematic'='cinematic',
  'comic-book'='comic-book',
  'digital-art'='digital-art',
  'enhance'='enhance',
  'fantasy-art'='fantasy-art',
  'isometric'='isometric',
  'line-art'='line-art',
  'low-poly'='low-poly',
  'modeling-compound'='modeling-compound',
  'neon-punk'='neon-punk',
  'origami'='origami',
  'photographic'='photographic',
  'pixel-art'='pixel-art',
  'tile-texture'='tile-texture'
}