import startServer from "../src/index";

import configJson from "./config.json";
import queryJson from "./query.json";

import mongoose from "mongoose";

import { uploadFile, uploadPrimary } from "../Utils/objectStorage";

const url = configJson.url;

describe("demo", () => {
  let server, url:string;

  beforeAll(async () => {
    ({server, url} = await startServer(3001));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });
  
  it("Hi", async () => {
    await uploadPrimary("Do stuff", "I'm stuff");
  })
  
});
