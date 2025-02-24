import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { handleRegisterStart, handleRegisterFinish } from '../controllers/registration';
import { handleLoginStart, handleLoginFinish } from '../controllers/authentication';

const router = express.Router();

router.post('/registerStart', handleRegisterStart);
router.post('/registerFinish', handleRegisterFinish);
router.post('/loginStart', handleLoginStart);
router.post('/loginFinish', handleLoginFinish);

export default router;