import { Router } from 'express';
import { profiles } from '../models/Profile';

const router = Router();

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const profile = profiles.getById(id);

    if (profile) {
        res.send(profile);
    } else {
        res.status(404).send({ message: `Profile with id ${id} not found` });
    }
});

export default router;

