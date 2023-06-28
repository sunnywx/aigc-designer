// canvas editor context
import { createContext, useContext, Dispatch, SetStateAction, ReactNode, useCallback } from 'react'
import Canvas from './Canvas'
import mitt, {Emitter} from 'mitt'
import { IDataURLOptions } from "fabric/fabric-impl";

export type EditorContextType = {
  canvas: Canvas | null
  setCanvas: Dispatch<SetStateAction<Canvas>> | (() => void)
  panelOpen?: boolean
  setPanelOpen?: Dispatch<SetStateAction<boolean>> | (() => void)
  emitter: Emitter<any> | {}
  canvasState: CanvasState
  setCanvasState: Dispatch<SetStateAction<CanvasState>>
}

export type EmitEvents={
  zoomChange?: number;
  elementResize?: {target: Element, width: number, height: number};
}

export const emitter=mitt<EmitEvents>()

export type CanvasState={
  zoom?: number
  dragMode?: boolean
  preview?: boolean
}

const noop=()=> {}

export const EditorContext = createContext<EditorContextType>({
  canvas: null,
  setCanvas: noop,
  panelOpen: false,
  setPanelOpen: noop,
  emitter: {},
  canvasState: {},
  setCanvasState: noop
});

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw Error('useEditor should inside react component')
  }
  return ctx;
}

// export canvas as image
export function useCanvasImage(resetCanvas?: boolean){
  const {canvas}=useEditor()
  const lastZoom=canvas?.canvas?.getZoom()
  
  const getImageData=useCallback((option: IDataURLOptions={format: 'png'})=> {
    // reset canvas zoom to take snapshot
    canvas?.zoomFit()

    const imgBase64=canvas?.canvas?.toDataURL(option) as string
  
    // restore canvas zoom
    if(resetCanvas){
      const vpt=canvas?.canvas.viewportTransform
      canvas?.canvas?.setViewportTransform([lastZoom, 0, 0, lastZoom, vpt[4], vpt[5]])
    }
    
    return imgBase64
  }, [canvas, lastZoom, resetCanvas])
  
  return {
    getImageData
  }
}

interface Props {
  value: EditorContextType
  children?: ReactNode
}

export function EditorProvider({ value, children }: Props) {
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  )
}