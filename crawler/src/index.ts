import * as express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/client`));

app.post('/crawl', async (req, res) => {
  const page = await axios(req.body.url);
  const $ = cheerio.load(page.data);
  const links = $('a').length;
  res.send(`The page ${req.body.url} is ${page.data.length / 1000} kilobytes big, and contains ${links} links.`);
});

app.get('/', express.static(`${__dirname}/client`));

const port = 3000;
console.log('Crawler is online:', `http://localhost:${port}`);
app.listen(port);
