import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
  verifyToken,
} from "../helpers/generate.jwt";
import { comparePassword } from "../helpers/hashingPassword";
import {
  register,
  getByEmail,
  findByUsernameOrEmail,
  getById,
  saveRefreshToken,
  findByRefreshToken,
  deleteRefreshToken,
} from "../repository/auth.repository";

const registerUser = async (params: any) => {
  // cek jika user sudah ada
  const existingEmail = await getByEmail(params.email);
  if (existingEmail) {
    throw new Error("User/Email already exists");
  }

  const user = await register(params);
  return user;
};

const login = async (identifier: string, password: string) => {
  // cek apakah ada user
  const user = await findByUsernameOrEmail(identifier);

  if (!user) {
    throw new Error("User Tidak Ditemukan");
  }

  // cek password user sama password yang diinput
  const match = await comparePassword(password, user.password);

  if (!match) {
    throw new Error("Invalid Password");
  }

  // buatkan token untuk user
  const token = await generateToken({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });

  const refreshToken = await generateRefreshToken({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });

  const updateRefreshToken = await saveRefreshToken(user.id, refreshToken);

  if (!updateRefreshToken) {
    throw new Error("Failed to update refresh token");
  }

  return {
    user: updateRefreshToken,
    token,
    refreshToken,
  };
};

const getMe = async (id: number) => {
  const user = await getById(id);
  return user;
};

const refreshToken = async (oldToken: string) => {
  const userToken = await findByRefreshToken(oldToken);

  if (!userToken) {
    throw new Error("401 Unauthorized / Token Tidak Valid");
  }

  const tokenVerify = await verifyRefreshToken(oldToken);

  if (!tokenVerify) {
    throw new Error("Refresh token tidak valid");
  }

  const newAccessToken = await generateToken({
    user: {
      id: userToken.id,
      username: userToken.username,
      email: userToken.email,
    },
  });

  return newAccessToken;
};

const logout = async (refreshToken: string) => {
  const existingRefreshToken = await findByRefreshToken(refreshToken);

  if (!existingRefreshToken) {
    throw new Error("Refresh token tidak valid");
  }

  await deleteRefreshToken(refreshToken);

  return true;
};

export default { registerUser, login, getMe, refreshToken, logout };
