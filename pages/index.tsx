import Head from "next/head";
import styled from "styled-components";
import { signIn, signOut, useSession } from "next-auth/react";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";

interface WithPossibleSession {
  session: Session | null;
}

export const getServerSideProps: GetServerSideProps<
  WithPossibleSession
> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session,
    },
  };
};

export default function Home(): JSX.Element {
  return (
    <Container>
      <Head>
        <title>RSS Player</title>
        <meta name="description" content="A simple RSS player for podcasts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content />
    </Container>
  );
}

function Content(): JSX.Element {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Main centerVertically>
        <Title big>RSS Player</Title>
        <Description>A simple RSS audio player for podcasts.</Description>
        <Button onClick={(): Promise<undefined> => signIn()}>Sign in</Button>
      </Main>
    );
  }

  return (
    <Main>
      <Header>
        <Title>RSS Player</Title>
        <SignedInUser>
          <p>Hello {session.user.email}!</p>
          <Button onClick={(): Promise<undefined> => signOut()}>
            Sign out
          </Button>
        </SignedInUser>
      </Header>
      <Grid>
        <Card href="https://nextjs.org/docs">
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </Card>
        <Card href="https://nextjs.org/learn">
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </Card>
        <Card href="https://github.com/vercel/next.js/tree/canary/examples">
          <h2>Examples &rarr;</h2>
          <p>Discover and deploy boilerplate example Next.js projects.</p>
        </Card>
        <Card href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
          <h2>Deploy &rarr;</h2>
          <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
        </Card>
      </Grid>
    </Main>
  );
}

const Container = styled.div`
  padding: 0 2rem;
`;

interface MainProps {
  centerVertically?: true;
}

const Main = styled.main<MainProps>`
  min-height: 100vh;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: ${({ centerVertically }): string =>
    centerVertically ? "center" : "flex-start"};
  align-items: center;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #eaeaea;
  justify-content: space-between;
  align-items: center;
`;

const SignedInUser = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

interface TitleProps {
  big?: true;
}

const Title = styled.h1<TitleProps>`
  margin: 0;
  line-height: 1.15;
  font-size: ${({ big }): string => (big ? "4rem" : "2rem")};
  text-align: center;
`;

const Description = styled.p`
  margin: 4rem 0;
  line-height: 1.5;
  font-size: 1.5rem;
  text-align: center;
`;

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 1.5rem;
`;

const Card = styled.a`
  margin: 1rem;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  max-width: 300px;

  & h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  & p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }

  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #222;
  }
`;

const Button = styled.button`
  background-color: black;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 1px solid #eaeaea;
  border-radius: 3px;

  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #222;
  }
`;
