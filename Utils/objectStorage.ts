/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';


import { Storage } from "@google-cloud/storage";

export const primaryBucket = "primary-waypoint-image-cluster";
const destFileName = 'stuff'

const storage = new Storage();

export const uploadFile = async (bucketName, contents, destinationName) => {
  const options = {
    destination: destFileName,
  };

  storage.bucket(bucketName).file(destinationName).save(contents);
  console.log(`${destinationName} were uploaded to ${bucketName}`);
}

export const uploadPrimary = (contents, destinationName) => {
  uploadFile(primaryBucket, contents, destinationName);
}