import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Grid, TextField, Typography, Select, MenuItem } from '@mui/material'
import { FormValues, ImageSize } from './types'
import styles from './form.module.scss'
import { ForwardedRef, forwardRef, useEffect, useState, useImperativeHandle, useRef } from 'react'
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

interface Props {
  onClose?: () => void;
}

export interface Text2ImageFormRef {
  generate: () => void
}

type ImageItem = {
  url: string
}

function Text2ImageForm({ onClose }: Props, ref: ForwardedRef<Text2ImageFormRef>) {
  const {canvas}=useEditor()
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedImages, setSelectedImages]=useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormik<FormValues>({
    initialValues: {
      prompt: '',
      count: 1,
      size: ImageSize.small
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("prompt is required")
    }),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      
      try {
        // mock images
        // await sleep(1000)
        // setImages(mockImages)
        
        const resp: any=await axios.post<{}, {result: ImageItem[]}>('/api/text2img/openai', {
          p: values.prompt,
          size: values.size,
          count: values.count
        }, {
          timeout: 1000 * 20 // 20s
        })
        setImages(resp.data.result)
      } catch (error: any) {
        if (error.response) {
          enqueueSnackbar(error.response.statusText, { variant: 'error' })
        } else {
          enqueueSnackbar(error.message, { variant: 'error' })
        }
      } finally {
        setSubmitting(false)
      }
      
    }
  })
  
  useImperativeHandle(ref, () => ({
    generate: () => handleSubmit(),
  }))
  
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
            onClick={handleSubmit as any}
            form='aigc-form'
            disabled={isSubmitting}
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
            disabled={isSubmitting || selectedImages.length === 0}
          >
            Add image
          </Button>
        </div>
      )}
    >
      <div className={styles.wrap}>
        <form className={styles.form} onSubmit={handleSubmit} id='aigc-form'>
          <div className={styles.item}>
            <Typography>Prompt</Typography>
            <TextField
              name='prompt'
              multiline
              variant="outlined"
              size='small'
              rows={4}
              fullWidth
              value={values.prompt}
              onChange={handleChange}
              placeholder='Please input prompt to generate image'
              error={!!errors.prompt}
              helperText={errors.prompt}
            />
          </div>
          <div className={styles.item}>
            <Typography>Count</Typography>
            <Select
              name='count'
              value={values.count}
              onChange={handleChange}
              size='small'
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </div>
          <div className={styles.item}>
            <Typography>Size</Typography>
            <Select
              name='size'
              size='small'
              value={values.size}
              onChange={handleChange}
            >
              <MenuItem value={ImageSize.small}>256 x 256</MenuItem>
              <MenuItem value={ImageSize.medium}>512 x 512</MenuItem>
              <MenuItem value={ImageSize.large}>1028 x 1028</MenuItem>
            </Select>
          </div>
        </form>
    
        <div className={styles.result}>
          {isSubmitting && <Loading/>}
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
    
        {isSubmitting && <TimeCounter/>}
      </div>
    </Modal>
  );
}

const AigcForm = forwardRef(Text2ImageForm)

export default AigcForm
