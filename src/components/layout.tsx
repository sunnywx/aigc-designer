// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

import { ReactNode } from "react";
import Head from 'next/head'
import {ThemeProvider} from '@mui/material/styles'
import { CssBaseline } from "@mui/material";
import theme from '../theme'
import {Roboto} from '@next/font/google'

// see: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
// const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

export default function Layout({children}: {children: ReactNode}) {
  return (
    <>
      <Head>
        <title>AIGC designer</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className={roboto.className}>
          {children}
        </main>
      </ThemeProvider>
    </>
  );
}
