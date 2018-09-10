import errorHandler = require('errorhandler');

import app from "./app";

// Error handler. Provides full stack - TO BE removed for production!
app.use(errorHandler());

// Start Express server
const server = app.listen(app.get("port"), () => {
    console.log(
        "App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );

    console.log("Press CTRL-C to stop\n");
});

export default server;