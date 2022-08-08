import type { AWS } from '@serverless/typescript';

import functions from './src/functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-auto-swagger',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCT_CREATED_TOPIC_ARN: {
        Ref: 'ProductCreatedTopic',
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: '${self:custom.catalogItemsQueueArn}',
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: {
          Ref: 'ProductCreatedTopic',
        },
      },
    ],
  },
  // import the function via paths
  functions,
  package: { individually: true },
  useDotenv: true,
  custom: {
    autoswagger: {},
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    catalogItemsQueueArn: {
      'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
    },
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      ProductCreatedTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'ProductCreatedTopicName',
          Subscription: [
            {
              Endpoint: '${self:custom.catalogItemsQueueArn}',
              Protocol: 'sqs',
            },
          ],
        },
      },
      ProductCreatedTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:ADMIN_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'ProductCreatedTopic',
          },
        },
      },
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Value: {
          Ref: 'CatalogItemsQueue',
        },
        Export: {
          Name: 'product-service-sqs-url',
        },
      },
      CatalogItemsQueueArn: {
        Value: '${self:custom.catalogItemsQueueArn}',
        Export: {
          Name: 'product-service-sqs-arn',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
