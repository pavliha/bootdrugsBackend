const mongoose = require('mongoose');
const moment = require('moment');
const md5 = require('md5');

const config = require('../../config').serverConfig;

const ResetPasswordRequestSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    sparse: true
  },

  tokenRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TokenRequest',
    unique: true,
    sparse: true
  },

  resetToken : {
    type: String,
    required: true,
    default: () => { return md5( moment.utc().unix() ) }
  },

  createdAt: {
    type: Date,
    default: () => { return moment.utc() },
    get: ( value ) => moment( value ).unix(),
    expires: config.dailyLifeTime / 24 // one hour life time
  }

}, {
  versionKey: false,
  toObject: { getters: true },
  id: false,
});

module.exports = mongoose.model("ResetPasswordRequest", ResetPasswordRequestSchema);
