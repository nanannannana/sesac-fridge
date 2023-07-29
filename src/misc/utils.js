function buildResponse(data, message, errorMessage) {
  return {
    result: !errorMessage ? "success" : "failure",
    message: message ?? errorMessage,
    data,
  };
}

module.exports = { buildResponse };
