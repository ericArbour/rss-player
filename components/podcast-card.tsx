import Link from "next/link";
import styled from "styled-components";
import { Podcast } from "../types";

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
        <img src={podcast.imageSrc} alt="Title Image" width="100%" />
      </CardLink>
    </Link>
  );
}

const CardLink = styled.a`
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
