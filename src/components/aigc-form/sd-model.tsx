import { SDFormValues, ImageItem, SDImageSize, StylePreset } from "./types";
import { FormikProps, useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import axios from "axios";
import styles from "@/components/aigc-form/form.module.scss";
import { MenuItem, Select, TextField, Typography } from "@mui/material";

export function useSDFormProps(onFetchedImages: (images: ImageItem[])=> void): FormikProps<any> {
  const { enqueueSnackbar } = useSnackbar()
  
  return useFormik<SDFormValues>({
    initialValues: {
      prompt: '',
      count: 1,
      size: SDImageSize.small,
      steps: 30,
      style_preset: StylePreset.anime
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
        // onFetchedImages(mockImages)
        
        console.log('sd form: ', values)
        
        const resp: any = await axios.post<{}, { result: ImageItem[] }>('/api/text2img/sd', {
          p: values.prompt,
          size: values.size,
          count: values.count,
          style: values.style_preset
        }, {
          timeout: 1000 * 60 // 60s
        })
        onFetchedImages(resp.data.result as ImageItem[])
      } catch (error: any) {
        if (error.response) {
          enqueueSnackbar(error.response.data?.error, { variant: 'error' })
        } else {
          enqueueSnackbar(error.message, { variant: 'error' })
        }
      } finally {
        setSubmitting(false)
      }
      
    }
  })
}

interface Props {
  formProps: FormikProps<any>
}

export default function SdModel({formProps}: Props) {
  const { values, errors, handleChange, handleSubmit }=formProps
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
          <MenuItem value={SDImageSize.small}>512 x 512</MenuItem>
          <MenuItem value={SDImageSize.medium}>768 x 768</MenuItem>
        </Select>
      </div>
      <div className={styles.item}>
        <Typography>Style preset</Typography>
        <Select
          name='style_preset'
          size='small'
          value={values.style_preset}
          onChange={handleChange}
        >
          {Object.entries(StylePreset).map(([key, val])=> {
            return (
              <MenuItem key={key} value={val}>{key}</MenuItem>
            )
          }).filter(Boolean)}
        </Select>
      </div>
    </form>
  );
}
