import {useState} from "react"
import cs from 'classnames'
import {useEditor} from '@/editor'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import ActionButton from '@/components/action-button'
import {BiChevronsDown, BiChevronsUp, BiArrowToTop, BiArrowToBottom } from 'react-icons/bi'

import styles from './style.module.scss'
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight } from 'react-icons/fa'
import { Box, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material'
import { ColorInput } from '@/components/ColorInput'

interface Props {
  className?: string;
  layersOnly?: boolean;
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

export default function ObjectHandlers({className, layersOnly=false}: Props) {
  const {canvas, canvasState, canvasObjects, setCanvasObjects, selectedObject}=useEditor()
  const [strokeColor, setStrokeColor] = useState('')
  const [fillColor, setFillColor] = useState('')
  
  if (canvasObjects && canvasObjects.length === 0) return null;

  const onSetStrokeColor = (color: string) => {
    canvas?.setStrokeColor(color)
  }

  const onSetFillColor = (color: string) => {
    canvas?.setFillColor(color)
  }

  return (
    <div className={cs(styles.handlers, className)}>
      {canvas && !layersOnly && <>
        {selectedObject && selectedObject?.type !== "text" && (
        <>
          <ColorInput type="fill" value={fillColor || canvas.options.fillColor} onChange={setFillColor} changeHandler={onSetFillColor} />
          {selectedObject?.type !== "icon" && <ColorInput type="stroke" value={strokeColor || canvas?.options.strokeColor} onChange={setStrokeColor} changeHandler={onSetStrokeColor} />}
        </>)}
        {selectedObject && selectedObject?.type === "text" && (
          <>
            <Tooltip
              title="Font family"
            >
              <Select
                className={styles.fontFamilySelector}
                defaultValue={fontArr[0]}
                onChange={e => canvas?.setTextFontFamily(e.target.value)}
              >
                {fontArr.filter(Boolean).map(font => (
                  <MenuItem key={font} value={font}>
                    <Typography fontFamily={font} fontSize="14px">{font}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
            <ColorInput type="stroke" value={strokeColor || canvas?.options.strokeColor} onChange={setStrokeColor} changeHandler={onSetStrokeColor} />
            <Tooltip title="Font-size">
              <Box
                sx={{
                  display: "flex",
                  width: "max-content",
                  maxHeight: "30px",
                  alignItems: "center",
                  position: "relative",
                  "& .MuiInputBase-root": {
                    maxHeight: "30px",
                  },
                  "& > p": {
                    width: "max-content",
                    display: "grid",
                    placeItems: "center",
                  },
                }}
              >
                <TextField
                  defaultValue={40}
                  onChange={e => canvas?.setTextFontSize(e.target.value)}
                  sx={{
                    width: "60px",
                    "& input": {
                      paddingInline: "14px 8px"
                    }
                  }}
                  inputProps={{
                    type: "number",
                  }}
                />
                <Typography ml={1} component="p" fontSize="14px" fontStyle="italic" color="var(--gray-400)">px</Typography>
              </Box>
            </Tooltip>
            <div>
              <ActionButton
                title='Align left' icon={<FaAlignLeft  />}
                onClick={()=> {
                  canvas?.setTextAlign("left")
                  setCanvasObjects(canvas!.canvas.getObjects())
                }}
              />
              <ActionButton
                title='Align center' icon={<FaAlignCenter />}
                onClick={()=> {
                  canvas?.setTextAlign("center")
                  setCanvasObjects(canvas!.canvas.getObjects())
                }}
              />
              <ActionButton
                title='Align right' icon={<FaAlignRight />}
                onClick={()=> {
                  canvas?.setTextAlign("right")
                  setCanvasObjects(canvas!.canvas.getObjects())
                }}
              />
              <ActionButton
                title='Justify' icon={<FaAlignJustify />}
                onClick={()=> {
                  canvas?.setTextAlign("justify")
                  setCanvasObjects(canvas!.canvas.getObjects())
                }}
              />
            </div>
          </>
        )}
      </>}
      <div>
        <ActionButton
          title='Bring to top layer' icon={<BiArrowToTop />}
          onClick={()=> {
            canvas!.canvas?.getActiveObject()?.bringToFront()
            setCanvasObjects(canvas!.canvas.getObjects())
          }}
        />
        <ActionButton
          title='Send to bottom layer' icon={<BiArrowToBottom />}
          onClick={()=> {
            canvas!.canvas?.getActiveObject()?.sendToBack()
            setCanvasObjects(canvas!.canvas.getObjects())
          }}
        />
        <ActionButton
          title='Bring layer up' icon={<BiChevronsUp />}
          onClick={()=> {
            canvas!.canvas?.getActiveObject()?.bringForward()
            setCanvasObjects(canvas!.canvas.getObjects())
          }}
        />
        <ActionButton
          title='Send layer down' icon={<BiChevronsDown />}
          onClick={()=> {
            canvas!.canvas?.getActiveObject()?.sendBackwards()
            setCanvasObjects(canvas!.canvas.getObjects())
          }}
        />
        <ActionButton
          title='Delete' icon={<MdOutlineDeleteOutline />}
          onClick={()=> {
            canvas?.deleteSelected()
            setCanvasObjects(canvas!.canvas.getObjects())
          }}
        />
      </div>
    </div>
  );
}
