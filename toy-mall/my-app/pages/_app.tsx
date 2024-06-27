import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import { ThemeProvider } from "@/lib/ThemeContext";
import Container from "@/components/Container";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <ThemeProvider>
      <Header />
      <Container page>
        <Component {...pageProps} />
      </Container>
      </ThemeProvider>  
    </>
  );
}
