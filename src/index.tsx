import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import './i18n';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import * as serviceWorker from './serviceWorker';
import { Toaster } from 'react-hot-toast';

const engine = new Styletron();
let persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyletronProvider value={engine}>
          <BaseProvider theme={LightTheme}>
            <App />
            <Toaster />
          </BaseProvider>
        </StyletronProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
