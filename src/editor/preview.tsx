import {useCanvasImage} from './ctx'
import styles from './style.module.scss'

export default function Preview() {
  const {getImageData}=useCanvasImage()
  
  return (
    <div className={styles.previewBox} style={{
      backgroundImage: `url(${getImageData()})`
    }}/>
  );
}
