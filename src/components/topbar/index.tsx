import { AppBar, Grid, Toolbar, Typography, Switch } from "@mui/material";
import { Canvas, useEditor, downloadFile, useCanvasImage } from '@/editor'
import styles from './index.module.scss'
import Zoomer from './zoomer'
import { ReactNode, useState } from "react";
import {SiGooglepodcasts} from 'react-icons/si'
import {AiOutlineFileAdd, AiOutlineCloudDownload} from 'react-icons/ai'
import {GrView} from 'react-icons/gr'
import {FaCode} from 'react-icons/fa'
import NewDesignModal from "./new-design-modal";
import AiImageModal from '@/components/aigc-form'
import ViewSchemaModal from './view-schema-modal'
import ActionButton from '@/components/action-button'

export default function Topbar() {
  const {canvas, canvasState, setCanvasState}=useEditor()
  const [newFileOpen, setNewFileOpen]=useState(false)
  const [aiOpen, setAiOpen]=useState(false)
  const [schemaOpen, setSchemaOpen]=useState(false)
  const {getImageData}=useCanvasImage(true)
  
  function onDownload(){
    // todo: move filename to New design form config
    downloadFile(getImageData(), 'aigc-design-01.png')
  }
  
  return (
    <AppBar position="static" className={styles.wrap}>
      <Toolbar variant="dense">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item md={4}>
            <Typography>AIGC designer</Typography>
          </Grid>
          <Grid container item md={4} justifyContent="center">
            <Zoomer />
          </Grid>
          <Grid item md={4}>
            <Grid container alignItems="center" justifyContent="flex-end" gap="10px" className={styles.btns}>
              {/*<ActionButton icon={<AiOutlineFileAdd />} title='New design' onClick={()=> setNewFileOpen(true)}/>*/}
              <ActionButton icon={'AI'} title='AI generative image' onClick={()=> setAiOpen(true)}/>
              <ActionButton icon={<FaCode />} title='View schema' onClick={()=> setSchemaOpen(true)}/>
              <ActionButton title='Preview'>
                <Switch
                  color={'purple' as any}
                  value={canvasState.preview}
                  onChange={e=> setCanvasState(prev=> ({...prev, preview : e.target.checked}))}
                />
              </ActionButton>
              <ActionButton icon={<AiOutlineCloudDownload />} title='Download' onClick={onDownload}/>
              {/*<Button variant='outlined' size="small">Login</Button>*/}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
      
      {newFileOpen && <NewDesignModal onClose={()=> setNewFileOpen(false)}/>}
      {aiOpen && <AiImageModal onClose={()=> setAiOpen(false)} />}
      {schemaOpen && <ViewSchemaModal onClose={()=> setSchemaOpen(false)} />}
    </AppBar>
  );
}
