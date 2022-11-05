export const podcastEpisodeTypes = ["full", "trailer", "bonus"] as const;

export interface File {
  src: string;
  length: string;
  type: string;
}

export interface Episode {
  id: string;
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  episodeType: typeof podcastEpisodeTypes[number] | null;
  episodeNumber: number | string | null;
  duration: string | null;
  summary: string;
  file: File | null;
}

export interface Podcast {
  id: string;
  title: string;
  link: string;
  author: string;
  summary: string;
  imageSrc: string;
  episodes: Episode[];
}

export interface RssFeedDto {
  id: string;
  url: string;
}
