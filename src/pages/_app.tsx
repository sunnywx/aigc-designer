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
