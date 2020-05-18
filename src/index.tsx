import React from "react";
import { hydrate, render } from "react-dom";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import MainPage from "./MainPage";
import "core-js/stable";
import "intersection-observer";
import "whatwg-fetch";

if(process.env.NODE_END !== "development")
  Sentry.init({dsn: "https://fd67b78fc5bc4a05bdd2297d68a44d08@sentry.io/1536614"});

const rootElement = document.getElementById("root") as HTMLElement;
if (rootElement.hasChildNodes()) {
  hydrate(<MainPage />, rootElement);
} else {
  render(<MainPage />, rootElement);
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
