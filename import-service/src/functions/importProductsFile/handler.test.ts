import createEvent from "@serverless/event-mocks";
import { main } from "./handler";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
jest.mock("@aws-sdk/s3-request-presigner");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

process.env.BUCKET_NAME = "bucket-name";
process.env.FOLDER_IMPORTED_DATA = "folder-imported-data";

describe("Unit test: import products file", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should return 200", async () => {
    const signedUrlMock = "example-url.com";
    const getSignedUrlMock: jest.Mock = getSignedUrl as any;
    const event = {
      pathParameters: { name: "test" },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;
    getSignedUrlMock.mockResolvedValue(signedUrlMock);
    const resp = await main(createEvent("aws:apiGateway", event), context);
    expect(resp).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(signedUrlMock),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  });
});
