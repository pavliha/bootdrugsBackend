const moment = require('moment');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const configRoles = require('../../config/').userConfig.roles;

/**
 *  Joi constants
**/
const boolJoi = Joi.number().integer().valid([ 0, 1 ]);
const positiveJoi = Joi.number().integer().positive();
const regexJoi = ( pattern ) => Joi.string().regex( pattern );
const arrayJoi = ( element ) => Joi.array().items( element );

const arrayIdJoi = arrayJoi( Joi.objectId() );
const joiEin = regexJoi(/^[1-9]\d?-\d{7}$/);

module.exports = {

  analyze: {
    body: Joi.object({
      text: Joi.string().required(),
      title:  Joi.string().required()
    })
  },

  addKeyword: {
    body: Joi.object({
      text: Joi.string(),
    })
  },

  id: Joi.object({
    id: Joi.objectId().required()
  })

};
