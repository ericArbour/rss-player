import { useQuery } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import styled from "styled-components";
import Link from "next/link";

import { authOptions } from "../../api/auth/[...nextauth]";
import { RssFeed } from "../../../db/models";
import { RssFeedDto } from "../../../types";
import { fetchPodcast } from "../../../utils/rss";
import { Main } from "../../../components/main";
import { SignedInHeader } from "../../../components/signed-in-header";
import { cardEffect } from "../../../utils/style-mixins";
import { PodcastPageContainer } from "../../../components/podcast-page-container";
import { PodcastPageImg } from "../../../components/podcast-page-img";
import { Loading } from "../../../components/Loading";

interface PodcastProps {
  session: Session;
  rssFeed: RssFeedDto;
}

/**
 * Per the NextAuth docs, returning the session prop
 * from getServerSideProps makes it available to the
 * SessionProvider in _app, which is why we don't
 * consume this prop directly in this component and
 * instead access it from useSession below.
 */
export const getServerSideProps: GetServerSideProps<PodcastProps> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || typeof context.params?.["id"] !== "string")
    return {
      notFound: true,
    };

  try {
    const rssFeed = await RssFeed.findByPk(context.params["id"], { raw: true });

    if (!rssFeed || rssFeed.userId !== session.user.id) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        session,
        rssFeed,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function PodcastPage({
  rssFeed,
  session,
}: PodcastProps): JSX.Element {
  return (
    <Main>
      <SignedInHeader session={session} />
      <Content rssFeed={rssFeed} />
    </Main>
  );
}

interface ContentProps {
  rssFeed: RssFeedDto;
}

function Content({ rssFeed }: ContentProps): JSX.Element {
  const { error, data, status } = useQuery([`podcast-${rssFeed.id}`], () =>
    fetchPodcast(rssFeed)
  );

  if (status === "loading") return <Loading />;
  if (status === "error") {
    console.error(error);
    return <div>Something went wrong...</div>;
  }

  return (
    <PodcastPageContainer>
      <h2>{data.title}</h2>
      <a href={data.link} target="_blank" rel="noreferrer">
        <PodcastPageImg src={data.imageSrc} />
      </a>
      <p>{data.author}</p>
      <p>{data.summary}</p>
      <h2>Episodes</h2>
      <List>
        {data.episodes.map((episode) => {
          return (
            <ListItem key={episode.id}>
              <Link
                href={`/podcasts/${data.id}/${encodeURIComponent(episode.id)}`}
                passHref
              >
                <FullAnchor>
                  <h3>{episode.title}</h3>
                  <p>{episode.pubDate.toLocaleString()}</p>
                </FullAnchor>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </PodcastPageContainer>
  );
}

const List = styled.ul`
  width: 100%;
  list-style: none;
`;

const ListItem = styled.li`
  ${cardEffect}

  & h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }
`;

const FullAnchor = styled.a`
  padding: 1.5rem;
  display: block;
`;
