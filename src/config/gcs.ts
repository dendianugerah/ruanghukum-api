import { Storage } from "@google-cloud/storage";

if (!process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error(
    "GOOGLE_PRIVATE_KEY is not defined in the environment variables."
  );
}

export const googleStorage = new Storage({
  projectId: "hackfest-bebasss",
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join(
      "\n"
    ),
  },
});

export const bucket = googleStorage.bucket("bebasss");
