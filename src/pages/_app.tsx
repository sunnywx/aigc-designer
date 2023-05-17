import '@/styles/globals.css'
import '../libs/fontawesome-5.2.0/css/all.css';
import '../styles/index.less';

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  )
}
