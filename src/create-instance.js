import { combineReducers } from 'redux'
import { createDynamicMiddlewares } from 'redux-dynamic-middlewares'
import thunkMiddleware from 'redux-thunk'

import { configureStore } from './configure-store'
import { createAttach } from './create-attach'
import { createDetach } from './create-detach'

const emptyMiddleware = () => next => action => next(action)
const emptyReducer = (state = {}) => state

const createInstance = ({
  name = 'redux-dynamic',
  key,
  initial = {},
  thunk = {},
  reducer = emptyReducer,
  middleware = emptyMiddleware,
  withDevTools = true,
} = {}) => {
  if (!key) {
    console.error('Key is not defined.')
  }

  const dynamicMiddlewares = createDynamicMiddlewares()
  const registry = {
    keys: {
      [key]: true,
    },
    reducers: {
      [key]: reducer,
    },
    thunks: {
      [key]: thunk,
    },
    middlewares: {
      [key]: middleware,
    },
  }

  const store = configureStore({
    name,
    withDevTools,
    key,
    initial: {
      [key]: initial,
    },
    reducer: combineReducers(registry.reducers),
    dynamicMiddlewares: dynamicMiddlewares.enhancer,
  })

  const thunkObject = thunkMiddleware.withExtraArgument(registry.thunks)
  dynamicMiddlewares.addMiddleware(thunkObject)

  Object.values(registry.middlewares)
    .forEach((mdware) => {
      dynamicMiddlewares.addMiddleware(mdware)
    })

  const getStore = () => store
  const attach = createAttach(registry, store, dynamicMiddlewares)
  const detach = createDetach(registry, store, dynamicMiddlewares)

  return {
    getStore,
    attach,
    detach,
  }
}

export {
  createInstance,
}
