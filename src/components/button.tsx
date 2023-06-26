import {Button as MuiButton, ButtonProps} from '@mui/material'
import {makeStyles} from '@mui/styles'
import cs from 'classnames'

// override mui button
export default function Button({className, ...rest}: ButtonProps) {
  const classes=useStyle()
  
  return (
    <MuiButton {...rest} className={cs(classes.button, className)}/>
  );
}

const useStyle=makeStyles(theme=> ({
  button: {
    textTransform: 'none'
  }
}))
