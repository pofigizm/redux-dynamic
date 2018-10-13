import { createStore, applyMiddleware, compose } from 'redux'

const configureStore = (initialState, rootReducer, dynamicMiddlewares) => {
  const middlewares = applyMiddleware(dynamicMiddlewares)
  // eslint-disable-next-line no-underscore-dangle
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  const composeEnhancers = process.env.NODE_ENV !== 'production' && devTools ? devTools : compose
  const enhancers = composeEnhancers(middlewares)
  const store = createStore(rootReducer, initialState, enhancers)

  return store
}

export {
  configureStore,
}
