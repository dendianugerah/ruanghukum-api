import { NextApiRequest, NextApiResponse } from "next/types";
import db, { blog } from "@/src/config/db";
import { Response } from "@/src/helper/apiResponse";
import { v4 as uuid } from "uuid";
import { sql } from "drizzle-orm";
import { upload } from "@/src/helper/multer";
import fs from "fs";
import { bucket } from "@/src/config/gcs";

interface BlogApiRequest extends NextApiRequest {
  body: {
    title: string;
    content: string;
    image: string;
    flag: string;
  };
  file: {
    filename: string;
    path: string;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: BlogApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    upload.single("image")(req as any, res as any, async (err: any) => {
      if (err) {
        return Response(res, 500, "Internal Server Error", {
          error: err.message,
        });
      }

      const { title, content, flag } = req.body;
      const imageFileName = req.file.filename;
      const imagePath = `./tmp/${imageFileName}`;

      try {
        await fs.promises.rename(req.file.path, imagePath);

        const remotePath = `blog-images/${imageFileName}`;
        await bucket.upload(imagePath, { destination: remotePath });

        await db.insert(blog).values({
          id: uuid(),
          title: title,
          content: content,
          image: `https://storage.googleapis.com/bebasss/${remotePath}`,
          flag: flag,
        });

        fs.promises.unlink(imagePath);
      } catch (err) {
        return Response(res, 500, "Internal Server Error", {
          error: err,
        });
      }

      return Response(res, 200, "Success", {
        type: "blog - create",
        payload: {
          title: title,
        },
      });
    });
  }

  if (req.method === "GET") {
    const { limit, offset, flag } = req.query;

    let query = sql`SELECT id, title, content, image, flag FROM blog `;

    if (flag) {
      query = query.append(sql`WHERE flag = ${flag} `);
    }

    if (limit) {
      query = query.append(sql`LIMIT ${limit} `);
    }

    if (offset) {
      query = query.append(sql`OFFSET ${offset} `);
    }

    const data = await db.execute(query);

    return Response(res, 200, "Success", {
      type: "blog - get all",
      payload: data,
    });
  }
}
