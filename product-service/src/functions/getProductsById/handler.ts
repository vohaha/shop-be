import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productsListData from '@libs/products-list.json';
import { ProductsList } from '@libs/types';
import { Handler } from 'aws-lambda';

const getProductsById: Handler = async (event) => {
  try {
    const predicateProductId = event.pathParameters.productId;
    const productsList = await new Promise<ProductsList>((resolve) => {
      setTimeout(() => {
        resolve(productsListData);
      }, 100);
    });

    if (productsList == null) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }
    const product = productsList.find(({ id }) => id === predicateProductId);
    if (product == null) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }
    return formatJSONResponse(product);
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

export const main = middyfy(getProductsById);
