const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../api/docs/swagger.json');

module.exports = app => {
  app.use('/api/v1/docs',(req, res, next) => {
      if ( process.env.API_ENVIRONMENT === 'development' )
        next();
      else {
        let error = new Error('This route aren\'t available in non-development environment');
        error.statusCode = 404;
        throw error;
      }
    },
    swaggerUi.serve, swaggerUi.setup( swaggerDocument, {
    authAction :{
      Bearer: {
        name: "Bearer",
        schema: {
          type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <Bearer>"
      }
    }
  }));
};
