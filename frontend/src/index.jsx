import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App'
import './styles.css'

const container = document.getElementById('root')
const root = createRoot(container) // Create the root for rendering

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
