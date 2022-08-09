import { AuthenticationError } from "apollo-server";
import * as jwt from "jsonwebtoken";

import { JWT_ACCESS_TOKEN_SECRET } from "../config";

const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired Token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error("Authorization header must be provided");
};

export default checkAuth;
