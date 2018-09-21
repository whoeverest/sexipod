import { Request, Response } from "express"
import * as request from 'request';
import * as cheerio from 'cheerio';
import * as Promise from 'bluebird';
import * as validate from 'validate.js';

function requestAsync(url: string): Promise<{ response: request.Response, html: string }> {
    return new Promise((resolve, reject) => {
        request(url, (err, response, html) => {
            if (err) return reject(err);
            else resolve({ response, html });
        })
    })
}

class Ping {
    private _url: string;

    constructor (url: string) { 
        this._url = url; 
    }

    makeRequest() {
        return Promise.all([
            this.requestLinks(),
            this.requestSize()
        ]).then(arr => {
            return {
                numLinks: arr[0],
                calcSize: arr[1]
            }
        })
    }

    requestLinks(): Promise<number | null> {
        let countedLinks: number = 0;
        
        return requestAsync(this._url)
        .then((obj) => {
            if (obj.response.statusCode !== 200) {
                throw new Error('Response is not 200');
            }
            const sourceCodeDump = cheerio.load(obj.html);
            sourceCodeDump("a").each(() => { countedLinks++; }); 
            
            return countedLinks;
        })   
    }

    requestSize(): Promise<number | string> {
        return requestAsync(this._url)
        .then((obj) => {
            let contLength = obj.response.headers["content-length"];
            if (!contLength) { return "none"; } 
            else {
                let contLengthKBS = Number.parseInt(contLength, 10) / 1000;
                return contLengthKBS;
            }
        })
    }
}

// GET /
// Home page of the crawler
export let index = (req: Request, res: Response) => {
    res.render("home", {
        title: "Home"
    });
};

// POST /url
// Route for sending an URL
export let postURL = (req: Request, res: Response) => {
    req.assert("url", "URL cannot be blank!").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        req.flash("blankURL", errors);
        return res.render("home", {size: "none", links: "none"});
    }
    
    let url: string = req.body.url;
    let checkUrl: undefined | object = validate({website: url}, {website: {url: true}});

    if(typeof checkUrl == 'object') {
        req.flash("urlValidate", "Not a valid URL! Use http:// or https:// in front of the domain.");
        return res.render("home", {size: "none", links: "none"});
    }

    let ping = new Ping(url);

    ping.makeRequest()
    .then((d) => {
        res.render("home", { size: d.calcSize, links: d.numLinks });
    })
    .catch((err) => { console.error(err); res.status(500).end("Server error 500!"); });
}
