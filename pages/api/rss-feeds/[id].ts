import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { RssFeed } from "../../../db/models";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401); // Unauthorized
    res.end();
    return;
  }

  const {
    query: { id },
    method,
  } = req;

  if (typeof id !== "string") {
    res.status(400); // Bad Request
    res.end();
    return;
  }

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  try {
    const rssFeed = await RssFeed.findByPk(id);

    if (!rssFeed) {
      res.status(404); // Not Found
      res.end();
      return;
    }

    if (rssFeed.userId !== session.user.id) {
      res.status(403); // Forbidden
      res.end();
      return;
    }

    res.status(200).json(rssFeed);
  } catch {
    res.status(500); // Internal Server Error
    res.end();
  }
}
