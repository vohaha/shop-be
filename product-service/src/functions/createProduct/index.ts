import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        requestBody: {
          description: 'The product to create',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'IProduct',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Returns product',
            bodyType: 'IClientProduct',
          },
        },
      },
    },
  ],
};

// TODO add responses
