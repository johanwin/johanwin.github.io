import React from 'react';
import { render } from "react-dom";
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

const renderApp = Component =>
render(
    <App />,
    document.getElementById("root")
);

// registerServiceWorker();
renderApp(App);

if (module.hot) module.hot.accept("./App", () => renderApp(App));
