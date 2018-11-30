
const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');

const tokenLifeTime = require('../../config/index').serverConfig.tokenLifeTime;

const TokenSchema = new mongoose.Schema({

  user : {
  	type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },

  userAgent	: {
  	type: String
  },

  userIp : {
  	type: String
  },

  hash : {
  	type: String,
    default: () => { // TODO : use bcrypt
      let salt = new Buffer( crypto.randomBytes( 16 ).toString( 'base64' ) , 'base64' );
      return crypto
        .pbkdf2Sync( new Date().getTime().toString() , salt, 10000, 64, 'sha1' )
        .toString( 'base64' )
        .replace(/\=/g, '');
    },
    index: true
  },

  createdAt: {
    type: Date,
    default: () => { return moment.utc() },
    get: ( value ) => moment( value ).unix(),
    expires: tokenLifeTime
  }

}, {
  versionKey: false,
  toObject: { getters: true },
  id: false,
});

module.exports = mongoose.model( 'Token', TokenSchema );
