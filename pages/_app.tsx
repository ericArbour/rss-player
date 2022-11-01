import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./globals.css";

const queryClient = new QueryClient();

type WithSession = {
  session: Session;
};

export default function App({
  Component,
  pageProps,
}: AppProps<WithSession>): JSX.Element {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
