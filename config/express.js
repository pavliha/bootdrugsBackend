const os = require('os');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');

const corsify = require('../api/handlers/CORS');

if ( ! process.env.API_ENVIRONMENT ) process.env.API_ENVIRONMENT = 'development';

module.exports = app => {

  app.use( helmet() );

  if ( process.env.API_ENVIRONMENT === 'development') app.use( morgan('dev') );

  corsify(app);

  app.use( bodyParser.urlencoded( { limit: '10mb', extended: false } ) );

  app.use( bodyParser.json( { limit: '10mb', extended: true } ) );

  app.use('/api/images', express.static( os.homedir() + '/public/avatar' ));

};
