// canvas editor context
import { createContext, useContext, Dispatch, SetStateAction, ReactNode } from 'react'
import Canvas from './Canvas'
import mitt, {Emitter} from 'mitt'

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