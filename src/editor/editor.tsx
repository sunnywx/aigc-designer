import { EditorProvider } from './ctx'
import Canvas from './Canvas'
import { LegacyRef, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Loading from '@/components/loading'
import cs from 'classnames'
import {fabric} from 'fabric'

import styles from './style.module.scss'

interface Props {
  className?: string;
  mainClassName?: string;
  canvasClassName?: string;
  renderTopbar?: (canvas: Canvas) => ReactNode;
  renderLeftPanel?: (canvas: Canvas) => ReactNode;
  renderRightPanel?: (canvas: Canvas) => ReactNode;
  children?: ReactNode;
  onReady?: (canvas: Canvas)=> void;
}

export default function Editor({
  className,
  mainClassName,
  canvasClassName,
  children,
  renderTopbar,
  renderLeftPanel,
  renderRightPanel,
  onReady
}: Props) {
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const canvasElParent = useRef<HTMLDivElement | null>(null)
  const [sourcePanelOpen, setSourcePanelOpen]=useState(false)
  const [selectedType, setselectedType] = useState<string | undefined>(undefined)
  
  const setDimensions = useCallback(() => {
    canvas?.canvas?.setHeight(canvasElParent.current?.clientHeight || 0, {})
    canvas?.canvas?.setWidth(canvasElParent.current?.clientWidth || 0, {})
    canvas?.canvas?.renderAll()
  }, [canvas])

  function getSelectedType(type: string) {
    console.log("editor.tsx ~ line 43: type:", type);
    setselectedType(type || undefined);
  }
  
  useEffect(() => {
    const canvas = new Canvas(canvasEl.current!, {
      // width: 600,
      // height: 800,
      getSelectedType
    })
    setCanvas(canvas);
    
    window.addEventListener('resize', setDimensions)
    
    setTimeout(()=> {
      canvas.bindEvents()
      onReady?.(canvas)
    }, 0)
    
    // fixme: for local debug, will remove
    // @ts-ignore
    Object.assign(window, {
      _editor: canvas,
      _fab: fabric
    })
    
    return () => {
      canvas.canvas.dispose()
      window.removeEventListener('resize', setDimensions)
    }
  }, [])

  useEffect(() => {
    if(!canvas) return
    console.log("editor.tsx ~ line 76: canvas.el:", canvas);
  }, [canvas])
  
  return (
    <EditorProvider value={{
      canvas,
      setCanvas,
      panelOpen: sourcePanelOpen,
      setPanelOpen: setSourcePanelOpen
    }}>
      <div className={cs(styles.wrap, className)}>
        {!canvas && <Loading />}
        {canvas && renderTopbar?.(canvas!)}
        <div className={cs(styles.main, mainClassName)}>
          {canvas && renderLeftPanel?.(canvas)}
          <div
            ref={canvasElParent as LegacyRef<any>}
            className={canvasClassName}
            id='editor-canvas'
            style={{visibility: canvas ? 'visible' : 'hidden'}}
          >
            <canvas ref={canvasEl as LegacyRef<any>}/>
          </div>
          {children}
          {canvas && renderRightPanel?.(canvas!, selectedType)}
        </div>
      </div>
    </EditorProvider>
  );
}
