import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../../../db/models";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const users = await User.findAll();
  res.status(200).json(users);
}
