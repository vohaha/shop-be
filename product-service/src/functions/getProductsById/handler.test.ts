import { Context } from 'aws-lambda';
import { main } from './handler';
import { api } from '../../libs/api';
import { IProduct } from '../../libs/types';

describe('Unit test: getProductsById', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return 404 error', async () => {
    const eventProductId = 'not-existed-id';
    const apiSpy = jest
      .spyOn(api, 'getProductById')
      .mockResolvedValueOnce(null);
    const resp = await main(
      {
        pathParameters: { productId: eventProductId },
      },
      {} as Context
    );
    expect(resp.statusCode).toBe(404);
    expect(apiSpy).toHaveBeenCalledWith(eventProductId);
  });
  it('should return 200', async () => {
    const mockedProduct: IProduct = {
      description: 'test description',
      id: 'existed-id',
      price: 100,
      name: 'test product',
      media: '',
    };
    const apiSpy = jest
      .spyOn(api, 'getProductById')
      .mockResolvedValueOnce(mockedProduct);
    const resp = await main(
      {
        pathParameters: { productId: mockedProduct.id },
      },
      {} as Context
    );
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toBe(JSON.stringify(mockedProduct));
    expect(apiSpy).toHaveBeenCalledWith(mockedProduct.id);
  });
});
