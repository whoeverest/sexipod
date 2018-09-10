import { Request, Response } from "express"

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
    console.log("The URL is %s", url);

    return res.redirect("/");
}