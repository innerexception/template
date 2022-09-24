import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './ui/styles/app.css'
import 'normalize.css'

// import * as serviceWorker from './serviceWorker'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import appReducer from './ui/common/UIReducer'
import thunk from 'redux-thunk'
import AppContainer from './ui/AppContainer'

// Sentry init
// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';
// Sentry.init({
//   dsn: "https://39b943ca77e24ec0ad3d7b8316254786@o441591.ingest.sentry.io/5411966",
//   integrations: [
//     new Integrations.BrowserTracing(),
//   ],
//   tracesSampleRate: 1.0,
// });

export const store = createStore(appReducer, applyMiddleware(
    thunk // lets us dispatch() functions
))

ReactDOM.render((
  <Provider store={store}>
        <AppContainer/>
  </Provider>
), document.getElementById('appRoot'))



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()