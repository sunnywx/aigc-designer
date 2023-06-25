import { ReactNode } from "react";

export type ElementType=
  | 'text'
  | 'photo'
  | 'template'
  | 'property'
  | 'shape'
  | 'icon'
  | 'logo'
  | 'ai'

export type CategoryItem={
  type: ElementType,
  name: string,
  icon?: ReactNode
}
