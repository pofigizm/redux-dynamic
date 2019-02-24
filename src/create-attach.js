/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { reloadState } from './reload-state'

const emptyMiddleware = () => next => action => next(action)
const emptyReducer = (state = {}) => state

const createAttach = (registry, store, dynamicMiddlewares) => ({
  key,
  initial = {},
  thunk = {},
  reducer = emptyReducer,
  middleware = emptyMiddleware,
}) => {
  if (!key) {
    console.error('Key is not defined.')
    return false
  }

  if (registry.keys[key]) {
    console.error('Store already has a same key.')
    return false
  }

  registry.keys = {
    ...registry.keys,
    [key]: true,
  }

  registry.reducers = {
    ...registry.reducers,
    [key]: (state = initial, action) => reducer(state, action),
  }

  registry.thunks = {
    ...registry.thunks,
    [key]: thunk,
  }

  registry.middlewares = {
    ...registry.middlewares,
    [key]: middleware,
  }

  reloadState(registry, store, dynamicMiddlewares)

  return true
}

export {
  createAttach,
}
