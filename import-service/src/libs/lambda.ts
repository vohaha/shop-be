import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import inputOutputLogger from "@middy/input-output-logger";
import cors from "@middy/http-cors";
import httpEventNormalizer from "@middy/http-event-normalizer";

export const middyfyHttp = (handler) => {
  return middy(handler)
    .use(httpEventNormalizer())
    .use(cors())
    .use(httpErrorHandler())
    .use(middyJsonBodyParser())
    .use(inputOutputLogger({ awsContext: true }));
};

export const middyfyS3 = (handler) => {
  return middy(handler);
};
