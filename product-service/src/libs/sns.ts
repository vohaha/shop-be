import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export const client = new SNSClient({ region: process.env.REGION });

export function publish(messages: unknown) {
  return client.send(
    new PublishCommand({
      TopicArn: process.env.PRODUCT_CREATED_TOPIC_ARN,
      Message: JSON.stringify(messages),
    })
  );
}
