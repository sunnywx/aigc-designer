import { Button, Tooltip } from "antd";

export const IconButton = ({ children, className, disabled=false, icon, onClick, tooltipPlacement="bottom", style, tooltipTitle, type }) => {
  const s = ["icon-button"]
  function getBtnClass(...arg) {
    return arg.filter(item => item).join(" ");
  }
  return (
    <Tooltip title={disabled ? false : tooltipTitle} placement={tooltipPlacement}>
      <Button
        type={type}
        className={getBtnClass(disabled ? "disabled" : (className, "icon-button"))}
        disabled={disabled}
        onClick={onClick}
        style={style}
      >
        {icon}
        {children && children}
      </Button>
    </Tooltip>
  )
}
