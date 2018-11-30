
module.exports = ( joiError ) => {

  joiError = joiError.error;

  if ( joiError && joiError.isJoi ) {

    let errors = [];
    for( let detail of joiError.details ) {
      errors.push( { message: detail.message, property: detail.path.split('.')[0] });
    }

    return errors;

  } else {

    throw new Error('Cannot prettify error because it isn\'t Joi error');

  }

};
