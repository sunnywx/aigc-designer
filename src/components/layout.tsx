import { ReactNode } from "react";
import Head from 'next/head'

export default function Layout({children}: {children: ReactNode}) {
  return (
    <>
      <Head>
        <title>AIGC designer</title>
      </Head>
      {children}
    </>
  );
}
