import {useEditor} from '@/editor'
import styles from './index.module.scss'
import {Grid, Typography} from '@mui/material'
import Button from '@/components/button'
import axios from 'axios'
import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack'
import Loading from '@/components/loading'

type Photo={
  id: string | number;
  url: string
}

export default function PhotoPanel() {
  const {canvas}=useEditor()
  const {enqueueSnackbar}=useSnackbar()
  const [images, setImages]=useState<Photo[]>([])
  const [loading, setLoading]=useState(false)
  
  useEffect(()=> {
    setLoading(true)
    axios.get('/api/get-photos').then(({data: {photos}})=> {
      setImages(photos)
    }).catch(err=> {
      enqueueSnackbar(err.message, { variant: 'error' })
    }).finally(()=> setLoading(false))
  }, [])
  
  function renderImages(){
    if(loading){
      return <Loading />
    }
    
    if(!images.length){
      return <div>No Image</div>
    }
    
    return (
      <>
        {images.map(({id, url})=> (
          <div
            key={id}
            className={styles.item}
            style={{backgroundImage: `url(${url})`}}
            onClick={()=> {
              canvas?.addImage(url)
            }}
          />
        ))}
      </>
    )
  }
  
  return (
    <div className={styles.wrap}>
      <Grid>
        <Button variant='contained'>Upload image</Button>
      </Grid>
      <Grid container flexDirection='column' mt='20px'>
        <Typography>Recent Images</Typography>
        <div className={styles.images}>
          {renderImages()}
        </div>
      </Grid>
    </div>
  );
}
