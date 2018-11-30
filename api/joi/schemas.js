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

  auth: {

    tokenRequestBody: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),

    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })

  },

  id: Joi.object({
    id: Joi.objectId().required()
  }),

  email: Joi.object({
    email: Joi.string().email().required()
  }),

  user: {

    create: Joi.object( { // 2 - business, 3 - nonProfit, 4 - donor
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      birthDate: Joi.number(),
      gender: Joi.string().valid( [ 'male', 'female' ] )
    }),

    update: Joi.object( {
      firstName: Joi.string().when( 'role', { is: 4, then: Joi.required(), otherwise: Joi.forbidden() } ),
      lastName: Joi.string().when( 'role', { is: 4, then: Joi.required(), otherwise: Joi.forbidden() } ),
      birthDate: Joi.number().max( moment().subtract(18, 'years').unix() ).when( 'role', { is: 4, then: Joi.required(), otherwise: Joi.forbidden() } ),

      gender: Joi.string().valid( [ 'male', 'female' ] )
    }),

    passwordChange: Joi.object({
      password: Joi.string().required(),
      newPassword: Joi.string().min(6).required()
    }),

    emailChange: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),

  },

  resetPasswordRequest: {
    params: Joi.object({
      email: Joi.string().email().required()
    })
  },

  resetPassword: {
    params: Joi.object({
      passwordResetToken: Joi.string().required()
    }),
    body: Joi.object({
      password: Joi.string().required().min(6),
    })
  }

};
