const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = new require('bcryptjs');
const md5 = require('md5');

const config = require('../../config/index').serverConfig;

const TokenRequestSchema = new mongoose.Schema( {

  email: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  role: {
    type: Number,
    required: true
  },

  verifyToken: {
    type: String,
    required: true,
    default: () => { return md5( moment.utc().unix() ) }
  },

  isEmailConfirmed: {
    type: Boolean,
    default: false,
    required: true
  },

  createdAt: {
    type: Date,
    default: () => { return moment.utc() },
    get: ( value ) => moment( value ).unix(),
    expires: config.dailyLifeTime * 14
  }

}, {
  versionKey: false,
  toObject: { getters: true },
  id: false,
});


TokenRequestSchema.virtual( 'password' )
  .set( function( password ) {
    this.passwordHash = bcrypt.hashSync( password, config.passwordSaltRound );
});

module.exports = mongoose.model( 'TokenRequest', TokenRequestSchema );
