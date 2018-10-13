import { combineReducers } from 'redux'
import { createDynamicMiddlewares } from 'redux-dynamic-middlewares'
import thunkMiddleware from 'redux-thunk'

import { configureStore } from './configure-store'
import { createAttach } from './create-attach'

const emptyReducers = {
  reduxDynamic: (state = {}) => state,
}

const createInstance = ({
  initialState = {},
  reducers = emptyReducers,
  thunkConfig = {},
} = {}) => {
  const data = { reducers, thunkConfig }

  const dynamicMiddlewaresInstance = createDynamicMiddlewares()
  const store = configureStore(
    initialState,
    combineReducers(data.reducers),
    dynamicMiddlewaresInstance.enhancer
  )

  data.thunk = thunkMiddleware.withExtraArgument(data.thunkConfig)
  dynamicMiddlewaresInstance.addMiddleware(data.thunk)

  const getStore = () => store

  const attach = createAttach(data, store, dynamicMiddlewaresInstance)

  const detach = () => {
    // eslint-disable-next-line no-console
    console.log('under construction')
  }

  return {
    getStore,
    attach,
    detach,
  }
}

export {
  createInstance,
}
