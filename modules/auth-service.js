require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;
let User;

let userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [
        {
            dateTime: Date,
            userAgent: String
        }
    ]
});

// Prevent multiple connection attempts
let connection = null;

function initialize() {
    return new Promise(function (resolve, reject) {
        // If connection already exists or is in progress
        if (User) {
            return resolve();
        }
        
        // Mongoose connection options for serverless
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            bufferCommands: false // Disable command buffering
        };

        if (connection) return resolve();

        // Connect to MongoDB
        connection = mongoose.createConnection(process.env.MONGODB, options);
        
        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            reject(err);
        });
        
        connection.once('open', () => {
            User = connection.model("users", userSchema);
            resolve();
        });
    });
}

function registerUser(userData) {
    return new Promise(function (resolve, reject) {
        // Check if passwords match
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
            return;
        }

        // Hash the password
        bcrypt.hash(userData.password, 8)
            .then(hash => {
                // Store the hashed password
                userData.password = hash;

                // Create a new User
                let newUser = new User(userData);
                
                // Save the user
                newUser.save()
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        } else {
                            reject(`There was an error creating the user: ${err}`);
                        }
                    });
            })
            .catch(err => {
                console.error("Bcrypt error:", err);
                reject("There was an error encrypting the password");
            });
    });
}

function checkUser(userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName })
            .exec()
            .then(users => {
                if (users.length === 0) {
                    reject(`Unable to find user: ${userData.userName}`);
                    return;
                }

                // Compare the password with the stored hash
                bcrypt.compare(userData.password, users[0].password)
                    .then(result => {
                        if (!result) {
                            reject(`Incorrect Password for user: ${userData.userName}`);
                            return;
                        }

                        // Update login history
                        if (users[0].loginHistory.length === 8) {
                            users[0].loginHistory.pop();
                        }
                        users[0].loginHistory.unshift({ 
                            dateTime: (new Date()).toString(), 
                            userAgent: userData.userAgent 
                        });

                        // Update the user in the database
                        User.updateOne(
                            { userName: users[0].userName },
                            { $set: { loginHistory: users[0].loginHistory } }
                        )
                            .exec()
                            .then(() => {
                                resolve(users[0]);
                            })
                            .catch(err => {
                                reject(`There was an error verifying the user: ${err}`);
                            });
                    })
                    .catch(err => {
                        reject(`There was an error verifying the user: ${err}`);
                    });
            })
            .catch(() => {
                reject(`Unable to find user: ${userData.userName}`);
            });
    });
}

module.exports = {
    initialize,
    registerUser,
    checkUser
};
