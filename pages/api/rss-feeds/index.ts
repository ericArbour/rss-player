import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

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

  const { method } = req;

  switch (method) {
    case "GET":
      res.status(200).json({ id: "test" });
      break;
    case "POST":
      res.status(201).json({ id: "test" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
