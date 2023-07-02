import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./form.module.scss";
import { MenuItem, Select, TextField, Typography } from "@mui/material";
import { useSnackbar } from 'notistack'
import { FormValues, ImageSize, ImageItem } from './types'

export function useOpenAIFormProps(onFetchedImages: (images: ImageItem[])=> void): FormikProps<any> {
  const { enqueueSnackbar } = useSnackbar()
  
  return useFormik<FormValues>({
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
        // onFetchedImages(mockImages)
        
        const resp: any = await axios.post<{}, { result: ImageItem[] }>('/api/text2img/openai', {
          p: values.prompt,
          size: values.size,
          count: values.count
        }, {
          timeout: 1000 * 60  // 60s
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

export default function OpenaiModel({ formProps }: Props) {
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
          <MenuItem value={ImageSize.small}>256 x 256</MenuItem>
          <MenuItem value={ImageSize.medium}>512 x 512</MenuItem>
          <MenuItem value={ImageSize.large}>1028 x 1028</MenuItem>
        </Select>
      </div>
    </form>
  );
}
