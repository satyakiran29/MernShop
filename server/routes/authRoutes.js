import express from 'express';
import { authUser, registerUser, getUserProfile, sendOTP, verifyOTP, verify2FALogin, resetPassword, toggle2FA, verifyRegistration } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verify-2fa', verify2FALogin);
router.post('/reset-password', resetPassword);
router.post('/verify-registration', verifyRegistration);
router.put('/profile/2fa', protect, toggle2FA);

export default router;
