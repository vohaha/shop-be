import type { AWS } from "@serverless/typescript";

import functions from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "${env:REGION}" as AWS["provider"]["region"],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      CATALOG_ITEMS_QUEUE_URL: {
        "Fn::ImportValue": "product-service-sqs-url",
      },
    },
  },
  // import the function via paths
  functions,
  package: { individually: true },
  useDotenv: true,
  custom: {
    s3BucketName: "${env:BUCKET_NAME}",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ImportFilesBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.s3BucketName}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT"],
                AllowedOrigins: ["*"],
              },
            ],
          },
        },
      },
      ParseFilesRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: {
              Effect: "Allow",
              Principal: {
                Service: "lambda.amazonaws.com",
              },
              Action: ["sts:AssumeRole"],
            },
          },
          Policies: [
            {
              PolicyName: "ParseFilesPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["s3:ListBucket"],
                    Resource: ["arn:aws:s3:::${self:custom.s3BucketName}"],
                  },
                  {
                    Effect: "Allow",
                    Action: ["s3:*"],
                    Resource: ["arn:aws:s3:::${self:custom.s3BucketName}/*"],
                  },
                  {
                    Effect: "Allow",
                    Action: ["logs:*"],
                    Resource: "arn:aws:logs:*:*:log-group:/aws/lambda/*:*:*",
                  },
                  {
                    Effect: "Allow",
                    Action: ["sqs:*"],
                    Resource: {
                      "Fn::ImportValue": "product-service-sqs-arn",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      ImportFilesRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: {
              Effect: "Allow",
              Principal: {
                Service: "lambda.amazonaws.com",
              },
              Action: ["sts:AssumeRole"],
            },
          },
          Policies: [
            {
              PolicyName: "import-files-policy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["s3:PutObject", "s3:PutObjectAcl"],
                    Resource: ["arn:aws:s3:::${self:custom.s3BucketName}/*"],
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents",
                    ],
                    Resource: "arn:aws:logs:*:*:log-group:/aws/lambda/*:*:*",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
