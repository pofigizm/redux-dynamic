/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

const createDetach = (registry, store, dynamicMiddlewares) => ({
  key,
}) => {
  if (!key) {
    console.error('Key is not defined.')
    return false
  }

  if (!registry.keys[key]) {
    console.error('Store does not have a key.')
    return false
  }

  delete registry.keys[key]
  delete registry.reducers[key]
  delete registry.thunks[key]
  delete registry.middlewares[key]

  const state = store.getState()
  delete state[key]

  store.replaceReducer(combineReducers(registry.reducers))
  dynamicMiddlewares.resetMiddlewares()

  const thunkObject = thunkMiddleware.withExtraArgument(registry.thunks)
  dynamicMiddlewares.addMiddleware(thunkObject)

  Object.values(registry.middlewares)
    .forEach((mdware) => {
      dynamicMiddlewares.addMiddleware(mdware)
    })

  return true
}

export {
  createDetach,
}
