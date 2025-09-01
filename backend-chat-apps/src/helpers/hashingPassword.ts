import bcrypt from "bcrypt";
async function hashPassword(password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}

async function comparePassword(password: string, hashed: string) {
  const match = await bcrypt.compare(password, hashed);
  return match; // true atau false
}

export { hashPassword, comparePassword };