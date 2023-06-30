import { EditorProvider, emitter, CanvasState } from './ctx'
import Canvas from './Canvas'
import { LegacyRef, ReactNode, useEffect, useRef, useState } from "react";
import Loading from '@/components/loading'
import cs from 'classnames'
import {fabric} from 'fabric'
import Preview from './preview'
import ObjectHandlers from './object-handlers'

import styles from './style.module.scss'

interface Props {
  className?: string;
  mainClassName?: string;
  canvasClassName?: string;
  renderTopbar?: (canvas: Canvas) => ReactNode;
  renderLeftPanel?: (canvas: Canvas) => ReactNode;
  renderRightPanel?: (canvas: Canvas, selectType?: string) => ReactNode;
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
  const [canvasObjects, setCanvasObjects] = useState([])
  const [canvasState, setCanvasState]=useState<CanvasState>({
    zoom: 1,
    dragMode: false,
    preview: false
  })
  const [selectedType, setselectedType] = useState<string | undefined>(undefined)
  const {preview}=canvasState

  function getSelectedType(type: string) {
    setselectedType(type || undefined);
  }

  function getCanvasObjects(obj: any) {
    setCanvasObjects(obj)
  }
  
  useEffect(() => {
    const canvas = new Canvas(canvasEl.current!, {
      getSelectedType,
      getCanvasObjects
    })
    setCanvas(canvas);
    
    setTimeout(()=> {
      onReady?.(canvas)
      canvas.bindEvents()
      canvas.observeCanvas([
        document.getElementsByClassName('canvas-container')[0]
      ])
    }, 0)
    
    // fixme: for local debug, will remove
    // @ts-ignore
    Object.assign(window, {
      _editor: canvas,
      _fab: fabric
    })
    
    return () => {
      canvas.canvas.dispose()
      emitter.off()
      canvas.detachResizeObserver()
    }
  }, [])
  
  useEffect(()=> {
    // fixme: let canvas instance to access editor canvas state
    canvas && Object.assign(canvas, {canvasState})
  }, [canvas, canvasState])
  
  return (
    <EditorProvider
      value={{
        canvas,
        setCanvas,
        panelOpen: sourcePanelOpen,
        setPanelOpen: setSourcePanelOpen,
        emitter,
        canvasState,
        setCanvasState,
        canvasObjects,
        setCanvasObjects,
        getCanvasObjects
      }}
    >
      <div className={cs(styles.wrap, className)}>
        {!canvas && <Loading />}
        {canvas && renderTopbar?.(canvas!)}
        <div className={cs(styles.main, mainClassName)}>
          {(!canvas || canvasState.preview || canvas.canvas.getActiveObjects().length === 0) ? null : <ObjectHandlers />}
          {canvas && renderLeftPanel?.(canvas)}
          <div
            ref={canvasElParent as LegacyRef<any>}
            className={cs(styles.canvasWrap, canvasClassName)}
            id='editor-canvas'
            style={{visibility: canvas ? 'visible' : 'hidden'}}
          >
            <canvas ref={canvasEl as LegacyRef<any>}/>
            {preview && <Preview />}
          </div>
          {children}
          {canvas && renderRightPanel?.(canvas!, selectedType)}
        </div>
      </div>
    </EditorProvider>
  );
}
