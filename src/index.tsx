import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {FieldExtensionSDK, init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';

init<FieldExtensionSDK>(sdk => {
  sdk.window.startAutoResizer();
  const initial = sdk.field.getValue();

  ReactDOM.render(
    <React.StrictMode>
      <App contentfulSdk={sdk} initial={initial} />
    </React.StrictMode>,
    document.getElementById('root')
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
