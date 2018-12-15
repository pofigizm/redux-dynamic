/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { reloadState } from './reload-state'

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

  reloadState(registry, store, dynamicMiddlewares)
  delete state[key]

  return true
}

export {
  createDetach,
}
