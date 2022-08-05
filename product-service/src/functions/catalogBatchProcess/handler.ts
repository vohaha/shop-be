import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfySQS } from '../../libs/lambda';

const catalogBatchProcess = async (event) => {
  console.log(event);
  return formatJSONResponse({}, 201);
};

export const main = middyfySQS(catalogBatchProcess);
