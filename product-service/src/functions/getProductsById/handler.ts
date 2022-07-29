import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { db } from '../../libs/db';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

const getProductsById: Handler<APIGatewayProxyEvent> = async (event) => {
  const predicateProductId = event.pathParameters.productId;
  const product = await db.getProductById(predicateProductId);
  if (product == null) {
    throw new createError.NotFound();
  }
  return formatJSONResponse(product);
};

export const main = middyfy(getProductsById);
