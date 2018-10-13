import { combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

const createAttach = (data, store, dynamicMiddlewares) => ({
  reducers = {},
  thunkConfig = {},
  middleware,
}) => {
  const nextReducers = { ...data.reducers, ...reducers }
  store.replaceReducer(combineReducers(nextReducers))

  const nextThunkConfig = { ...data.thunkConfig, ...thunkConfig }
  dynamicMiddlewares.removeMiddleware(data.thunk)
  const nextThunk = thunkMiddleware.withExtraArgument(nextThunkConfig)
  dynamicMiddlewares.addMiddleware(nextThunk)

  if (middleware) {
    dynamicMiddlewares.addMiddleware(middleware)
  }

  /* eslint-disable no-param-reassign */
  data.reducers = nextReducers
  data.thunkConfig = nextThunkConfig
  data.thunk = nextThunk
  /* eslint-enable no-param-reassign */
}

export {
  createAttach,
}
