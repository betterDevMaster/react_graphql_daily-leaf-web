import React from 'react'
import { render } from 'react-dom'
import App from './app/App'
import registerServiceWorker from './app/registerServiceWorker'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './app/store'

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
