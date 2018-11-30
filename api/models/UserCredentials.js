const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt 	= require('bcryptjs');

const saltRounds = require('../../config').serverConfig.passwordSaltRound;

const UserCredentialsSchema = new mongoose.Schema({

  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },

  passwordHash : {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: () => { return moment.utc() },
    get: ( value ) => moment( value ).unix()
  }

}, {
  versionKey: false,
  toObject: { getters: true },
  id: false,
});

UserCredentialsSchema.virtual( 'password' )
  .set( function( password ) {
    this.passwordHash = bcrypt.hashSync( password, saltRounds );
});

UserCredentialsSchema.methods.authenticate = async function( plainText ) {
  return bcrypt.compareSync( plainText, this.passwordHash );
};

module.exports = mongoose.model("UserCredentials", UserCredentialsSchema);
