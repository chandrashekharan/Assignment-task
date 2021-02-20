
var token = {};
var jsonwebtoken = require('jsonwebtoken');
const { secretKey, expiredAfter, SESSION_TIME } = require('../../../config/database.config');


token.checkJwtToken = (req, res) => {

    return async function (req, res, next) {
      
        var token = req.body.token || req.query.token || req.headers['x-application-token'];
  
        if (token) {
          jsonwebtoken.verify(token, secretKey, async function (err, decoded) {
            if (err) {
              responseData.getSuccessResponse(res, responseData.api_response_status['Forbidden'], 'Failed to authenticate token.', false)
            } else {
                next();
            }
          });
        } else {
          console.log('Token Missing');
          res.status(403).send({
            message: 'Please provide token.'
        });
      }
      
    }
  }

  /**
 * JWT Token Generation
 */
token.generateTokken = function (email='she@gmail.com', password='chandra@123') {
    console.log('email==', email)
    console.log('password==', password)
    let jwt = jsonwebtoken.sign(
      {
        expiredAt: Date.now() + expiredAfter,
        email: email,
        password: password
      },
      secretKey,
      {
        expiresIn: expiredAfter
      }
    );
    return jwt;
  }
 
  module.exports = token