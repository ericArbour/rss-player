import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { Podcast, RssFeedDto } from "../types";
import { queryClient } from "../utils/react-query";
import { fetchPodcast } from "../utils/rss";
import { PodcastCard } from "./podcast-card";

interface PodcastCardsProps {
  rssFeeds: RssFeedDto[];
}

export function PodcastCards({ rssFeeds }: PodcastCardsProps): JSX.Element {
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

    // Manually set each podcast in the cache so the individual pages can
    // leverage caching if the user navigates one.
    podcasts.forEach((podcast) => {
      queryClient.setQueryData([`podcast-${podcast.id}`], podcast);
    });

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

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 1.5rem;
`;
