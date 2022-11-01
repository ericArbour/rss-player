import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Episode, Podcast, podcastEpisodeTypes } from "../types";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});

interface ParsedPodcastFeedItem {
  title: string;
  link: string;
  guid: {
    "#text": string;
  };
  pubDate: string;
  enclosure: {
    "@_url": string;
    "@_length": string;
    "@_type": string;
  };
  description: string;
  "itunes:episodeType"?: typeof podcastEpisodeTypes[number];
  "itunes:episode"?: number;
  "itunes:duration": string;
  "itunes:summary": string;
}

interface ParsedPodcastFeed {
  rss: {
    channel: {
      title: string;
      link: string;
      "itunes:author": string;
      "itunes:summary": string;
      "itunes:image": {
        "@_href": string;
      };
      item: ParsedPodcastFeedItem[];
    };
  };
}

function isObject(x: unknown): x is object {
  return typeof x === "object" && x !== null;
}

function isParsedPodcastFeedItem(
  parsedXmlItem: unknown
): parsedXmlItem is ParsedPodcastFeedItem {
  if (!isObject(parsedXmlItem)) return false;

  if (typeof (parsedXmlItem as ParsedPodcastFeedItem).title !== "string")
    return false;

  if (typeof (parsedXmlItem as ParsedPodcastFeedItem).link !== "string")
    return false;

  if (
    typeof (parsedXmlItem as ParsedPodcastFeedItem).guid?.["#text"] !== "string"
  )
    return false;

  if (typeof (parsedXmlItem as ParsedPodcastFeedItem).pubDate !== "string")
    return false;

  if (
    typeof (parsedXmlItem as ParsedPodcastFeedItem).enclosure?.["@_url"] !==
    "string"
  )
    return false;

  if (
    typeof (parsedXmlItem as ParsedPodcastFeedItem).enclosure?.["@_length"] !==
    "string"
  )
    return false;

  if (
    typeof (parsedXmlItem as ParsedPodcastFeedItem).enclosure?.["@_type"] !==
    "string"
  )
    return false;

  if (typeof (parsedXmlItem as ParsedPodcastFeedItem).description !== "string")
    return false;

  if (
    ![...podcastEpisodeTypes, undefined].includes(
      (parsedXmlItem as ParsedPodcastFeedItem)["itunes:episodeType"]
    )
  )
    return false;

  if (
    !["number", "undefined"].includes(
      typeof (parsedXmlItem as ParsedPodcastFeedItem)["itunes:episode"]
    )
  )
    return false;

  if (
    typeof (parsedXmlItem as ParsedPodcastFeedItem)["itunes:duration"] !==
    "string"
  )
    return false;

  if (
    typeof (parsedXmlItem as ParsedPodcastFeedItem)["itunes:summary"] !==
    "string"
  )
    return false;

  return true;
}

function isParsedPodcastFeed(
  parsedXmlFeed: unknown
): parsedXmlFeed is ParsedPodcastFeed {
  if (!isObject((parsedXmlFeed as ParsedPodcastFeed)?.rss?.channel))
    return false;

  if (
    typeof (parsedXmlFeed as ParsedPodcastFeed).rss.channel.title !== "string"
  )
    return false;

  if (typeof (parsedXmlFeed as ParsedPodcastFeed).rss.channel.link !== "string")
    return false;

  if (
    typeof (parsedXmlFeed as ParsedPodcastFeed).rss.channel["itunes:author"] !==
    "string"
  )
    return false;

  if (
    typeof (parsedXmlFeed as ParsedPodcastFeed).rss.channel[
      "itunes:summary"
    ] !== "string"
  )
    return false;

  if (
    typeof (parsedXmlFeed as ParsedPodcastFeed).rss.channel["itunes:image"]?.[
      "@_href"
    ] !== "string"
  )
    return false;

  if (!Array.isArray((parsedXmlFeed as ParsedPodcastFeed).rss.channel.item))
    return false;

  if (
    !(parsedXmlFeed as ParsedPodcastFeed).rss.channel.item.every(
      isParsedPodcastFeedItem
    )
  )
    return false;

  return true;
}

function parsePodcastFeed(text: string): ParsedPodcastFeed {
  const isValidOrError = XMLValidator.validate(text);
  if (isValidOrError !== true) throw isValidOrError;

  const parsedXmlFeed: unknown = xmlParser.parse(text);
  if (!isParsedPodcastFeed(parsedXmlFeed))
    throw new Error("RSS XML is not a valid podcast.");

  return parsedXmlFeed;
}

function parsedPodcastFeedItemToEpisode(
  parsedPodcastFeedItem: ParsedPodcastFeedItem
): Episode {
  const {
    title,
    link,
    guid,
    pubDate,
    enclosure,
    description,
    "itunes:episodeType": episodeType,
    "itunes:episode": episodeNumber,
    "itunes:duration": duration,
    "itunes:summary": summary,
  } = parsedPodcastFeedItem;

  return {
    id: guid["#text"],
    title,
    link,
    pubDate,
    description,
    episodeType: episodeType ?? null,
    episodeNumber: episodeNumber ?? null,
    duration,
    summary,
    file: {
      src: enclosure["@_url"],
      length: enclosure["@_length"],
      type: enclosure["@_type"],
    },
  };
}

function parsedPodcastFeedToPodcast(
  parsedPodcastFeed: ParsedPodcastFeed
): Podcast {
  const {
    title,
    link,
    "itunes:author": author,
    "itunes:summary": summary,
    "itunes:image": image,
    item: items,
  } = parsedPodcastFeed.rss.channel;

  return {
    title,
    link,
    author,
    summary,
    imageSrc: image["@_href"],
    episodes: items.map(parsedPodcastFeedItemToEpisode),
  };
}

export async function fetchPodcast(rssUrl: string): Promise<Podcast> {
  const response = await fetch(rssUrl);
  const text = await response.text();
  const parsedPodcastFeed = parsePodcastFeed(text);
  const podcast = parsedPodcastFeedToPodcast(parsedPodcastFeed);
  return podcast;
}
