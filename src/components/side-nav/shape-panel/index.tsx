import {useEditor} from '@/editor'
import styles from './index.module.scss'
import { Button, Typography } from "@mui/material";
import { BsFillTriangleFill, BsFillCircleFill } from "react-icons/bs"
import { BiSolidRectangle } from "react-icons/bi"
import { FaLongArrowAltRight, FaMinus } from "react-icons/fa"

export default function ShapePanel() {
  const {canvas}=useEditor()
  
  const onAddCircle = () => {
    canvas?.addCircle()
  }
  const onAddRectangle = () => {
    canvas?.addRectangle()
  }
  const onAddTriangle = () => {
    canvas?.addTriangle()
  }
  const onAddLine = () => {
    canvas?.addLine()
  }
  const onAddArrow = () => {
    canvas?.addArrow()
  }
  
  return (
    <div className={styles.shapesWrapper}>
      <Typography variant='caption'>Shapes</Typography>
      <Button size="small" onClick={onAddCircle}>
        <BsFillCircleFill />
        <Typography variant='caption' textTransform="capitalize">circle</Typography>
      </Button>
      <Button size="small" onClick={onAddRectangle}>
        <BiSolidRectangle />
        <Typography variant='caption' textTransform="capitalize">rectangle</Typography>
      </Button>
      <Button size="small" onClick={onAddTriangle}>
        <BsFillTriangleFill />
        <Typography variant='caption' textTransform="capitalize">triangle</Typography>
      </Button>
      <Typography variant='caption'>Lines</Typography>
      <Button size="small" onClick={onAddLine}>
        <FaMinus />
        <Typography variant='caption' textTransform="capitalize">line</Typography>
      </Button>
      <Button size="small" onClick={onAddArrow}>
        <FaLongArrowAltRight />
        <Typography variant='caption' textTransform="capitalize">arrow</Typography>
      </Button>
    </div>
  );
}
