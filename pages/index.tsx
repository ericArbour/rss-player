import Head from "next/head";
import styled from "styled-components";
import { signIn, signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { RssFeed } from "../db/models";
import { RssFeedDto, Podcast } from "../types";
import Link from "next/link";
import { fetchPodcast } from "../utils/rss";

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

export default function Home(props: HomeProps): JSX.Element {
  return (
    <Container>
      <Head>
        <title>RSS Player</title>
        <meta name="description" content="A simple RSS player for podcasts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content {...props} />
    </Container>
  );
}

function Content({ rssFeeds }: HomeProps): JSX.Element {
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
      <PodcastCards rssFeeds={rssFeeds} />
    </Main>
  );
}

interface PodcastCardsProps {
  rssFeeds: RssFeedDto[];
}

function PodcastCards({ rssFeeds }: PodcastCardsProps): JSX.Element {
  const { error, data, status } = useQuery(["rss-feeds"], async () => {
    const promises = rssFeeds.map((rssFeed) => fetchPodcast(rssFeed));
    const settledResults = await Promise.allSettled(promises);
    const rejects = settledResults
      .filter(
        (settledResult): settledResult is PromiseRejectedResult =>
          settledResult.status === "rejected"
      )
      .map((settledResult, index) => ({
        rssFeed: rssFeeds[index],
        reason: settledResult.reason,
      }));
    const podcasts = settledResults
      .filter(
        (settledResult): settledResult is PromiseFulfilledResult<Podcast> =>
          settledResult.status === "fulfilled"
      )
      .map((settledResult) => settledResult.value);
    return { rejects, podcasts };
  });

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") {
    console.error(error);
    return <div>Something went wrong...</div>;
  }

  if (data.rejects.length) {
    console.error(data.rejects);
  }

  return (
    <Grid>
      {data.podcasts.map((podcast) => {
        return <PodcastCard key={podcast.id} podcast={podcast} />;
      })}
    </Grid>
  );
}

interface PodcastCardProps {
  podcast: Podcast;
}

function PodcastCard({ podcast }: PodcastCardProps): JSX.Element {
  return (
    <Link href={`/podcasts/${podcast.id}`}>
      <Card>
        <h2>{podcast.title}</h2>
        {/* next/image can't be used because the domains are not statically known */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={podcast.imageSrc} alt="Title Image" width="100%" />
      </Card>
    </Link>
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
    font-size: 1rem;
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
