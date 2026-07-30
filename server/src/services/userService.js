const userRepository = require("../repositories/userRepository");

function normaliseEmail(email) {
  return email.trim().toLowerCase();
}

function buildUserData({ name, email, age }) {
  const userData = {
    name: name.trim(),
    email: normaliseEmail(email),
  };

  if (age !== undefined && age !== null && age !== "") {
    userData.age = Number(age);
  }

  return userData;
}

async function listUsers() {
  return userRepository.findAll();
}

async function createUser(input) {
  const userData = buildUserData(input);
  const existingUser = await userRepository.findByEmail(userData.email);

  if (existingUser) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  return userRepository.create(userData);
}

async function updateUser(id, input) {
  const userData = buildUserData(input);
  const existingUser = await userRepository.findById(id);

  if (!existingUser) return null;

  const duplicateUser = await userRepository.findByEmail(userData.email);
  if (duplicateUser && String(duplicateUser._id) !== String(id)) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  if (input.age === undefined || input.age === null || input.age === "") {
    userData.$unset = { age: 1 };
    delete userData.age;
  }

  return userRepository.updateById(id, userData);
}

async function deleteUser(id) {
  return userRepository.deleteById(id);
}

module.exports = { listUsers, createUser, updateUser, deleteUser };
