import { NextApiRequest, NextApiResponse } from "next";

import models from "../../db/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-expect-error
  const users = await models.User.findAll();
  res.status(200).json(users);
}
