import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: "ImportFilesRole",
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          arn: "arn:aws:lambda:${aws:region}:${aws:accountId}:function:authorization-service-dev-basicAuthorizer",
          resultTtlInSeconds: 0,
          type: "token",
        },
      },
    },
  ],
};
