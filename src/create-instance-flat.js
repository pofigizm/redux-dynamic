import { createDynamicMiddlewares } from 'redux-dynamic-middlewares'
import { combineReducers } from 'redux';

import { configureStore } from './configure-store'
import { reloadState } from './reload-state'
import { createAttach } from './create-attach'
import { createDetach } from './create-detach'

const emptyMiddleware = () => next => action => next(action)
const emptyReducer = (state = {}) => state

const createInstanceFlat = ({
  name = 'redux-dynamic',
  key = '__EMPTY__',
  initial = {},
  thunk = {},
  reducer = emptyReducer,
  middleware = emptyMiddleware,
  withDevTools,
  devToolsOptions,
} = {}) => {
  const dynamicMiddlewares = createDynamicMiddlewares()
  const reducerWrapper = reducer.wrapper ? reducer.wrapper : combineReducers
  const reducerInitial = reducer.wrapper ? reducer.wrapper(reducer.reducers) : emptyReducer
  const reducers = reducer.reducers ? { ...reducer.reducers } : { [key]: (state = initial, action) => reducer(state, action) }

  dynamicMiddlewares.addMiddleware(middleware)

  const registry = {
    keys: {
      [key]: true,
    },
    reducers,
    reducerWrapper,
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
    devToolsOptions,
    key,
    initial,
    reducer: reducerInitial,
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
  createInstanceFlat,
}
