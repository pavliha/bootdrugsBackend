const toObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/User');
const UserCredentials = require('../models/UserCredentials');
const ResetPasswordRequest = require('../models/ResetPasswordRequest');

class UserRepo {

  getFirstUserBy( filter ) {
    return User.findOne( filter );
  }

  getUsersBy( filter ) {
    return User.find( filter );
  }

  findUserCredentials( filter ) {
    return UserCredentials.findOne( filter );
  }

  createOne( body, password, isHash = false ) {
    let credentials = isHash? { passwordHash: password } : { password: password };
    return User.create( body ).then( user => UserCredentials.create({ ...credentials, user: user._id }) && user);
  }

  updateUser( filter, body ) {
    return User.updateOne( filter, body )
  }

  deleteUser( filter ) {
    // Change to deleteMany() after supporting pre-hooks ( prevent `Deprecation Warnings`)
    // https://mongoosejs.com/docs/deprecations.html
    return User.remove( filter )
  }

  getFirstResetPasswordBy( filter ) {
    return ResetPasswordRequest.findOne( filter );
  }

  createResetToken( body ) {
    return ResetPasswordRequest.create( body )
  }

  deleteResetToken( body ) {
    return ResetPasswordRequest.deleteMany( body )
  }

}

module.exports = new UserRepo();
