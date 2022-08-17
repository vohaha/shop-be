import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({ region: process.env.REGION });

export const sendMessage = async (message: unknown, queueUrl: string) => {
  return await sqsClient.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    })
  );
};
