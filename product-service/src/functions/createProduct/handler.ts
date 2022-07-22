import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { api } from '../../libs/api';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { IProduct } from '../../types/api-types';

function isValidProduct(product: any): product is IProduct {
  // TODO add proper validation
  return (
    product != null &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.media === 'string'
  );
}

const createProduct: Handler<APIGatewayProxyEvent> = async (event) => {
  const product = event.body;
  if (!isValidProduct(product)) {
    throw new createError.BadRequest();
  }
  const returnedProduct = await api.createProduct(product);
  return formatJSONResponse(returnedProduct, 201);
};

export const main = middyfy(createProduct);
