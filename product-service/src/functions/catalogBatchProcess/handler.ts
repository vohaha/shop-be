import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

const catalogBatchProcess = async (event) => {
  console.log(event);
  return formatJSONResponse({}, 201);
};

export const main = middyfy(catalogBatchProcess);
