import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productListData from '@libs/product-list.json';
import { ProductList } from '@libs/types';
import { Handler } from 'aws-lambda';

const getProductById: Handler = async (event) => {
  try {
    const productList = await new Promise<ProductList>((resolve) => {
      setTimeout(() => {
        resolve(productListData);
      }, 100);
    });
    if (productList == null) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }
    const product = productList.find(
      ({ id }) => id === event.queryStringParameters.id
    );
    if (product == null) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }
    return formatJSONResponse({ product });
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

export const main = middyfy(getProductById);
