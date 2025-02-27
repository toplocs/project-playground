import { Router } from 'express';
import { users } from '../models/User';

const router = Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await users.getByIdWithProfiles(id);

    if (user) {
        console.log('User: ', user);
        res.send(user);
    } else {
        res.status(404).send({ message: `User including Profiles for user id ${id} not found` });
    }
});

export default router;

