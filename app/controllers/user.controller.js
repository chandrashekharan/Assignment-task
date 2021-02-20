const User = require('../models/user.model.js');
const authvalid = require('../controllers/middleware/authvalidation');
// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if(!req.body.email) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Create a User
    const user = new User({
        email: req.body.email || "email", 
        password: req.body.password
    });

    // Save User in the database
    user.save()
    .then(async datas => {
        
        res.send(datas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
};


// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};
// Retrieve and return all User from the database.
exports.findAll = async (req, res) => {

    User.find().skip(parseInt(req.query.skip_range)).limit(parseInt(req.query.limit_range))
    .then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving user."
        });
    });
};
// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Find a single user with a userId
exports.login = (req, res) => {
    console.log('req.body=',req.body)
    let email = req.body.email
    let password = req.body.password

    User.findOne({email:email,password:password})
    .then(async user => {
        console.log('user===',user)
        if(!user) {
            return res.status(404).send({
                message: "Email/Password Invalid "
            });            
        }
        
       const get_token = await authvalid.generateTokken(user.email,user.password)
       let user_data ={}
       user_data.message= "Login Successfully"
       user_data.email= user.email
       user_data.token = get_token
       res.send(user_data);
    }).catch(err => {
        return res.status(500).send({
            message: err.message ||"Error retrieving email with id " 
        });
    });
};
