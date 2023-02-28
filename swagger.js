const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "SeSAC fridge",
      version: "1.0.0",
      description: "새싹 냉장고 swagger api로 api 문서 명세화",
    },
  },
  servers: [
    {
      url: "http://localhost:8080",
    },
  ],
  apis: ["./routes/*.js", "./swagger/*.js"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
