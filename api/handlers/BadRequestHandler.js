const prettifyJoiError = require('../helpers/prettifyJoiError');

const MongoError = require('mongoose').mongo.MongoError;
const ValidationError = require('mongoose').Error.ValidationError;

const responseErrors = require('../../config/responseMessages');

module.exports = (error, req, res, next) => {

  console.log('error ->> ', error ); // TODO : remove

  if ( error.error && error.error.isJoi ) {
    res
      .status(400)
      .json({
        error: prettifyJoiError(error)
      });

  } else if ( error instanceof MongoError ) {

    next();

  } else if ( error instanceof ValidationError ) {

    res.status( 400 ).json({
      error: { message: error.message }
    });

  } else {

    res.status( error && !! error.statusCode ? error.statusCode : 500 ).json({
      error: error && !! error.message ? { message: error.message }: { message: 'Unknown server error', details: error }
    });

  }
};
