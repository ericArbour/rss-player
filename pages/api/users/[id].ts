import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../../../db/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).send({ error: "No user id provided." });
    return;
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).send({ error: `Unable to find a user with id ${id}` });
      return;
    }

    res.status(200).json(user);
  } catch {
    res.status(404).send({ error: `Unable to find a user with id ${id}` });
  }
}
