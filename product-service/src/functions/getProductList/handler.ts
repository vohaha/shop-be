import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productListData from '@libs/product-list.json';
import { ProductList } from '@libs/types';
import { Handler } from 'aws-lambda';

const getProductList: Handler = async (event) => {
  try {
    const productList = await new Promise<ProductList>((resolve) => {
      setTimeout(() => {
        resolve(productListData);
      }, 100);
    });
    if (productList != null) {
      return formatJSONResponse({ productList });
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

export const main = middyfy(getProductList);
