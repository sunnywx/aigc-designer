import cs from 'classnames'
import {useEditor} from '@/editor'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import ActionButton from '@/components/action-button'
import {BiChevronsDown, BiChevronsUp, BiArrowToTop, BiArrowToBottom } from 'react-icons/bi'

import styles from './style.module.scss'

interface Props {
  className?: string
}

export default function ObjectHandlers({className}: Props) {
  const {canvas, canvasState}=useEditor()
  
  if(!canvas || canvasState.preview || canvas.canvas.getActiveObjects().length === 0) return null;
  
  return (
    <div className={cs(styles.handlers, className)}>
      <ActionButton title='Bring to top layer' icon={<BiArrowToTop />} onClick={()=> canvas.canvas?.getActiveObject()?.bringToFront()}/>
      <ActionButton title='Send to bottom layer' icon={<BiArrowToBottom />} onClick={()=> canvas.canvas?.getActiveObject()?.sendToBack()}/>
      <ActionButton title='Bring layer up' icon={<BiChevronsUp />} onClick={()=> canvas.canvas?.getActiveObject()?.bringForward()}/>
      <ActionButton title='Send layer down' icon={<BiChevronsDown />} onClick={()=> canvas.canvas?.getActiveObject()?.sendBackwards()}/>
      <ActionButton title='Delete' icon={<MdOutlineDeleteOutline />} onClick={()=> canvas?.deleteSelected()}/>
    </div>
  );
}
