import { useEffect, useState } from "react"
import { Canvas, useEditor } from '@/editor'
import styles from './style.module.scss'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button,  TextField, Typography } from "@mui/material";
import Panel from '@/components/panel'
import {
  FaHashtag,
  FaLongArrowAltRight,
  FaMinus
} from 'react-icons/fa';
import { TbLetterT } from 'react-icons/tb';
import { makeStyles } from '@mui/styles';
import cs from 'classnames'
import { BsFillCircleFill, BsFillTriangleFill } from 'react-icons/bs';
import { BiSolidRectangle } from 'react-icons/bi';
import { MdInsertPhoto, MdExpandMore } from 'react-icons/md';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import React from "react"
import ObjectHandlers from '@/editor/object-handlers';
import { ColorInput } from '../ColorInput';

interface Props {
  canvas: Canvas;
}

export default function PropsPanel({ canvas }: Props) {
  const classes = useStyles();
  const { canvasState } = useEditor()
  const { canvasObjects } = useEditor();
  const [bgColor, setBgColor] = useState('#ffffff');
  const [pageWidth, setPageWidth] = useState(600)
  const [pageHeight, setPageHeight] = useState(650)
  const [tab, setTab]=useState<'layer' | 'page'>('layer')
  
  const getIcon = (item: { type: string, name: string }) => {
    switch (item.type) {
      case "text":
        return <TbLetterT/>
      case "circle":
        return <BsFillCircleFill/>
      case "rectangle":
        return <BiSolidRectangle/>
      case "triangle":
        return <BsFillTriangleFill/>
      case "img":
        return <MdInsertPhoto/>
      case "icon":
        return <FaHashtag/>
      case "line":
        return <FaMinus/>
      case "arrow":
        return <FaLongArrowAltRight/>
      default:
        return <TfiLayoutPlaceholder/>
    }
  }

  const onSetBackgroundColor = (color: string) => {
    setBgColor(color)
    canvas?.setBackgroundColor(color)
  }

  useEffect(() => {
    canvas?.setCanvasDimensions(pageWidth, pageHeight)
  }, [pageWidth, pageHeight])
  
  
  return (
    <Panel
      title='Settings'
      className={cs(styles.panel, { [styles.preview]: !!canvasState.preview })}
      pinned={false}
      closable={false}
      visible
    >
      <div className={styles.panelContent}>
        <div className={classes.pageEditorContainer}>
          <Typography variant='body1'>Page</Typography>
          <div className={classes.bgSelectorContainer}>
            <Typography variant='caption'>Background-color:</Typography>
            <ColorInput type="stroke" value={bgColor || canvas?.options.backgroundColor} changeHandler={onSetBackgroundColor} />
          </div>
          <div>
            <Typography variant='caption'>Dimension:</Typography>
            <div className={classes.dimensionsContainer}>
              <Box
                sx={{
                  display: "flex",
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
                <Typography variant='caption' mr="4px">X:</Typography>
                <TextField
                  defaultValue={canvas.options.width}
                  onChange={e => setPageWidth(+e.target.value)}
                  sx={{
                    "& input": {
                      paddingInline: "14px 8px",
                    }
                  }}
                  inputProps={{
                    type: "number",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
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
                <Typography variant='caption' mr="4px">Y:</Typography>
                <TextField
                  defaultValue={canvas.options.height}
                  onChange={e => setPageHeight(+e.target.value)}
                  sx={{
                    "& input": {
                      paddingInline: "14px 8px",
                    }
                  }}
                  inputProps={{
                    type: "number",
                  }}
                />
              </Box>
            </div>
          </div>
        </div>
        {canvasObjects && canvasObjects.length !== 0 && <Accordion
          sx={{ overflow: "hidden", boxShadow: "none" }}
          disableGutters
        >
          <AccordionSummary
            expandIcon={<MdExpandMore size={24} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.accordionHeader}
          >
            <Typography variant='body1'>Layers</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionBody}>
            <ObjectHandlers layersOnly={true} className={classes.layerPanelObjects} />
            <div className={classes.layerContainer}>
              {canvasObjects.map((item: any, index: number) => (
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
              ))}
            </div>
          </AccordionDetails>
        </Accordion>}
      </div>
    </Panel>
  );
}

const useStyles = makeStyles(() => ({
  layerContainer: {
    display: "flex",
    flex: 1,
    maxHeight: "520px",
    marginTop: "10px",
    flexDirection: "column-reverse",
    rowGap: "5px",
    overflowY: "auto"
  },
  pageEditorContainer: {
    marginBottom: "10px"
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
  },
  accordionHeader: {
    paddingInline: 0,
    paddingBlock: 0,
    "& .Mui-expanded": {
      paddingBlock: 0

    }
  },
  accordionBody: {
    padding: 0,
  },
  bgSelectorContainer: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    marginTop: "10px"
  },
  dimensionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    columnGap: "10px",
    marginTop: "10px"
  }
}))