import { useEditor } from '@/editor'
import styles from './index.module.scss'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import {PiHandGrabbing} from 'react-icons/pi'
import { useCallback, useEffect, useMemo, useState } from "react";
import ActionButton from '@/components/action-button'
import cs from 'classnames'

interface Props {

}

export default function Zoomer(props: Props) {
  const { canvas, emitter, canvasState, setCanvasState } = useEditor()
  const zoomLabel=useMemo(()=> {
    return (parseInt(String((canvasState.zoom || 1)?.toFixed(2) * 100))) + '%'
  }, [canvasState.zoom])
  
  function syncZoom(zoom?: number){
    setCanvasState(prev=> ({...prev, zoom: zoom ?? canvas?.canvas?.getZoom() as number}))
  }
  
  const enableDragMode=()=> {
    canvas?.canvas?.discardActiveObject()
    canvas?.canvas?.requestRenderAll()
    setCanvasState(prev=> ({...prev, dragMode: !prev.dragMode}))
  }
  
  useEffect(()=> {
    // listen to zoom-change event
    emitter.on('zoomChange', syncZoom)
  }, [])
  
  return (
    <div className={styles.zoomer}>
      <ActionButton title='Zoom in' icon={<BiPlusCircle size={24}/>} onClick={()=> {
        canvas?.zoomIn()
        syncZoom()
      }}/>
      <ActionButton title='Reset zoom'>
        <div className={styles.reset} onClick={()=> {
          canvas?.zoomFit()
          syncZoom()
        }}>{zoomLabel}</div>
      </ActionButton>
      <ActionButton title='Zoom out' icon={<BiMinusCircle size={24}/>} onClick={()=> {
        canvas?.zoomOut()
        syncZoom()
      }} />
      <ActionButton
        title='Drag canvas'
        icon={<PiHandGrabbing size={24}/>}
        onClick={enableDragMode}
        className={cs({[styles.active]: canvasState.dragMode})}
      />
    </div>
  );
}
