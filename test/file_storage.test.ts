import startServer from "../src/index";

import configJson from "./config.json";
import queryJson from "./query.json";

import mongoose from "mongoose";

import { downloadFile, uploadFile, uploadPrimary, primaryBucket } from "../Utils/googleObjectStorageLib";

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
    const data = await downloadFile(primaryBucket, "I'm stuff");
    console.log(data)

    expect(data).toBe(4)

  })
  
});
