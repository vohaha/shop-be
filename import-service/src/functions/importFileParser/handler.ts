import { middyfyS3 } from "@libs/lambda";
import { S3Event } from "aws-lambda";
import { copyObject, deleteObject, getObject } from "@libs/s3";
import { parseCSV } from "@libs/csv";
import { sendMessage } from "@libs/sqs";

const sendCatalogItems = (msg: unknown) =>
  sendMessage.call(null, msg, process.env.CATALOG_ITEMS_QUEUE_URL);

const importFileParser = async (event: S3Event) => {
  for (const record of event.Records) {
    const { object, bucket } = record.s3;
    const input = {
      Bucket: bucket.name,
      Key: object.key,
    };
    const response = await getObject(input);
    const parsedResults = await parseCSV(response.Body);
    await copyObject({
      ...input,
      // todo: fix a problem with space in the filename
      CopySource: `${bucket.name}/${object.key}`,
      Key: object.key.replace(
        process.env.FOLDER_IMPORTED_DATA,
        process.env.FOLDER_PARSED_DATA
      ),
    });
    await deleteObject(input);
    await sendCatalogItems(parsedResults);
  }
};

export const main = middyfyS3(importFileParser);
