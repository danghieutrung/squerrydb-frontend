import type { AppProps } from "next/app";
import Head from "next/head";

import "../app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/squirrel_icon2.png" sizes="any" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
