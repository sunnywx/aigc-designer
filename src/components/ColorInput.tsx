import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
  value?: string;
  onChange: Dispatch<SetStateAction<string>>;
  changeHandler: (color: string) => void;
}

export const ColorInput = ({ value, onChange, changeHandler }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.colorPicker}>
      <input
        type='color'
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
        className={classes.colorInput}
        />
      <input
        type='text'
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
        className={classes.textInput}
      />
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  colorPicker: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    border: "1px solid var(--blue-300)",
    height: "30px",
    borderRadius: 4,
    "&:hover": {
      borderColor: "var(--blue-500)"
    }
  },
  colorInput: {
    border: "none !important",
    backgroundColor: "transparent",
    position: "absolute",
    paddingInline: "10px !important",
    width: "50px !important",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer"
  },
  textInput: {
    border: "none !important",
    paddingLeft: "50px !important",
    outline: "none",
    width: "100%"
  },
  colorButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: "none",
    textTransform: "none",
    paddingInline: "10px !important",
    minWidth: "auto"
  }
}))