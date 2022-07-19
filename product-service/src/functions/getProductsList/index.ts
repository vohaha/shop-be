import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responses: {
          200: {
            description: 'Returns a list of products',
            bodyType: 'ProductsList',
          },
          404: {
            description: 'List of products is empty',
          },
        },
      },
    },
  ],
};
