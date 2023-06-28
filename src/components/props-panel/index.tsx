import {Canvas} from '@/editor'
import styles from './style.module.scss'
import { Box, Button, Divider, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ColorPicker from '@/components/color-picker'
import Panel from '@/components/panel'
import { ColorInput } from '../ColorInput';
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight } from 'react-icons/fa';
import { makeStyles } from '@mui/styles';

interface Props {
  canvas: Canvas;
  selectedType?: string;
}

export default function PropsPanel({canvas, selectedType}: Props) {
  const classes = useStyles();
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

  const fontArr: string[] = [
    "Arial",
    "Times New Roman",
    "Calibri",
    "Verdana",
    "Courier New",
    "Segoe UI",
    "Tahoma",
    "Georgia",
    "Trebuchet MS",
    "Impact"
  ];

  return (
    <Panel
      title='Setting panel'
      className={styles.panel}
      pinned={false}
      closable={false}
      visible
    >
      <div className={styles.panelContent}>
        {selectedType === "text" && <>
          <Typography variant="caption">Text alignment</Typography>
          <div className={styles.alignmentBtns}>
            <IconButton onClick={() => canvas?.setTextAlign("left")}>
              <FaAlignLeft />
            </IconButton>
            <IconButton onClick={() => canvas?.setTextAlign("center")}>
              <FaAlignCenter />
            </IconButton>
            <IconButton onClick={() => canvas?.setTextAlign("right")}>
              <FaAlignRight />
            </IconButton>
            <IconButton onClick={() => canvas?.setTextAlign("justify")}>
              <FaAlignJustify />
            </IconButton>
          </div>
          <Typography variant="caption">Font</Typography>
          <div>
            <Select
              className={classes.fontFamilySelector}
              defaultValue={fontArr[0]}
              onChange={e => canvas?.setTextFontFamily(e.target.value)}
            >
              {fontArr.filter(Boolean).map(font => (
                <MenuItem value={font}>
                  <Typography fontFamily={font} fontSize="14px">{font}</Typography>
                </MenuItem>
              ))
              }
            </Select>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                maxHeight: "30px",
                alignItems: "center",
                marginTop: 1,
                "& .MuiInputBase-root": {
                  maxHeight: "30px",
                },
                "& > p": {
                  width: "100%",
                  display: "grid",
                  placeItems: "center"
                },
              }}
            >
              <TextField
                defaultValue={40}
                onChange={e => canvas?.setTextFontSize(e.target.value)}
                inputProps={{
                  type: "number"
                }}
              />
              <Typography component="p" fontSize="14px">Size in px</Typography>
            </Box>
          </div>
        </>}
        <Typography variant="caption">Stroke color</Typography>
        <ColorInput value={strokeColor || canvas.options.strokeColor} onChange={setStrokeColor} changeHandler={onSetStrokeColor} />
        <Typography variant="caption">Fill color</Typography>
        <ColorInput value={fillColor || canvas.options.fillColor} onChange={setFillColor} changeHandler={onSetFillColor} />
        
        <Divider color="primary" />
        
        <Button variant="contained" size="small" onClick={onDeleteAll}>Delete All</Button>
        <Button variant="contained" size="small" onClick={onDeleteSelected}>Delete Selected</Button>
        
        <ColorPicker onPick={color=> console.log('pick color: ', color)}/>
      </div>
    </Panel>
  );
}

const useStyles = makeStyles(() => ({
  fontFamilySelector: {
    height: "30px",
    width: "100%",
    "& .MuiSelect-select": {
      boxSizing: "border-box",
      padding: 0,
      paddingLeft: "14px",
      maxHeight: "30px",
    }
  }
}))