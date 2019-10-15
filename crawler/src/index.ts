import * as express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/client`));

const checkURL = (url: string) => {
  const parsed = new URL(url);
  const hostnameFragments = parsed.hostname.split('.');
  if (hostnameFragments[hostnameFragments.length -1 ] === 'mk') return true;
  return false;
}

app.post('/crawl', async (req, res) => {
  try {
    if (checkURL(req.body.url)) {
      const page = await axios(req.body.url);
      const $ = cheerio.load(page.data);
      const links = $('a').length;
      res.send(`The page ${req.body.url} is ${page.data.length / 1000} kilobytes big, and contains ${links} links.`);
    } else {
      res.status(400).send('Non-mk domain received.');
    }
  } catch(err) {
    res.status(400).send(`Request for <u>${req.body.url}</u> failed. Reason: <pre>${err.message}</pre>`);
  }
});

app.get('/', express.static(`${__dirname}/client`));

const port = 3000;
console.log('Crawler is online:', `http://localhost:${port}`);
app.listen(port);
