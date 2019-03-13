import { createStore, applyMiddleware, compose } from 'redux'

const configureStore = ({
  name,
  withDevTools,
  initial,
  reducer,
  dynamicMiddlewares,
}) => {
  const middlewares = applyMiddleware(dynamicMiddlewares)
  // eslint-disable-next-line no-underscore-dangle
  const devTools = withDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  const composeEnhancers = devTools ? devTools({ name }) : compose
  const enhancers = composeEnhancers(middlewares)
  const store = createStore(reducer, initial, enhancers)

  return store
}

export {
  configureStore,
}
