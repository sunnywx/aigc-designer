import { useEditor } from '@/editor'
import styles from './index.module.scss'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import { Tooltip, IconButton } from '@mui/material'
import { useEffect, useMemo, useState } from "react";
import ActionButton from '@/components/action-button'

interface Props {

}

export default function Zoomer(props: Props) {
  const { canvas } = useEditor()
  const [zoomLevel, setZoomLevel]=useState<number>(1)
  const zoomLabel=useMemo(()=> {
    return (parseInt(String(zoomLevel.toFixed(2) * 100))) + '%'
  }, [zoomLevel])
  
  const onZoomIn = () => {
    canvas?.zoomIn()
    setZoomLevel(canvas?.canvas?.getZoom() as number)
  }
  const onZoomOut = () => {
    canvas?.zoomOut()
    setZoomLevel(canvas?.canvas?.getZoom() as number)
  }
  const onZoomFit = () => {
    canvas?.zoomFit()
    setZoomLevel(canvas?.canvas?.getZoom() as number)
  }
  
  useEffect(()=> {
    canvas?.canvas?.setZoom(zoomLevel)
  }, [])
  
  return (
    <div className={styles.zoomer}>
      <ActionButton title='Zoom in' icon={<BiPlusCircle size={24}/>} onClick={onZoomIn}/>
      <ActionButton title='Reset zoom'>
        <div className={styles.reset} onClick={onZoomFit}>{zoomLabel}</div>
      </ActionButton>
      <ActionButton title='Zoom out' icon={<BiMinusCircle size={24}/>} onClick={onZoomOut} />
    </div>
  );
}
