import { Context } from 'aws-lambda';
import { main } from './handler';
import { api } from '../../libs/api';
import { ProductsList } from '../../libs/types';

describe('Unit test: getProductsList', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return 404 error', async () => {
    const apiSpy = jest.spyOn(api, 'getProductsList').mockResolvedValueOnce([]);
    const resp = await main({}, {} as Context);
    expect(resp.statusCode).toBe(404);
    expect(apiSpy).toHaveBeenCalled();
  });
  it('should return 200', async () => {
    const mockedProductsList: ProductsList = [
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
      .spyOn(api, 'getProductsList')
      .mockResolvedValueOnce(mockedProductsList);
    const resp = await main({}, {} as Context);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toBe(JSON.stringify(mockedProductsList));
    expect(apiSpy).toHaveBeenCalled();
  });
});
