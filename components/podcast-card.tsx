import Link from "next/link";
import styled from "styled-components";
import { Podcast } from "../types";
import { cardEffect } from "../utils/style-mixins";

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps): JSX.Element {
  return (
    <Link href={`/podcasts/${podcast.id}`} passHref>
      <CardLink>
        <h2>{podcast.title}</h2>
        {/* next/image can't be used because the domains are not statically known */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <PodcastImg src={podcast.imageSrc} />
      </CardLink>
    </Link>
  );
}

const CardLink = styled.a`
  text-decoration: none;
  max-width: 18.75rem;
  padding: 1.5rem;
  ${cardEffect}

  & h2 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }

  & p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }
`;

const PodcastImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
`;
