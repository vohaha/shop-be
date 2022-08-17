import { middyfy } from "@libs/lambda";

const handler = async (event) => {
  if (event.type != "TOKEN" || event.authorizationToken == null) {
    return {
      statusCode: 401,
      error: "Unauthorized",
    };
  }

  try {
    const [, base64Token] = event.authorizationToken.split(" ");
    const buff = Buffer.from(base64Token, "base64");
    const [username, password] = buff.toString("utf-8").split(":");
    const adminPassword = process.env[username];
    const effect =
      adminPassword == null || adminPassword !== password ? "Deny" : "Allow";
    return generatePolicy(base64Token, event.methodArn, effect);
  } catch (error) {
    return {
      statusCode: 403,
      error: error.message,
    };
  }
};

const generatePolicy = (principalId, resource, effect) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const main = middyfy(handler);
