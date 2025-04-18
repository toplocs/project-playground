import { Router, Handler } from 'express';
import { profiles } from '../../models/Profile';
import { profilesLulu } from '../../controllers/profile';
import { Profile } from '@playground/types/Profile';

const profileRouter = Router();
const profilesRouter = Router();
const router = Router();

router.use('/profiles', profilesRouter);
router.use('/profile', profileRouter);

export default router;

profilesRouter.get('/lulu', profilesLulu);

profilesRouter.get('/', (req, res) => {
    const all = profiles.getAll();
    res.send(all);
});

profileRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const profile = profiles.getById(id);

    if (profile) {
        res.send(profile);
    } else {
        res.status(404).send({ message: `Profile with id ${id} not found` });
    }
});

profilesRouter.post('/', (req, res) => {
    const data: Profile = req.body;
    if (!data ) {
        res.status(400).send({ message: 'Profile data is required' });
        return;
    }
    const newProfile = profiles.add(data);
    res.status(201).send(newProfile);
});


