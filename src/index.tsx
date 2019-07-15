import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import MainPage from "./MainPage";
import "babel-polyfill";
require("intersection-observer");

const rootElem = document.getElementById("root") as HTMLElement;
if (rootElem.hasChildNodes()) ReactDOM.hydrate(<MainPage />, rootElem);
else ReactDOM.render(<MainPage />, rootElem);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
