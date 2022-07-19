export function formatJSONResponse(response: unknown, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
}
