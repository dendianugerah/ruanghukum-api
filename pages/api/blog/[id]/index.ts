import { NextApiRequest, NextApiResponse } from "next/types";
import db from "@/src/config/db";
import { Response } from "@/src/helper/apiResponse";
import { sql } from "drizzle-orm";

interface BlogApiRequest extends NextApiRequest {
  query: {
    id: string;
  };
}

export default async function handler(
  req: BlogApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const { id } = req.query;

    const query = await db.execute(
      sql`SELECT title, content, image, flag FROM blog WHERE id = ${id} `
    );

    const data = query[0];

    return Response(res, 200, "Success", {
      type: "blog - get by id",
      payload: {
        id: id,
        title: data.title,
        content: data.content,
        image: data.image,
        flag: data.flag,
      },
    });
  }
}

