const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const inMemoryUsers = [];

const findUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();
  return inMemoryUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
};

const createUserInMemory = async ({ name, email, password, authProvider = 'local', providerId = null, isEmailVerified = false }) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const user = {
    _id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    authProvider,
    providerId,
    isEmailVerified,
    createdAt: new Date(),
  };

  inMemoryUsers.push(user);
  return user;
};

const comparePasswordInMemory = async (user, enteredPassword) => {
  if (!user?.password) return false;
  return bcrypt.compare(enteredPassword, user.password);
};

const updateUserInMemory = async (userId, updates) => {
  const index = inMemoryUsers.findIndex((user) => user._id === userId);
  if (index === -1) return null;

  inMemoryUsers[index] = { ...inMemoryUsers[index], ...updates };
  return inMemoryUsers[index];
};

module.exports = {
  findUserByEmail,
  createUserInMemory,
  comparePasswordInMemory,
  updateUserInMemory,
};
