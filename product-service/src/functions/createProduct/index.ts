import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        bodyType: 'IProductBase',
        responses: {
          201: {
            description: 'Returns product',
            bodyType: 'IClientProduct',
          },
          400: {
            description: 'Bad request',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
  ],
};
