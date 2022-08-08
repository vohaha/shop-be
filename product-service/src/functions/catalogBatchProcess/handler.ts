import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfySQS } from '../../libs/lambda';
import { db } from '../../libs/db';
import { publishBatch } from '../../libs/sns';

const catalogBatchProcess = async (event: SQSEvent) => {
  const allClientProducts = [];
  for (const record of event.Records) {
    const products = JSON.parse(record.body);
    const clientProducts = await db.createProducts(products);
    allClientProducts.push(...clientProducts);
  }
  await publishBatch(allClientProducts);
  return formatJSONResponse({ products: allClientProducts }, 201);
};

export const main = middyfySQS(catalogBatchProcess);