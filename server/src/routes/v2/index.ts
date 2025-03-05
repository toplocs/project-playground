import { Router } from 'express';
import passkeyRoutes from './passkeyRoutes';
import exampleRoutes from './exampleRoutes';
import profileRoutes from './profileRoutes';
import userRoutes from './userRoutes';


const routerV2 = Router();
routerV2.use('/', passkeyRoutes, userRoutes, profileRoutes, exampleRoutes);

export default routerV2;
