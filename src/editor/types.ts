import { fabric } from "fabric";
import { ReactNode } from "react";

export interface EditorProps {
  canvas: fabric.Canvas
  preview: ()=> void
  download: ()=> void
  // toImage: ()=> void
  toJSON: ()=> void
  getFrameHistory: ()=> Array<fabric.Object[]>
}