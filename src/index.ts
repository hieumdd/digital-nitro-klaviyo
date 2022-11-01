import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { pipelines } from './klaviyo/pipeline.service';

const app = express();

app.post('/', (req, res) => {
    pipelines({ start: req.body.start, end: req.body.end })
        .then((result) => res.status(200).json({ result }))
        .catch((err) => res.status(500).json({ err }));
});

http('main', app);
