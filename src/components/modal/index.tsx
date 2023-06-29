import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import { ReactNode, useState } from "react";
import {AiOutlineClose} from 'react-icons/ai'
import cs from 'classnames'
import styles from './modal.module.scss'

interface Props {
  open?: boolean;
  width?: number | string;
  fullWidth?: boolean;
  fullScreen?: boolean;
  className?: string;
  onClose?: ()=> void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  open,
  className,
  onClose,
  title,
  children,
  footer,
  width=650,
  fullScreen=false,
  fullWidth=false
}: Props) {
  function handleClose(ev: any, reason: string){
    if (reason && reason == "backdropClick"){
      return;
    }
    
    onClose?.()
  }
  
  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      className={styles.modal}
      fullWidth={!!fullWidth}
      fullScreen={!!fullScreen}
      disableEscapeKeyDown
    >
      <DialogTitle>
        {title}
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <AiOutlineClose />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent className={cs(styles.body, className)} sx={width ? {width} : {}}>
        {children}
      </DialogContent>
      <DialogActions>{footer}</DialogActions>
    </Dialog>
  );
}
