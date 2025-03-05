import { Router } from 'express';
import { Example } from '@playground/types/example';
import { examples } from '../../models/Example';
import { authenticate } from '../../middleware/authenticate';


const router = Router();
const examplesRouter = Router();
const exampleRouter = Router();
router.use('/examples', examplesRouter);
router.use('/example', exampleRouter);
router.all(`/examples/*`, (req, res, next) => {
    res.status(404);
    res.pageFound = false;
    next();
});
export default router;

examplesRouter.get('/', authenticate, (req, res) => {
    const userId = req.session.loggedInUser;
    const all = examples.getAll()
    res.send(all);
});

examplesRouter.post('/', (req, res) => {
    const data: Example = req.body;
    const newExample = examples.add(data);
    res.status(201).send(newExample);
});

exampleRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const example = examples.getById(id);
    if (example) {
        res.send(example);
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

exampleRouter.put('/:id', (req, res) => {
    const { id } = req.params;
    const data: Example = req.body;
    const updatedExample = examples.update(id, data);
    if (updatedExample) {
        res.send(updatedExample);
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

exampleRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const success = examples.delete(id);
    if (success) {
        res.send({ message: `DELETE request to the example endpoint with id ${id}` });
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});
