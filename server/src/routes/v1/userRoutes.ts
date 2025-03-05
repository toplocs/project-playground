import { Router } from 'express';
import { users } from '../../models/User';
import { authenticate } from '../../middleware/authenticate'; // Import the authentication middleware

const router = Router();

router.get('/:id', authenticate, async (req, res) => { // Add the authenticate middleware to the route
    const { id } = req.params;
    const user = await users.getByIdWithProfiles(id);

    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: `User including Profiles for user id ${id} not found` });
    }
});

export default router;
