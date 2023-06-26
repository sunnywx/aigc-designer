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
