import bcrypt from "bcrypt";

export default function compareHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
