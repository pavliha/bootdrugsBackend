const Token = require('../models/Token');
const TokenRequest = require('../models/TokenRequest');

class TokenRepo {

  getFirstTokenBy( filter ){
    return Token.findOne( filter );
  }

  createToken( body ){
    return Token.create( body );
  }

  delete( filter ) {
    return Token.deleteMany(filter);
  }
}

module.exports = new TokenRepo();

