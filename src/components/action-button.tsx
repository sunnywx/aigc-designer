import { ReactNode } from "react";
import { IconButton, Tooltip } from "@mui/material";

interface Props {
  title?: ReactNode,
  icon?: ReactNode,
  iconSize?: string | number,
  onClick?: () => void,
  children?: ReactNode
}

export default function ActionButton({ title, icon, iconSize = '20px', children, onClick }: Props) {
  return (
    <Tooltip title={title}>
      <div>
        {children}
        {icon && (
          <IconButton sx={{ fontSize: iconSize }} onClick={() => onClick?.()}>
            {icon}
          </IconButton>
        )}
      </div>
    </Tooltip>
  )
}