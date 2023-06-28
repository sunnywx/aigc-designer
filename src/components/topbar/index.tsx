import { AppBar, Grid, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { Canvas } from '@/editor'
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
  const [newFileOpen, setNewFileOpen]=useState(false)
  const [aiOpen, setAiOpen]=useState(false)
  const [previewOpen, setPreviewOpen]=useState(false)
  const [schemaOpen, setSchemaOpen]=useState(false)
  
  function onDownload(){
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
              <ActionButton icon={<AiOutlineFileAdd />} title='New design' onClick={()=> setNewFileOpen(true)}/>
              <ActionButton icon={'AI'} title='AI generative image' onClick={()=> setAiOpen(true)}/>
              <ActionButton icon={<FaCode />} title='View schema' onClick={()=> setSchemaOpen(true)}/>
              <ActionButton icon={<GrView />} title='Preview' onClick={()=> setPreviewOpen(true)}/>
              <ActionButton icon={<AiOutlineCloudDownload />} tips='Download' onClick={onDownload}/>
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
