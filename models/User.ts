import {model, Schema} from "mongoose";

const userSchema = new Schema({
    // We're handling required fields
    // at the graphql level
    username: String,
    password: String,
    email: String,
    createdAt: String,
})

const User = model("User", userSchema)
export default User;