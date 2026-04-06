import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30000000d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isActive) {
            res.status(401);
            throw new Error('Account deactivated');
        }

        if (user.is2FAEnabled) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            await user.save();
            await sendOTPEmail(user.email, otp);
            
            return res.json({ 
                requires2FA: true, 
                message: 'OTP sent to email. Please verify to login.',
                email: user.email
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            is2FAEnabled: user.is2FAEnabled,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
        name,
        email,
        password,
        isActive: false, // Ensure account is locked until email is verified
        otp,
        otpExpires
    });

    if (user) {
        await sendOTPEmail(user.email, otp);
        
        res.status(201).json({
            requiresOTP: true,
            message: 'OTP sent to email. Please verify to complete registration.',
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            is2FAEnabled: user.is2FAEnabled,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        // Generate a 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        await sendOTPEmail(user.email, otp);

        res.json({ message: 'OTP sent to email successfully' });
    } else {
        res.status(404);
        throw new Error('User not found with this email');
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
};

// @desc    Verify OTP for 2FA Login
// @route   POST /api/auth/verify-2fa
// @access  Public
export const verify2FALogin = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is2FAEnabled: user.is2FAEnabled,
        token: generateToken(user._id),
    });
};

// @desc    Verify Registration OTP and activate account
// @route   POST /api/auth/verify-registration
// @access  Public
export const verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    // Activate user
    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Log them in immediately after activation
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is2FAEnabled: user.is2FAEnabled,
        token: generateToken(user._id),
    });
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
};

// @desc    Toggle 2FA status
// @route   PUT /api/auth/profile/2fa
// @access  Private
export const toggle2FA = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.is2FAEnabled = !user.is2FAEnabled;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            is2FAEnabled: updatedUser.is2FAEnabled,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

