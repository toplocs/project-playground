import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Example } from '../../types/example';
import { exampleData, loadExampleData } from './dataLoader';

loadExampleData();

const port = process.env.PORT || 3000;
const corsOptions: cors.CorsOptions = {
  origin: '*'
};

const app = express();
app.use(cors(corsOptions));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(morgan('dev'));
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/example', (req, res) => {
    res.send(exampleData);
});

app.get('/api/example/:id', (req, res) => {
    const { id } = req.params;
    const index = exampleData.findIndex(item => item.id === id);
    console.log("GET ", id, index);
    if (index !== -1) {
        res.send(exampleData[index]);
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

app.post('/api/example', (req, res) => {
    const data: Example = req.body;
    data.id = Math.random().toString(36).substring(7);
    exampleData.push(data);
    res.send(data);
});

app.put('/api/example/:id', (req, res) => {
    const { id } = req.params;
    const data: Example = req.body;
    const index = exampleData.findIndex(item => item.id === id);
    if (index !== -1) {
        exampleData[index] = data;
        res.send(data);
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

app.delete('/api/example/:id', (req, res) => {
    const { id } = req.params;
    const index = exampleData.findIndex(item => item.id === id);
    if (index !== -1) {
        exampleData.splice(index, 1);
        res.send({ message: `DELETE request to the example endpoint with id ${id}` });
    } else {
        res.status(404).send({ message: `Data with id ${id} not found` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
