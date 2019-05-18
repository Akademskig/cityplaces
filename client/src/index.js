import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import "semantic-ui-css/semantic.min.css"
import 'react-notifications/lib/notifications.css';
import './styles/index.scss';
import * as serviceWorker from './serviceWorker';
import { MainRoutes } from './routes';
import ErrorHandler from './components/ErrorHandler';

ReactDOM.render(
    <ErrorHandler>
        <BrowserRouter>
            <MainRoutes />
        </BrowserRouter>
    </ErrorHandler>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
