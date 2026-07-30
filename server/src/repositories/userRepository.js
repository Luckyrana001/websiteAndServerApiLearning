const User = require("../models/User");

function findAll() {
  return User.find().sort({ createdAt: -1 });
}

function findById(id) {
  return User.findById(id);
}

function findByEmail(email) {
  return User.findOne({ email });
}

function create(userData) {
  return User.create(userData);
}

function updateById(id, updates) {
  return User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
}

function deleteById(id) {
  return User.findByIdAndDelete(id);
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
};
