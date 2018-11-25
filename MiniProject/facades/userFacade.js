var mongoose = require("mongoose");
var User = require("../models/user");

function getAllUsers() {
  return User.find({}).exec();
}

function addUser(firstName, lastName, userName, password, email) {
  var userDetail = { firstName, lastName, userName, email, password };
  var newUser = new User(userDetail);
  return newUser.save();
}


function findByUsername(userName) {
  return User.findOne({ userName }).exec();
}

function findById(id) {
  return User.findById({ _id: id }).exec();
}




module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findByUsername: findByUsername,
  findById: findById
  
}