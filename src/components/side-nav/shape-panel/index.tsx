import {useEditor} from '@/editor'
import styles from './index.module.scss'
import { Button } from "@mui/material";

export default function ShapePanel() {
  const {canvas}=useEditor()
  
  const onAddCircle = () => {
    canvas?.addCircle()
  }
  const onAddRectangle = () => {
    canvas?.addRectangle()
  }
  const onAddLine = () => {
    canvas?.addLine()
  }
  
  return (
    <>
      <Button variant="contained" size="small" onClick={onAddCircle}>Add circle</Button>
      <Button variant="contained" size="small" onClick={onAddRectangle}>Add Rectangle</Button>
      <Button variant="contained" size="small" onClick={onAddLine}>Add Line</Button>
    </>
  );
}
