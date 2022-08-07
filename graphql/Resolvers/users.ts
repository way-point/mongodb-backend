import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserInputError } from "apollo-server";
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as randToken from "rand-token";

import User from "../../models/User";
import Token from "../../models/Token";

import {
  validateLoginInput,
  validateRegisterInput,
} from "../../Utils/validators";
import { JWT_ACCESS_TOKEN_SECRET } from "../../config";

const generateToken = (user) => {
  const token = sign(
    {
      sub: user._id,
      email: user.email,
    },
    JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );

  return token;
};

const getRefreshToken = () => randToken.uid(256);

const UserResolver = {
  Mutation: {
    login: async (
      parent,
      { loginInput: { username, password } },
      context,
      info
    ) => {
      const { valid, errors } = validateLoginInput({ username, password });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({
        username,
      });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const access_token = generateToken(user);
      const decodedAccessToken = jwtDecode(access_token) as JwtPayload;
      const accessTokenExpiresAt = decodedAccessToken.exp;
      const refresh_token = getRefreshToken();

      const storedRefreshToken = new Token({
        user: user._id,
      });
      storedRefreshToken.refreshToken = refresh_token;
      await storedRefreshToken.save();

      return {
        id: user._id,
        email: user.email,
        access_token: access_token,
        access_token_expires_at: accessTokenExpiresAt,
        refresh_token: refresh_token,
        username: user.username,
        createdAt: user.createdAt,
      };
    },
    register: async (
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) => {
      const { valid, errors } = validateRegisterInput({
        username,
        email,
        password,
        confirmPassword,
      });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({
        username,
      });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const access_token = generateToken(res);
      const decodedToken = jwtDecode(access_token) as JwtPayload;
      const expiresAt = decodedToken.exp;

      let refresh_token = await Token.findOne({ user: res._id });

      if (refresh_token) {
        refresh_token.refreshToken = getRefreshToken()
      } else {
        const token = new Token({user: res._id, refreshToken: getRefreshToken()})
        await token.save();
        refresh_token = token;
      }

      return {
        id: res._id,
        email: res.email,
        access_token: access_token,
        access_token_expires_at: expiresAt,
        refresh_token: refresh_token.refreshToken,
        username: res.username,
        createdAt: res.createdAt,
      };
    },
  },
};

export default UserResolver;
