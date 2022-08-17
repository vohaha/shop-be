import createError from "http-errors";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfyHttp } from "@libs/lambda";
import { s3Client } from "@libs/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  const filename = event.queryStringParameters.name;
  if (filename == null) {
    new createError.BadRequest("Missing name query parameter");
  }
  const importFile = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${process.env.FOLDER_IMPORTED_DATA}/${filename}`,
  });
  const signedUrl = await getSignedUrl(s3Client, importFile, {
    expiresIn: 60, // 1 minute
  });
  return formatJSONResponse(signedUrl);
};

export const main = middyfyHttp(importProductsFile);
