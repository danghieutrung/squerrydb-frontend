import type { AppProps } from "next/app";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";

import "../app/globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>SquerryDB</title>
        <meta
          name="description"
          content="Chart the IMDb rating of every episode of any TV series."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/squirrel_icon.png" sizes="any" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
