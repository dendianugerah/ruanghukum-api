import { NextApiRequest } from "next";

declare module "next" {
  export interface NextApiRequest {
    userId?: string;
    email?: string;
  }
}
