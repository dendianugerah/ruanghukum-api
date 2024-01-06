import { NextApiRequest, NextApiResponse } from "next/types";
import db, { blog } from "@/src/config/db";

interface BlogApiRequest extends NextApiRequest {
  body: {
    title: string;
    content: string;
    image: string;
    flag: string;
  };
}

export default async function handler(
  req: BlogApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { title, content, image, flag } = req.body;
  }
}
