import express from 'express';
import { login, logout, register, forgotPassword } from "../controller/authController.js"
const router = express.Router();



router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);


export default router;