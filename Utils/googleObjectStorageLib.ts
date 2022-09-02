import { Storage } from "@google-cloud/storage";

export const primaryBucket = "primary-waypoint-image-cluster";
const storage = new Storage();

export const uploadFile = async (bucketName, contents, fileName) => {
  storage.bucket(bucketName).file(fileName).save(contents);
  console.log(`${fileName} were uploaded to ${bucketName}`);
}

export const uploadPrimary = (contents, destinationName) => {
  uploadFile(primaryBucket, contents, destinationName);
}

export const downloadFile = async (bucketName, fileName) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const data = await file.createReadStream()

  return data
}
