import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import cors from '@middy/http-cors';
import inputOutputLogger from '@middy/input-output-logger';

export const middyfyAPIGatewayProxy = (handler) => {
  return middy(handler)
    .use(httpEventNormalizer())
    .use(cors())
    .use(httpErrorHandler())
    .use(middyJsonBodyParser())
    .use(inputOutputLogger({ awsContext: true }));
};

export const middyfySQS = (handler) => {
  return middy(handler)
    .use(httpErrorHandler())
    .use(middyJsonBodyParser())
    .use(
      inputOutputLogger({
        awsContext: true,
        logger: (message) => console.log(JSON.stringify(message)),
      })
    );
};
