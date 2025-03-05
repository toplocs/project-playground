import { Router } from 'express';
import passkeyRoutes from './passkeyRoutes';
import exampleRoutes from './exampleRoutes';
import profileRoutes from './profileRoutes';
import userRoutes from './userRoutes';

const routerV1 = Router();

routerV1.use('/passkey', passkeyRoutes);
routerV1.use('/', exampleRoutes);
routerV1.use('/', profileRoutes);
routerV1.use('/user', userRoutes);

export default routerV1;
