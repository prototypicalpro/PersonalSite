import * as React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import MainPage from "./components/MainPage";

const rootEl = document.getElementById("root");

render(
    <AppContainer>
        <MainPage/>
    </AppContainer>,
    rootEl
);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
    module.hot.accept("./components/MainPage", () => {
        const MainPage = require("./components/MainPage").default;

        render(
            <AppContainer>
                <MainPage/>
            </AppContainer>,
            rootEl
        );
    });
}
