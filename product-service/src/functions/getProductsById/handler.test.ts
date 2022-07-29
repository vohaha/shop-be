import createEvent from '@serverless/event-mocks';
import { Context } from 'aws-lambda';
import { main } from './handler';
import { db } from '../../libs/db';
import { IProduct } from '../../types/api-types';

describe('Unit test: getProductsById', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return 404 error', async () => {
    const eventProductId = 'not-existed-id';
    const apiSpy = jest
      .spyOn(db, 'getProductById')
      .mockResolvedValueOnce(null);
    const resp = await main(
      createEvent('aws:apiGateway', {
        pathParameters: { productId: eventProductId },
      } as any),
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
      .spyOn(db, 'getProductById')
      .mockResolvedValueOnce(mockedProduct);
    const resp = await main(
      createEvent('aws:apiGateway', {
        pathParameters: { productId: mockedProduct.id },
      } as any),
      {} as Context
    );
    expect(resp).toStrictEqual({
      body: JSON.stringify(mockedProduct),
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    expect(apiSpy).toHaveBeenCalledWith(mockedProduct.id);
  });
});
