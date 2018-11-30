const mongoose = require('mongoose');
const moment = require('moment');

const configRoles = require('../../config/index').userConfig.roles;

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    unique: true,
    required: true,
    set: (value) => {
      return value.toLowerCase();
    }
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },


  gender: {
    type: String,
    enum: [
      'male',
      'female'
    ],
    required: true,
    default: 'male'
  },

  avatar: {
    type: String
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  role: {
    type: Number,
    enum: Object.values( configRoles ),
    default: configRoles.default
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

UserSchema.pre('remove', { query: true, document: false }, async function() {

  await mongoose.model('Token')
    .remove({
      user: this.getQuery()._id
    });

  await mongoose.model('UserCredentials')
    .remove({
      user: this.getQuery()._id
    });

  await mongoose.model('ResetPasswordRequest')
    .remove({
      user: this.getQuery()._id
    });

});

module.exports = mongoose.model("User", UserSchema);
