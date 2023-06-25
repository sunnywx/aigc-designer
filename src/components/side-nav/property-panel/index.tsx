import {useEditor} from '@/editor'
import styles from './index.module.scss'

export default function PropertyPanel() {
  const {canvas}=useEditor()
  
  return (
    <div className={styles.wrap}>
    </div>
  );
}
