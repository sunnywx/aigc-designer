import {Canvas, useEditor} from '@/editor'
import styles from './style.module.scss'
import { Button, Typography } from "@mui/material";
// import ColorPicker from '@/components/color-picker'
import Panel from '@/components/panel'
import { FaHashtag, FaLongArrowAltRight, FaMinus } from 'react-icons/fa';
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
}

export default function PropsPanel({canvas}: Props) {
  const classes = useStyles();
  const {canvasState}=useEditor()
  const { canvasObjects, selectedObject } = useEditor();

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
        {canvasObjects && canvasObjects.length !== 0 && <>
          <Typography variant='caption'>Layers</Typography>
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
        </>}
      </div>
    </Panel>
  );
}

const useStyles = makeStyles(() => ({
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