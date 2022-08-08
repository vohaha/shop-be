import * as publishBatchModule from '../../libs/sns';
import { db } from '../../libs/db';
import { IClientProduct } from '../../types/api-types';
import { main } from './handler';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { Context } from 'aws-lambda';
import { PublishCommandOutput } from '@aws-sdk/client-sns';

describe('Unit test: catalogBatchProcess', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return 200', async () => {
    const testProducts: IClientProduct[] = [
      {
        id: 'test-id',
        name: 'name',
        description: 'description',
        price: 100,
        media: '',
        count: 0,
      },
    ];
    const sqsEvent = {
      Records: [
        {
          body: JSON.stringify(testProducts),
        },
      ],
    } as SQSEvent;
    const createProductsSpy = jest
      .spyOn(db, 'createProducts')
      .mockResolvedValueOnce(testProducts);
    const publishBatchSpy = jest
      .spyOn(publishBatchModule, 'publish')
      .mockResolvedValueOnce({} as Promise<PublishCommandOutput>);
    const resp = await main(sqsEvent, {} as Context, null);
    expect(resp.statusCode).toBe(200);
    expect(createProductsSpy).toHaveBeenCalled();
    expect(publishBatchSpy).toHaveBeenCalledWith(testProducts);
  });
});
