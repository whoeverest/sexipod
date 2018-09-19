import { Request, Response } from "express"
import * as request from 'request';
import * as cheerio from 'cheerio';
import * as Promise from 'bluebird';

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
                calcSize: arr[0],
                numLinks: arr[1]
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

    requestSize(): Promise<number | null> {
        return requestAsync(this._url)
        .then((obj) => {
            let contLength = obj.response.headers["content-length"];
            if (!contLength) { return null; } 
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
        req.flash("errors", errors);
        return res.redirect("/");
    }
    
    // TODO: Check if it is a valid URL
    // FAIL if not.
    let url: string = req.body.url;

    let ping = new Ping(url);

    ping.makeRequest()
    .then((d) => {
        res.render("home", { size: d.calcSize, links: d.numLinks });
    })
    .catch((err) => { console.error(err); res.status(500).end("Server error 500!"); });

    // ping.requestSize((e, responseSize) => {
    //     if (e) return res.status(500).end('something bad happened');
    //     let websiteSize = responseSize;
    //     if (websiteSize) { websiteSize = websiteSize / 1000 };

    //     ping.requestLinks((err, numLinks) => {
    //         if (err) return res.status(500).end('something even worse happened');
    //         // It renders home, but stays at /url
    //         // It should redirect to / and render home
    //         // with the results
    //         res.render("home", { size: websiteSize, links: numLinks });
    //     })
    // });
}
