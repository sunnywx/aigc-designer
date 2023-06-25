import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { Canvas } from '@/editor'
import styles from './index.module.scss'

interface Props {
  canvas: Canvas
}

export default function Topbar({ canvas }: Props) {
  return (
    <AppBar position="static" className={styles.wrap}>
      <Toolbar variant="dense">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item md={4}><Typography>AIGC designer</Typography></Grid>
          <Grid container item md={4} justifyContent="center" className={styles.zoomer}>
            zoom in/out
          </Grid>
          <Grid item md={4}>
            <Grid container alignItems="center" justifyContent="flex-end" gap="10px" className={styles.btns}>
              <Button variant="outlined" size="small">+ New design</Button>
              <Button variant="outlined" size="small">Preview</Button>
              <Button variant="outlined" size="small">Download</Button>
              <Button variant="outlined" size="small">View schema</Button>
              {/*<Button variant='outlined' size="small">Login</Button>*/}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
