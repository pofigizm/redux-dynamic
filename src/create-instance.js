import { createDynamicMiddlewares } from 'redux-dynamic-middlewares'

import { configureStore } from './configure-store'
import { reloadState } from './reload-state'
import { createAttach } from './create-attach'
import { createDetach } from './create-detach'

const emptyMiddleware = () => next => action => next(action)
const emptyReducer = (state = {}) => state

const createInstance = ({
  name = 'redux-dynamic',
  key = '__EMPTY__',
  initial = {},
  thunk = {},
  reducer = emptyReducer,
  middleware = emptyMiddleware,
  withDevTools = true,
} = {}) => {
  const dynamicMiddlewares = createDynamicMiddlewares()
  const registry = {
    keys: {
      [key]: true,
    },
    reducers: {
      [key]: (state = initial, action) => reducer(state, action),
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
    reducer: emptyReducer,
    dynamicMiddlewares: dynamicMiddlewares.enhancer,
  })

  reloadState(registry, store, dynamicMiddlewares)

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
