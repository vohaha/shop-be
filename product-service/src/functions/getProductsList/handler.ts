import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productsListData from '@libs/products-list.json';
import { ProductsList } from '@libs/types';
import { Handler } from 'aws-lambda';

const getProductsList: Handler = async (event) => {
  try {
    const productsList = await new Promise<ProductsList>((resolve) => {
      setTimeout(() => {
        resolve(productsListData);
      }, 100);
    });
    if (productsList != null) {
      return formatJSONResponse(productsList);
    }
  } catch (err) {
    return formatJSONResponse(
      {
        message: 'Internal error',
        event,
        err: JSON.stringify(err),
      },
      500
    );
  }
};

export const main = middyfy(getProductsList);
