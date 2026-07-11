const User = require('../models/User');
const Analysis = require('../models/Analysis');
const MockInterview = require('../models/MockInterview');
const Resume = require('../models/Resume');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        currentRole: user.currentRole,
        targetRole: user.targetRole,
        photoUrl: user.photoUrl,
        settings: user.settings,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.currentRole = req.body.currentRole !== undefined ? req.body.currentRole : user.currentRole;
      user.targetRole = req.body.targetRole !== undefined ? req.body.targetRole : user.targetRole;
      user.photoUrl = req.body.photoUrl !== undefined ? req.body.photoUrl : user.photoUrl;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        currentRole: updatedUser.currentRole,
        targetRole: updatedUser.targetRole,
        photoUrl: updatedUser.photoUrl,
        settings: updatedUser.settings,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.settings = { ...user.settings.toObject(), ...req.body };
      const updatedUser = await user.save();
      res.json(updatedUser.settings);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      if (user.authProvider !== 'local') {
        return res.status(400).json({ message: 'Cannot change password for social login accounts' });
      }

      const { currentPassword, newPassword } = req.body;
      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const analyses = await Analysis.find({ user: userId }).sort({ createdAt: -1 });
    const sessions = await MockInterview.find({ user: userId }).sort({ createdAt: -1 });
    const versions = await Resume.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      analyses,
      sessions,
      versions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  updateUserPassword,
  getUserHistory,
};
