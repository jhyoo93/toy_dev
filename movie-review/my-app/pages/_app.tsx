import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import { ThemeProvider } from "@/lib/ThemeContext";
import Container from "@/components/Container";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MOVIEW</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <Header />
        <Container page>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>  
    </>
  );
}
