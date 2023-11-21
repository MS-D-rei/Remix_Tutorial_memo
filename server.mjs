import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import express from "express";

// notice that the result of 'remix build' is just a module
import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

// and your app is just a request handler
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  // because you own your server, you also have to tell Remix
  // when it has restarted so Remix can safely send the hot updates to the browser
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady();
  }
  console.log("App listening on http://localhost:3000/");
});
