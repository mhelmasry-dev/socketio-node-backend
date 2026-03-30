import { Router } from "express";
import { auth, roles } from '../../middleware/auth.js';
import * as authController from './controller/auth.js'

const router = Router();
router.post('/signup', authController.signup)
router.post('/login', authController.Login)
router.post('/sendcode', auth(Object.values(roles)), authController.sendCode)
router.post('/reset', auth(Object.values(roles)), authController.verifyForgetCode)
export default router