import { Router } from 'express';
import { Example } from '@playground/types/example';
import { examples } from '../models/Example';


const router = Router();

router.get('/', (req, res) => {
    res.send(examples.getAll());
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const example = examples.getById(id);
    if (example) {
        res.send(example);
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

router.post('/', (req, res) => {
    const data: Example = req.body;
    const newExample = examples.add(data);
    res.send(newExample);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const data: Example = req.body;
    const updatedExample = examples.update(id, data);
    if (updatedExample) {
        res.send(updatedExample);
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const success = examples.delete(id);
    if (success) {
        res.send({ message: `DELETE request to the example endpoint with id ${id}` });
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

export default router;
