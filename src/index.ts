const message: string = 'Hello Typescript world!';
console.log(message);

import express, { Express } from 'express';

const app: Express = express();
app.get('/', (_req, res) => {
    res.send(JSON.stringify({
        hallo: 1,
        ichBinEinTest: 'hahaha'
    }));
});
app.post('/', (req, res) => {
    req.params;
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
