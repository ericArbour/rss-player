import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import styled from "styled-components";
import Head from "next/head";

import "./globals.css";
import { queryClient } from "../utils/react-query";

type WithSession = {
  session: Session | null;
};

export default function App({
  Component,
  pageProps,
}: AppProps<WithSession>): JSX.Element {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Container>
          <Head>
            <title>RSS Player</title>
            <meta
              name="description"
              content="A simple RSS player for podcasts."
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </Container>
      </QueryClientProvider>
    </SessionProvider>
  );
}

const Container = styled.div`
  padding: 0 2rem;
`;
