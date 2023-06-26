import {Canvas} from '@/editor'
import styles from './style.module.scss'
import { Button } from "@mui/material";
import { useState } from "react";
import ColorPicker from '@/components/color-picker'
import Panel from '@/components/panel'

interface Props {
  canvas: Canvas
}

export default function PropsPanel({canvas}: Props) {
  const [strokeColor, setStrokeColor] = useState('')
  const [fillColor, setFillColor] = useState('')
  
  const onSetStrokeColor = () => {
    canvas?.setStrokeColor(strokeColor)
  }
  const onSetFillColor = () => {
    canvas?.setFillColor(fillColor)
  }
  
  const onDeleteAll = () => {
    canvas?.deleteAll()
  }
  const onDeleteSelected = () => {
    canvas?.deleteSelected()
  }
  
  return (
    <Panel
      title='Setting panel'
      className={styles.panel}
      pinned={false}
      closable={false}
      visible
    >
      <div>
        <input
          type='text'
          value={strokeColor || canvas.options.strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
        />
        <Button variant="outlined" size="small" onClick={onSetStrokeColor}>Set Stroke Color</Button>
        <input
          type='text'
          value={fillColor || canvas.options.fillColor}
          onChange={(e) => setFillColor(e.target.value)}
        />
        <Button variant="outlined" size="small" onClick={onSetFillColor}>Set Fill Color</Button>
      </div>
      
      <div>
        <Button variant="outlined" size="small" onClick={onDeleteAll}>Delete All</Button>
        <Button variant="outlined" size="small" onClick={onDeleteSelected}>Delete Selected</Button>
      </div>
      
      <ColorPicker onPick={color=> console.log('pick color: ', color)}/>

    </Panel>
  );
}