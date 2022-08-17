import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfyAPIGatewayProxy } from '../../libs/lambda';
import { db } from '../../libs/db';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { IProduct } from '../../types/api-types';

// TODO add proper validation
function isProductsValid(products: any): products is IProduct[] {
  if (products == null) {
    return false;
  }
  if (Array.isArray(products)) {
    return products.every(isProductsValid);
  }
  const product = products;
  return (
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.media === 'string'
  );
}

const createProducts: Handler<APIGatewayProxyEvent> = async (event) => {
  const products = event.body;
  if (!isProductsValid(products)) {
    throw new createError.BadRequest();
  }
  const returnedProducts = await db.createProducts(products);
  return formatJSONResponse(returnedProducts, 201);
};

export const main = middyfyAPIGatewayProxy(createProducts);
