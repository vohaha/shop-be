import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { Handler } from 'aws-lambda';
import { api } from '../../libs/api';
import createError from 'http-errors';
import { IClientProductsList } from '../../types/api-types';

const getProductsList: Handler = async () => {
  const productsList = (await api.getProductsList()) as IClientProductsList;
  if (!productsList.length) {
    throw new createError.NotFound();
  }
  return formatJSONResponse(productsList);
};

export const main = middyfy(getProductsList);
