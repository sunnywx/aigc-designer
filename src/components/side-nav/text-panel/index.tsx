import {useEditor} from '@/editor'
import styles from './index.module.scss'
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
const FontFaceObserver=require('fontfaceobserver')
// import * as FontFaceObserver from 'fontfaceobserver'
import cs from 'classnames'
import {fonts} from "../config"

type FontOption={
  color?: string;
  size?: string | number;
  weight?: number;
  style?: 'normal' | 'italic'
}

export default function TextPanel() {
  const {canvas}=useEditor()
  const [text, setText] = useState('aigc')
  const [fontFamily, setFontFamily]=useState(fonts[0])
  
  function addHeading(){
    canvas?.addText(text, {
      fontFamily,
      fontSize: 72,
      fontWeight: 'bold'
    })
  }
  
  function addSubHeading(){
    canvas?.addText(text, {
      fontFamily,
      fontSize: 38,
      fontWeight: 'bold'
    })
  }
  
  function addBodyText(){
    canvas?.addText(text, {
      fontFamily,
    })
  }
  
  function loadFont(){
    const font = new FontFaceObserver('Monaco');
  
    font.load().then(function () {
      console.log('font loaded.');
    }).catch(function () {
      console.log('font load failed.');
    });
  }
  
  return (
    <div className={styles.wrap}>
      <Grid>
        <Typography>Give your text</Typography>
        <TextField
          name='text'
          variant="outlined"
          fullWidth
          value={text}
          onChange={ev=> setText(ev.target.value)}
          placeholder='Enter your design text'
        />
      </Grid>
      <Grid container justifyContent='space-between' gap='10px'>
        {/*<Button variant="outlined" size="small" onClick={loadFont}>Load font</Button>*/}
  
        <Button variant="contained" size="small" color='primary' onClick={addHeading}>Add a heading</Button>
        <Button variant="contained" size="small" color='secondary' onClick={addSubHeading}>Add a subheading</Button>
        <Button variant="outlined" size="small" onClick={addBodyText}>Add body text</Button>
      </Grid>
      <Grid>
        <Typography>Pick a style</Typography>
        <div className={styles.preview}>
          {fonts.map(f=> (
            <div
              key={f}
              style={{fontFamily: f}}
              onClick={()=> setFontFamily(f)}
              className={cs({[styles.selected]: fontFamily === f})}
            >
              {text || 'fancy text'}
            </div>
          ))}
        </div>
      </Grid>
    </div>
  );
}
