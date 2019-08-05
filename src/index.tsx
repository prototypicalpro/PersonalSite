import React from "react";
import { hydrate, render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import MainPage from "./MainPage";
import "babel-polyfill";
import "intersection-observer";

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
