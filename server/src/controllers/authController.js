const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { findUserByEmail, createUserInMemory, comparePasswordInMemory, updateUserInMemory } = require('../utils/userStore');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const useInMemoryStore = () => {
  return !process.env.MONGO_URI || process.env.MONGO_URI.includes('localhost') || process.env.MONGO_URI.includes('127.0.0.1');
};

const registerLocal = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (useInMemoryStore()) {
      const userExists = await findUserByEmail(email);

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await createUserInMemory({
        name,
        email,
        password,
        authProvider: 'local',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id),
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginLocal = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (useInMemoryStore()) {
      const user = await findUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await comparePasswordInMemory(user, password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id),
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (useInMemoryStore()) {
      let user = await findUserByEmail(email);

      if (user) {
        if (!user.providerId && user.authProvider === 'local') {
          user = await updateUserInMemory(user._id, {
            providerId: googleId,
            isEmailVerified: true,
          });
        }
      } else {
        user = await createUserInMemory({
          name,
          email,
          authProvider: 'google',
          providerId: googleId,
          isEmailVerified: true,
        });
      }

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id),
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.providerId && user.authProvider === 'local') {
        user.providerId = googleId;
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        providerId: googleId,
        isEmailVerified: true,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401).json({ message: 'Invalid Google token or authentication failed' });
  }
};

module.exports = {
  registerLocal,
  loginLocal,
  googleAuth,
};
