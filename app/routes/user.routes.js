module.exports = (app) => {
    const userController = require('../controllers/user.controller.js');
    var authValidation = require('../controllers/middleware/authvalidation');
    // Create a new User
    app.post('/user', userController.create);

    // Delete a User with userId
    app.delete('/user/:userId', authValidation.checkJwtToken(),  userController.delete);
      // Retrieve all User
    app.get('/users', authValidation.checkJwtToken(),  userController.findAll);

      // Retrieve a single Note with userId
    app.get('/user/:userId', authValidation.checkJwtToken(),  userController.findOne);
    app.post('/user/login',  userController.login);
  
}