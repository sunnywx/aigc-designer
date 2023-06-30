import cs from 'classnames'
import {useEditor} from '@/editor'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import ActionButton from '@/components/action-button'

import styles from './style.module.scss'

interface Props {
  className?: string
}

export default function ObjectHandlers({className}: Props) {
  const {canvas, canvasState}=useEditor()
  
  if(!canvas || canvasState.preview || canvas.canvas.getActiveObjects().length === 0) return null;
  
  return (
    <div className={cs(styles.handlers, className)}>
      <ActionButton title='Delete' icon={<MdOutlineDeleteOutline />} onClick={()=> canvas?.deleteSelected()}/>
    </div>
  );
}
