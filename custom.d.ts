import { NextApiRequest } from "next";

declare module "next" {
  export interface NextApiRequest {
    userId?: uuid;
    email?: string;
  }
}
