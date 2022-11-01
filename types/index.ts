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
  pubDate: string;
  description: string;
  episodeType: typeof podcastEpisodeTypes[number] | null;
  episodeNumber: number | null;
  duration: string;
  summary: string;
  file: File;
}

export interface Podcast {
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
