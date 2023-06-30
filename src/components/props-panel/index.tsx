import {Canvas, useEditor} from '@/editor'
import styles from './style.module.scss'
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
// import ColorPicker from '@/components/color-picker'
import Panel from '@/components/panel'
import { ColorInput } from '../ColorInput';
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaHashtag, FaLongArrowAltRight, FaMinus } from 'react-icons/fa';
import { TbLetterT } from 'react-icons/tb';
import { makeStyles } from '@mui/styles';
import cs from 'classnames'
import { BsFillCircleFill, BsFillTriangleFill } from 'react-icons/bs';
import { BiSolidRectangle } from 'react-icons/bi';
import { MdInsertPhoto } from 'react-icons/md';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import React from "react"
import ObjectHandlers from '@/editor/object-handlers';

interface Props {
  canvas: Canvas;
  selectedType?: string;
}

export default function PropsPanel({canvas, selectedType}: Props) {
  const classes = useStyles();
  const [strokeColor, setStrokeColor] = useState('')
  const [fillColor, setFillColor] = useState('')
  const {canvasState}=useEditor()
  const { canvasObjects } = useEditor();
  console.log("index.tsx ~ line 23: canvasObjects:", canvasObjects);
  
  const onSetStrokeColor = (color: string) => {
    canvas?.setStrokeColor(color)
  }
  const onSetFillColor = (color: string) => {
    canvas?.setFillColor(color)
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

  const getIcon = (item: {type: string, name: string}) => {
    switch (item.type) {
      case "text":
        return <TbLetterT />
      case "circle":
        return <BsFillCircleFill />
      case "rectangle":
        return <BiSolidRectangle />
      case "triangle":
        return <BsFillTriangleFill />
      case "img":
        return <MdInsertPhoto />
      case "icon":
        return <FaHashtag />
      case "line":
        return <FaMinus />
      case "arrow":
        return <FaLongArrowAltRight />
      default:
        return <TfiLayoutPlaceholder />
    }
  }

  return (
    <Panel
      title='Setting panel'
      className={cs(styles.panel, {[styles.preview]: !!canvasState.preview})}
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
                <MenuItem key={font} value={font}>
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
          <Typography variant="caption">Stroke color</Typography>
          <ColorInput value={strokeColor || canvas.options.strokeColor} onChange={setStrokeColor} changeHandler={onSetStrokeColor} />
        </>}
        <Typography variant="caption">Fill color</Typography>
        <ColorInput value={fillColor || canvas.options.fillColor} onChange={setFillColor} changeHandler={onSetFillColor} />
        {canvasObjects && canvasObjects.length !== 0 && <>
          <Typography variant='caption'>Layers</Typography>
          <ObjectHandlers className={classes.layerPanelObjects} />
          <div className={classes.layerContainer}>
            {canvasObjects && canvasObjects.length !== 0 && canvasObjects.reverse()
              .map((item: any, index: number) => (
                <Button
                  key={index}
                  id={item.name}
                  className={classes.layerItem}
                  onClick={() => {
                    canvas.canvas.setActiveObject(item)
                    canvas.canvas.renderAll()
                  }}
                >
                  <div>
                    {getIcon(item)}
                  </div>
                  <Typography variant='caption'>{item.type === "icon" ? item.name.split("-")[0] : item.type}</Typography>
                </Button>
              ))
            }
          </div>
        </>}
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
  },
  layerContainer: {
    display: "flex",
    flex: 1,
    maxHeight: "520px",
    flexDirection: "column-reverse",
    rowGap: "5px",
    overflowY: "auto"
  },
  layerItem: {
    display: "flex",
    justifyContent: "flex-start",
    textTransform: "capitalize",
    alignItems: "center",
    paddingLeft: "10px",
    borderRadius: "4px",
    columnGap: "10px",
    cursor: "pointer",
    border: "1px solid var(--gray-200)",
    "&:hover, &:active, &:focus": {
      backgroundColor: "var(--gray-200)"
    },
    "& > div": {
      display: "grid",
      placeItems: "center"
    },
  },
  layerPanelObjects: {
    position: "static",
    transform: "none",
    width: "100%"

  }
}))