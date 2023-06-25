// canvas editor context
import { createContext, useContext, Dispatch, SetStateAction, ReactNode } from 'react'
import Canvas from './Canvas'

export type EditorContextType = {
  canvas: Canvas | null
  setCanvas: Dispatch<SetStateAction<Canvas>> | (() => void)
  panelOpen?: boolean
  setPanelOpen?: Dispatch<SetStateAction<boolean>> | (() => void)
}

export const EditorContext = createContext<EditorContextType>({
  canvas: null,
  setCanvas: () => {
  },
  panelOpen: false,
  setPanelOpen: () => {
  }
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