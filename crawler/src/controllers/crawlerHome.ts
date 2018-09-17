import { Request, Response } from "express"

const request = require('request');
const cheerio = require('cheerio');

class Ping {
    private _url: string;

    private _links: number | undefined;
    private _size: number | undefined;

    constructor (url: string) { 
        this._url = url; 

        this.requestSize();
        this.requestLinks();
    }

    get links(): number | undefined {
        return this._links;
    }
    
    get size(): number | undefined {
        return this._size;
    }
    
    requestLinks(): void {
        let countedLinks: number = 0;

        request(this._url, (error: any, response: any, html: any) => {
            if (!error && response.statusCode == 200) {
                const sourceCodeDump = cheerio.load(html);
                sourceCodeDump("a").each(() => { countedLinks++; });

                this._links = countedLinks;   
            } else {
                this._links = countedLinks;   
            }
        });
    }

    requestSize(): void {
        request(this._url, (error: any, response: any, html: any) => {
            if(response.headers["content-length"]) {
                this._size = response.headers["content-length"];
            } else {
                this._size = 0;
            }
        });

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
    
    let url: string = req.body.url;
    // TODO: Check if it is a valid URL
    // FAIL if not.

    let ping = new Ping(url);

    setTimeout(() => {
        let websiteSize: number | undefined = ping.size;
        if (websiteSize) { websiteSize = websiteSize / 1000 };
    
        let websiteLinks: number | undefined = ping.links;

        // It renders home, but stays at /url
        // It should redirect to / and render home
        // with the results
        return res.render("home", {
            title: "Home",
            size: websiteSize,
            links: websiteLinks
        })
    }, 1000);
}


