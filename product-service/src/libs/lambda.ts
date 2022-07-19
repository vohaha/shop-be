import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import cors from '@middy/http-cors';

export const middyfy = (handler) => {
  return middy(handler)
    .use(httpEventNormalizer())
    .use(middyJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors());
};
