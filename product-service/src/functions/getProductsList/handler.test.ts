import { Context } from 'aws-lambda';
import { main } from './handler';
import { db } from '../../libs/db';
import { IProduct } from '../../types/api-types'
import createEvent from '@serverless/event-mocks';

describe('Unit test: getProductsList', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return 404 error', async () => {
    const apiSpy = jest.spyOn(db, 'getProductsList').mockResolvedValueOnce([]);
    const resp = await main(
      createEvent('aws:apiGateway', {} as any),
      {} as Context
    );
    expect(resp.statusCode).toBe(404);
    expect(apiSpy).toHaveBeenCalled();
  });
  it('should return 200', async () => {
    const mockedProductsList: IProduct[] = [
      {
        description: 'test description',
        id: 'existed-id',
        price: 100,
        name: 'test product',
        media: '',
      },
      {
        description: 'test description 2',
        id: 'existed-id-2',
        price: 200,
        name: 'test product 2',
        media: '',
      },
    ];
    const apiSpy = jest
      .spyOn(db, 'getProductsList')
      .mockResolvedValueOnce(mockedProductsList);
    const resp = await main(
      createEvent('aws:apiGateway', {} as any),
      {} as Context
    );
    expect(resp).toStrictEqual({
      body: JSON.stringify(mockedProductsList),
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    expect(apiSpy).toHaveBeenCalled();
  });
});
