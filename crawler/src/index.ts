import * as express from 'express';
import * as request from 'request';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/client`));

app.post('/crawl', (req, res) => {
  res.send(req.body);
});

app.get('/', express.static(`${__dirname}/client`));


const port = 3000;
console.log('Crawler is online:', `http://localhost:${port}`);
app.listen(port);
