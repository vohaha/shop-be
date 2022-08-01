import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({ region: process.env.REGION });

export const deleteObject = async (input) => {
  return await s3Client.send(new DeleteObjectCommand(input));
};

export const copyObject = async (input) => {
  return await s3Client.send(new CopyObjectCommand(input));
};

export const getObject = async (input) => {
  return await s3Client.send(new GetObjectCommand(input));
};
