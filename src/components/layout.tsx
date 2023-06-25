import { ReactNode } from "react";
import Head from 'next/head'
import {ThemeProvider} from '@mui/material/styles'
import { CssBaseline } from "@mui/material";
import theme from '../theme'

export default function Layout({children}: {children: ReactNode}) {
  return (
    <>
      <Head>
        <title>AIGC designer</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </>
  );
}
