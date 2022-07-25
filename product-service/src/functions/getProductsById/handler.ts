import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { api } from '../../libs/api';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';

const getProductsById: Handler = async (event) => {
  const predicateProductId = event.pathParameters.productId;
  const product = await api.getProductById(predicateProductId);
  if (product == null) {
    throw new createError.NotFound();
  }
  return formatJSONResponse(product);
};

export const main = middyfy(getProductsById);
