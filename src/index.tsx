/// <reference types="webpack-env" />
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/app/app';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        basename={__webpack_public_path__}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
