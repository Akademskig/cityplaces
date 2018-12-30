import React from 'react';
import ReactDOM from 'react-dom';
import * as browserHistory from 'react-router'
import { BrowserRouter, Route } from 'react-router-dom'

import './css/index.css';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import App from './containers/App'
import MainRoutes from './routes';

ReactDOM.render(
    <BrowserRouter>
        <MainRoutes />
    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
