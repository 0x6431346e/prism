import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootEl = document.getElementById('root');
ReactDOM.render(<App />, rootEl);
registerServiceWorker();

if (module.hot) {
    module.hot.accept('./App', () => {
        ReactDOM.render(<App />, rootEl)
    })
}