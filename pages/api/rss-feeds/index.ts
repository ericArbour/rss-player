import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { ValidationError } from "sequelize";
import { RssFeed } from "../../../db/models";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
    res.end();
    return;
  }

  const { method, body } = req;

  if (method === "GET") {
    const rssFeeds = await RssFeed.findAll({
      where: { userId: session.user.id },
    });
    res.status(200).json(rssFeeds);
    return;
  }

  if (method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const rssFeed = await RssFeed.create({
      userId: session.user.id,
      url: body.url,
    });

    res.status(201).json(rssFeed);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400); // Bad Request
      res.end(e.message);
      return;
    }

    res.status(500); // Internal Server Error
    res.end(e instanceof Error ? e.message : null);
  }
}
