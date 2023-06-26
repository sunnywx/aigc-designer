import { ReactNode, CSSProperties } from 'react';
import cs from 'classnames';
import {BsPin} from 'react-icons/bs'
import {MdClose} from 'react-icons/md'

import styles from './panel.module.scss'

interface Props {
  title?: string;
  width?: number | string;
  height?: number | string;
  pinnable?: boolean;
  closable?: boolean;
  visible?: boolean;
  pinned?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClose?: () => void;
  onPin?: () => void
}

export default function Panel({
  width,
  height='100%',
  title,
  pinnable,
  closable,
  visible,
  pinned,
  className,
  style,
  children,
  onClose,
  onPin,
}: Props) {
  return (
    <div
      className={cs(styles.panel, {[styles.closed]: !visible}, className)}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          {pinnable && (
            <div className={cs({ [styles.pinned]: pinned })} style={{marginRight: '10px'}}>
              <BsPin onClick={onPin}/>
            </div>
          )}
          {closable && (
            <div>
              <MdClose onClick={onClose}/>
            </div>
          )}
        </div>
      </div>
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}
