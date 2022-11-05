import { useQuery } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import sanitizeHtml from "sanitize-html";

import { authOptions } from "../../api/auth/[...nextauth]";
import { RssFeed } from "../../../db/models";
import { RssFeedDto } from "../../../types";
import { fetchPodcast } from "../../../utils/rss";
import { Main } from "../../../components/main";
import { SignedInHeader } from "../../../components/signed-in-header";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { PodcastPageContainer } from "../../../components/podcast-page-container";
import { PodcastPageImg } from "../../../components/podcast-page-img";

interface PodcastEpisodeProps {
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
export const getServerSideProps: GetServerSideProps<
  PodcastEpisodeProps
> = async (context) => {
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

export default function PodcastEpisodePage({
  rssFeed,
  session,
}: PodcastEpisodeProps): JSX.Element {
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
  const { query } = useRouter();
  const episode = useMemo(() => {
    if (!query["episode"] || !data) return null;
    return data.episodes.find((episode) => episode.id === query["episode"]);
  }, [data, query]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error" || !episode) {
    console.error(error);
    return <div>Something went wrong...</div>;
  }

  return (
    <PodcastPageContainer>
      <h2>{data.title}</h2>
      <a href={data.link} target="_blank" rel="noreferrer">
        <PodcastPageImg src={data.imageSrc} alt="Title Image" />
      </a>
      <p>{data.author}</p>
      <p>{data.summary}</p>
      <h2>Episode</h2>
      {episode.file && (
        <audio controls>
          <source src={episode.file.src} type={episode.file.type} />
          Your browser does not support the audio element.
        </audio>
      )}
      <p
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(episode.description),
        }}
      />
    </PodcastPageContainer>
  );
}
