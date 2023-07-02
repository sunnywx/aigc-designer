import { CategoryItem } from './types'

export const categories: CategoryItem[] = [
  {
    type: 'text',
    name: 'Text'
  },
  {
    type: 'photo',
    name: 'Photo'
  },
  // {
  //   type: 'template',
  //   name: 'Template'
  // },
  {
    type: 'shape',
    name: 'Shape'
  },
  // {
  //   type: 'property',
  //   name: 'Property'
  // },
  {
    type: 'icon',
    name: 'Icon'
  },
  // {
  //   type: 'logo',
  //   name: 'Logo'
  // },
]

// see: https://www.cssfontstack.com/
// define some native fonts supported well by win/mac
export const fonts: string[] = [
  // available
  // "Arial",
  // "Times New Roman",
  // "Calibri",
  // "Verdana",
  // "Courier New",
  // "Segoe UI",
  // "Tahoma",
  // "Georgia",
  // "Trebuchet MS",
  // "Impact",
  'cursive',
  'emoji',
  'fantasy',
  'monospace',
  'sans-serif',
  'serif',
  
  // sans-serif
  // 'Aria',
  // 'Arial Narrow',
  // 'Tahoma',
  // 'Trebuchet MS',
  // 'Verdana',
  // // serif
  // 'Georgia',
  // 'Times New Roman',
  // // monospaced
  // 'Consolas',
  // 'Courier New',
  // 'Monaco'
]