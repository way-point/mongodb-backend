import {model, Schema} from "mongoose";

const tokenSchema = new Schema({
    refreshToken: {type: String, required: true},
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

const Token = model("Token", tokenSchema);
export default Token;
