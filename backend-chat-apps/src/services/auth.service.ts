import { register, getByEmail } from "../repository/auth.repository";
const registerUser = async (params: any) => {
  // cek jika user sudah ada
  const existingEmail = await getByEmail(params.email);
  if (existingEmail) {
    throw new Error("User/Email already exists");
  }

  const user = await register(params);
  return user;
};

export default { registerUser };
