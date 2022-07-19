import productsListData from '../libs/products-list.json';
import { ProductsList } from '../types/api-types';

export const api = {
  async getProductsList() {
    return new Promise<ProductsList>((resolve) => {
      setTimeout(() => {
        // @ts-ignore
        resolve(productsListData);
      }, 100);
    });
  },
  async getProductById(predicateProductId: string) {
    const list = await new Promise<ProductsList>((resolve) => {
      setTimeout(() => {
        // @ts-ignore
        resolve(productsListData);
      }, 100);
    });
    if (list == null || !list.length) {
      return null;
    }
    return list.find(({ id }) => id === predicateProductId);
  },
};
