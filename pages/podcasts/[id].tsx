import { useQuery } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]";
import { RssFeed } from "../../db/models";
import { RssFeedDto } from "../../types";
import { fetchPodcast } from "../../utils/rss";
import { Main } from "../../components/main";
import { SignedInHeader } from "../../components/signed-in-header";

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

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") {
    console.error(error);
    return <div>Something went wrong...</div>;
  }

  return <div>{data.title}</div>;
}
