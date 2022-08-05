import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfyAPIGatewayProxy } from '../../libs/lambda';
import { Handler } from 'aws-lambda';
import { db } from '../../libs/db';
import createError from 'http-errors';
import { IClientProductsList } from '../../types/api-types';

const getProductsList: Handler = async () => {
  // TODO avoid explicit type casting
  const productsList = (await db.getProductsList()) as IClientProductsList;
  if (!productsList.length) {
    throw new createError.NotFound();
  }
  return formatJSONResponse(productsList);
};

export const main = middyfyAPIGatewayProxy(getProductsList);
