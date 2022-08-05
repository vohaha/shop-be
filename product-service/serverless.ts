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
    },
  },
  // import the function via paths
  functions,
  package: { individually: true },
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
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SQSCatalogItemsRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
                Action: ['sts:AssumeRole'],
              },
            ],
          },
          Policies: [
            {
              PolicyName: 'SQSCatalogItemsPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['sqs:*', 'logs:*'],
                    Resource: '*',
                  },
                ],
              },
            },
          ],
        },
      },
    },
    Outputs: {
      SQSUrl: {
        Value: {
          Ref: 'CatalogItemsQueue',
        },
        Export: {
          Name: 'product-service-sqs-url',
        },
      },
      SQSArn: {
        Value: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
        },
        Export: {
          Name: 'product-service-sqs-arn',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
