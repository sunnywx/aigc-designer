import {useEditor} from '@/editor'
import styles from './index.module.scss'
import { Button } from "@mui/material";
import { useState } from "react";

export default function TextPanel() {
  const {canvas}=useEditor()
  const [text, setText] = useState('aigc')
  
  const onAddText = () => {
    canvas?.addText(text)
  }
  
  return (
    <div className={styles.wrap}>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="outlined" size="small" onClick={onAddText}>Add Text</Button>
    </div>
  );
}
