import { SketchPicker } from 'react-color';
import { ReactNode, useState, useEffect, useRef } from "react";
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import cs from 'classnames'

interface Props {
  title?: ReactNode,
  className?: string,
  onPick?: (color: string) => void
}

export default function ColorPicker({ title = 'Pick color', className, onPick }: Props) {
  const [color, setColor] = useState('#fff')
  const [visible, setVisible] = useState(false)
  const classes = useStyles()
  const wrapRef = useRef<HTMLDivElement>()
  
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [])
  
  function handleClickOutside(ev: any): void {
    if (!wrapRef.current?.contains(ev.target) || wrapRef.current === ev.target) {
      setVisible(false)
    }
  }
  
  return (
    <div className={cs(classes.wrap, className)} ref={wrapRef}>
      <Button
        variant='outlined'
        size='small'
        onClick={() => setVisible(prev => !prev)}
      >
        {title}
      </Button>
      {visible && (
        <SketchPicker
          color={color}
          onChangeComplete={color => {
            setColor(color.hex)
            onPick?.(color.hex)
          }}
        />
      )}
    </div>
  
  );
}

const useStyles = makeStyles(theme => ({
  wrap: {
    position: 'absolute'
  }
}))