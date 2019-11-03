import thunkMiddleware from 'redux-thunk'

const reloadState = (registry, store, dynamicMiddlewares) => {
  store.replaceReducer(registry.reducerWrapper(registry.reducers))
  dynamicMiddlewares.resetMiddlewares()

  const thunkObject = thunkMiddleware.withExtraArgument(registry.thunks)
  dynamicMiddlewares.addMiddleware(thunkObject)

  Object.keys(registry.middlewares)
    .forEach((key) => {
      const wrapper = st => next => (action) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!registry.keys.hasOwnProperty(key)) {
          return next(action)
        }

        return registry.middlewares[key](st)(next)(action)
      }
      dynamicMiddlewares.addMiddleware(wrapper)
    })
}

export {
  reloadState,
}
