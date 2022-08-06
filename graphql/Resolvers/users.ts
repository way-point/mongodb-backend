import User from "../../models/User";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserInputError } from "apollo-server";


import { validateLoginInput, validateRegisterInput } from "../../Utils/validators";
import {JWT_SECRET} from "../../config"

const generateToken = (user) => {
  return sign({
    id: user.id,
    eamil: user.email,
    username: user.username
  }, JWT_SECRET, { expiresIn: "1h" });
}

const UserResolver = {
  Mutation: {
    login: async (parent, { loginInput: { username, password } }, context, info) => {
      const { errors } = validateLoginInput({username, password});

      const user = await User.findOne({
        username
      })

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors })
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);     
      
      return {
        id: user._id,
        email: user.email,
        token: token,
        username: user.username,
        createdAt: user.createdAt,
      }
    },
    register: async (parent, { registerInput: {username, email, password, confirmPassword} }, context, info) => {
      
      const {valid, errors} = validateRegisterInput({username, email, password, confirmPassword});

      if (!valid) {
        throw new UserInputError("Errors", { errors })
      }

      const user = await User.findOne({
        username
      });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken"
          }
        })
      }
      
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        id: res._id,
        email: res.email,
        token: token,
        username: res.username,
        createdAt: res.createdAt,
      }
    }
  }
}

export default UserResolver;
