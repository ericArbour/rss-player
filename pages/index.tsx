import styled from "styled-components";
import { signIn, useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";

import { authOptions } from "./api/auth/[...nextauth]";
import { RssFeed } from "../db/models";
import { RssFeedDto } from "../types";
import { Main } from "../components/main";
import { Title } from "../components/title";
import { Button } from "../components/button";
import { SignedInHeader } from "../components/signed-in-header";
import { PodcastCards } from "../components/podcast-cards";

interface HomeProps {
  session: Session | null;
  rssFeeds: RssFeedDto[];
}

/**
 * Per the NextAuth docs, returning the session prop
 * from getServerSideProps makes it available to the
 * SessionProvider in _app, which is why we don't
 * consume this prop directly in this component and
 * instead access it from useSession below.
 */
export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session)
    return {
      props: {
        session,
        rssFeeds: [],
      },
    };

  const rssFeeds = await RssFeed.findAll({
    where: { userId: session.user.id },
    raw: true,
  });

  return {
    props: {
      session,
      rssFeeds,
    },
  };
};

export default function Home({ rssFeeds }: HomeProps): JSX.Element {
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
      <SignedInHeader session={session} />
      <PodcastCards rssFeeds={rssFeeds} />
    </Main>
  );
}

const Description = styled.p`
  margin: 4rem 0;
  line-height: 1.5;
  font-size: 1.5rem;
  text-align: center;
`;
