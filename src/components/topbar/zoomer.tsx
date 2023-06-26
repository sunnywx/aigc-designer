import { useEditor } from '@/editor'
import styles from './index.module.scss'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import { Tooltip, IconButton } from '@mui/material'
import { useEffect, useMemo, useState } from "react";

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
    // todo
  }
  
  useEffect(()=> {
    canvas?.canvas?.setZoom(zoomLevel)
  }, [])
  
  return (
    <div className={styles.zoomer}>
      <Tooltip title='Zoom in'>
        <IconButton onClick={onZoomIn}>
          <BiPlusCircle size={24}/>
        </IconButton>
      </Tooltip>
      <Tooltip title='reset zoom'>
        <div className={styles.reset} onClick={onZoomFit}>{zoomLabel}</div>
      </Tooltip>
      <Tooltip title='Zoom out'>
        <IconButton onClick={onZoomOut}>
          <BiMinusCircle size={24}/>
        </IconButton>
      </Tooltip>
    </div>
  );
}
