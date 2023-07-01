import { Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { Dispatch, SetStateAction } from 'react'
import clsx from "clsx"

interface Props {
  value?: string;
  changeHandler: (color: string) => void;
  type: "stroke" | "fill";
}

export const ColorInput = ({ value, changeHandler, type }: Props) => {
  const classes = useStyles();

  return (
    <div className={type === "fill"? clsx(classes.colorPicker, classes.fillTypePicker) : classes.colorPicker}>
      <Tooltip
        title={type === "fill" ? "Fill color" : "Stroke color"}
      >
        <input
          type='color'
          value={value}
          onChange={(e) => {
            changeHandler(e.target.value)
          }}
          className={classes.colorInput}
        />
      </Tooltip>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  colorPicker: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    border: "1px solid #c4c4c4",
    height: "30px",
    borderRadius: 4,
    cursor: "pointer",
    "&:hover": {
      borderColor: "#000000"
    },
    "&:focus": {
      borderColor: "#556cd6"
    },
    "&:active": {
      borderColor: "#556cd6 !important"
    }
  },
  colorInput: {
    border: "none !important",
    backgroundColor: "transparent",
    paddingInline: "5px !important",
    padding: "0px !important",
    width: "40px !important",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
  },
  fillTypePicker: {
    borderRadius: "50%",
    height: "30px",
    width: "30px",
    position: "relative",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    padding: 0,
    "& input": {
      position: "absolute",
      padding: 0,
      left: "-30px",
      height: "40px",
      width: "100px !important",
      borderRadius: "50%",

    }
  }
}))