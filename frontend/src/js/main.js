import '../scss/style.scss';
import 'chota/dist/chota.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import store from './store/index';


// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
        <React.StrictMode>
            <Provider store = {store}>
                <BrowserRouter>
                    <App></App>
                </BrowserRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root'),
);

console.log('project is set up');
