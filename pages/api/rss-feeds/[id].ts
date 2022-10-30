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
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json({ id, name: `User ${id}` });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
