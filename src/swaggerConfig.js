const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "API Cora", 
      version: "1.0.0", 
      description: "Documentação da API Cora", 
    },
  },
 
  apis: ["./*.js", "./src/routes/*.js"], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
