import * as React from "react";
import App from './components/app';  
import * as ReactDOM from "react-dom";

const app = document.createElement('div');    
document.body.appendChild(app);  
console.log("HELO", app);
ReactDOM.render(
    <App  />,
    app
);