import express from 'express';
import { handleRegisterStart, handleRegisterFinish } from '../../controllers/registration';
import { handleLoginStart, handleLoginFinish, handleLogout } from '../../controllers/authentication';

const router = express.Router();

router.post('/registerStart', handleRegisterStart);
router.post('/registerFinish', handleRegisterFinish);
router.post('/loginStart', handleLoginStart);
router.post('/loginFinish', handleLoginFinish);
router.post('/logout', handleLogout);

export default router;