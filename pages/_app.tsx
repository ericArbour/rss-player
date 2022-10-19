import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import "./globals.css";

type WithSession = {
  session: Session;
};

export default function App({
  Component,
  pageProps,
}: AppProps<WithSession>): JSX.Element {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
