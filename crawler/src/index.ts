import * as express from 'express';

const app = express();

app.use(express.static(`${__dirname}/client`));

app.get('/', express.static(`${__dirname}/client`));


const port = 3000;
console.log('Crawler is online:', `http://localhost:${port}`);
app.listen(port);
