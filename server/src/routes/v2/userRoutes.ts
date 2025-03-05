import { Router } from 'express';
import { users } from '../../models/User';
import { authenticate } from '../../middleware/authenticate'; // Import the authentication middleware

const userRouter = Router();
const usersRouter = Router();
const router = Router();

router.use('/users', usersRouter);
router.use('/user', userRouter);
router.all(`/users/*`, (req, res, next) => {
    res.status(404);
    res.pageFound = false;
    next();
});

export default router;

userRouter.get('/:id', authenticate, async (req, res) => { // Add the authenticate middleware to the route
    const { id } = req.params;
    const user = await users.getByIdWithProfiles(id);

    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: `User including Profiles for user id ${id} not found` });
    }
});
