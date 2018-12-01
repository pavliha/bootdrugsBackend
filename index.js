'use strict';

require('dotenv').config();

const serverConfig = require( './config' ).serverConfig;
const express = require( 'express' );
const app = express();

/**
 * Setup Express Api.
 */
require( './config/express' )( app );

/**
 * Setup Database connection.
 */
require( './config/mongoose' )();


const enableRoutes = require( './api/routes' );

/**
 * Enable 400+ request handlers
 */
const BadRequestHandler = require( './api/handlers/BadRequestHandler' );
const NotFoundHandler = require( './api/handlers/NotFoundHandler' );

enableRoutes( app );

app.use( BadRequestHandler );
app.use( NotFoundHandler );

app.listen(serverConfig.port, () => {
  console.log( `HTTP-server was started at #${ serverConfig.port } port` );
});
