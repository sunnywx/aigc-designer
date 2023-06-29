import {useEditor} from '@/editor'
import { Button, Tooltip, Typography } from '@mui/material';
import styles from './index.module.scss'
import * as Icons from 'react-icons/fa';
import React from "react";

export default function IconPanel() {
  const {canvas}=useEditor()
  const icons2 = Object.entries(Icons)
  // const icons = [
  //   { iconComponent: Icons.FaCameraRetro, label: 'Camera' },
  //   { iconComponent: Icons.FaBox, label: 'Camera' },
  //   { iconComponent: Icons.FaCannabis, label: 'Camera' },
  //   { iconComponent: Icons.FaBullhorn, label: 'Camera' },
  //   { iconComponent: Icons.FaBullseye, label: 'Camera' },
  //   { iconComponent: Icons.FaCheckDouble, label: 'Camera' },
  // ];
  
  icons2.length = 100;
  return (
    <div className={styles.iconPanelWrapper}>
      <Typography variant='body1'>
        Icons
      </Typography>
      <div className={styles.iconContentContainer}>
        {icons2.map((icon, index) => (
          <Tooltip
            title={icon[0]}
          >
            <Button key={index} onClick={() => canvas?.addIcon(icon[1])}>
              {React.createElement(icon[1], { size: 20 })}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
