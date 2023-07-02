import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Grid, TextField, Typography, Select, MenuItem, Tabs, Tab } from '@mui/material'
import { FormValues, ImageSize, ImageItem, Model } from './types'
import styles from './form.module.scss'
import { ForwardedRef, forwardRef, useEffect, useState, useImperativeHandle, useRef, useMemo } from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import Loading from '@/components/loading'
import { ImFileEmpty } from 'react-icons/im'
import Modal from "@/components/modal";
import Button from "@/components/button";
import {sleep, mockImages} from './utils'
import TimeCounter from './time-counter'
import cs from 'classnames'
import {BsCheck2Circle} from 'react-icons/bs'
import {useEditor} from '@/editor'
import OpenaiModel, {useOpenAIFormProps} from './openai-model'
import SDModel, {useSDFormProps} from './sd-model'

interface Props {
  onClose?: () => void;
}

export interface Text2ImageFormRef {
  generate: () => void
}

function Text2ImageForm({ onClose }: Props, ref: ForwardedRef<Text2ImageFormRef>) {
  const {canvas}=useEditor()
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedImages, setSelectedImages]=useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [model, setModel]=useState<Model>('openai')
  const openaiFormProps=useOpenAIFormProps(setImages)
  const sdFormProps=useSDFormProps(setImages)
  const {loading, disabled, submitHandler}=useMemo<{
    loading: boolean,
    disabled: boolean,
    submitHandler: ()=> void
  }>(()=> {
    if(model === 'openai'){
      const {isSubmitting, errors, handleSubmit}=openaiFormProps
      return {
        loading: isSubmitting,
        disabled: isSubmitting || Object.keys(errors).length > 0,
        submitHandler: handleSubmit
      }
    }
    if(model === 'sd'){
      const {isSubmitting, errors, handleSubmit}=sdFormProps
      return {
        loading: isSubmitting,
        disabled: isSubmitting || Object.keys(errors).length > 0,
        submitHandler: handleSubmit
      }
    }
  }, [model, openaiFormProps, sdFormProps])
  
  function onAddImages(){
    if(selectedImages.length === 0){
      enqueueSnackbar('Please select at least one image')
      return
    }
    
    selectedImages.forEach(img=> canvas?.addImage(img))
    onClose?.()
  }
  
  return (
    <Modal
      open={true}
      title='AI Generative image'
      onClose={()=> onClose?.()}
      width={1000}
      footer={(
        <div>
          <Button
            onClick={submitHandler}
            disabled={disabled}
            loading={loading}
            variant='contained'
            color='secondary'
            style={{marginRight:'8px'}}
          >
            Generate image
          </Button>
          <Button
            onClick={onAddImages}
            variant='contained'
            color='primary'
            disabled={loading || selectedImages.length === 0}
          >
            Add image
          </Button>
        </div>
      )}
    >
      <div className={styles.wrap}>
        <div className={styles.leftPanel}>
          <Tabs value={model} onChange={(e, tab)=> setModel(tab)} sx={{marginBottom: "10px"}}>
            <Tab value='openai' label='OpenAI' />
            <Tab value='sd' label='Stable Diffusion' />
          </Tabs>
  
          {model === 'openai' && (
            <OpenaiModel formProps={openaiFormProps}/>
          )}
  
          {model === 'sd' && (
            <SDModel formProps={sdFormProps}/>
          )}
        </div>
        <div className={styles.result}>
          {loading && <Loading/>}
          
          {images.length > 0 && (
            <div className={styles.images}>
              {images.map(({url}, idx) => {
                return (
                  <div
                    key={url}
                    className={cs(styles.imgItem, {[styles.selected]: selectedImages.includes(url)})}
                    onClick={()=> setSelectedImages(prevImages=> {
                      if(prevImages.includes(url)){
                        return prevImages.filter(v=> v !== url)
                      } else {
                        return [...prevImages, url]
                      }
                    })}
                  >
                    <img
                      loading='lazy'
                      src={url}
                      alt=""
                    />
                    {selectedImages.includes(url) && <div className={styles.mask}><BsCheck2Circle /></div>}
                  </div>
                )
              })}
            </div>
          )}
          {images.length === 0 && (
            <div className={styles.empty}>
              <ImFileEmpty/>
              <Typography>No image</Typography>
            </div>
          )}
        </div>
    
        {loading && <TimeCounter/>}
      </div>
    </Modal>
  );
}

const AigcForm = forwardRef(Text2ImageForm)

export default AigcForm
