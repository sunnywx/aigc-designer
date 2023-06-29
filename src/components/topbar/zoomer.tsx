import { useEditor } from '@/editor'
import styles from './index.module.scss'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import {PiHandGrabbing, PiCursorFill} from 'react-icons/pi'
import { useEffect, useMemo, useState } from "react";
import ActionButton from '@/components/action-button'
import cs from 'classnames'

interface Props {

}

export default function Zoomer(props: Props) {
  const { canvas, emitter, canvasState, setCanvasState } = useEditor()
  const zoomLabel=useMemo(()=> {
    // @ts-ignore
    return (parseInt(String((canvasState.zoom || 1)?.toFixed(2) * 100))) + '%'
  }, [canvasState.zoom])
  const [mode, setMode]=useState<'select' | 'drag'>('select')
  
  function syncZoom(zoom?: number){
    setCanvasState(prev=> ({...prev, zoom: zoom ?? canvas?.canvas?.getZoom() as number}))
  }
  
  useEffect(()=> {
    // listen to zoom-change event
    // @ts-ignore
    emitter.on('zoomChange', syncZoom)
  }, [])
  
  useEffect(()=> {
    if(mode === 'select'){
      setCanvasState(prev=> ({...prev, dragMode: false}))
    }
    if(mode === 'drag'){
      canvas?.canvas?.discardActiveObject()
      canvas?.canvas?.requestRenderAll()
      setCanvasState(prev=> ({...prev, dragMode: true}))
    }
  }, [mode])
  
  return (
    <div className={styles.zoomer}>
      <ActionButton
        title='Select mode'
        icon={<PiCursorFill size={22}/>}
        onClick={()=> setMode('select')}
        className={cs(styles.btnMode, {
          [styles.active]: mode === 'select',
          [styles.disable]: mode !== 'select'
        })}
      />
      <ActionButton
        title='Drag mode'
        icon={<PiHandGrabbing size={22}/>}
        onClick={()=> setMode('drag')}
        className={cs(styles.btnMode, {
          [styles.active]: mode === 'drag',
          [styles.disable]: mode !== 'drag',
        })}
      />
      
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
    </div>
  );
}
