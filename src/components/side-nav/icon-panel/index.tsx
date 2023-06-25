import {useEditor} from '@/editor'
import styles from './index.module.scss'

export default function IconPanel() {
  const {canvas}=useEditor()
  
  return (
    <div className={styles.wrap}>
    </div>
  );
}
