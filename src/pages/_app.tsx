// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import '@/styles/variables/colors.css'
import '@/styles/globals.css'
import '@/styles/variables/custom.css'

import type { AppProps } from 'next/app'
import {ReactElement} from "react"
import Layout from '@/components/layout'

export default function App({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout=Component.getLayout || ((page: ReactElement): ReactElement=> <Layout>{page}</Layout>);
  return getLayout(<Component {...pageProps} />)
}
