import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.end('Hello World!');
});

const port = 3000;
console.log('Crawler is online:', `http://localhost:${port}`);
app.listen(port);
