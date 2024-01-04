import bcrypt from "bcrypt";

export default function hashAndSalt(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}
