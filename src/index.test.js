/* eslint-disable no-console */
import { createInstance } from './index'

const reducer = (state = {}, action) => {
  if (action.type === 'foo') return { ...state, foo: 'bar' }
  return state
}

test('without params', () => {
  console.error = jest.fn()

  const dynamicStore = createInstance()

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ __EMPTY__: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
})

test('one module', () => {
  console.error = jest.fn()

  const dynamicStore = createInstance({ key: 'key', reducer })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ key: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ key: { foo: 'bar' } })
})

test('attach and detach module', () => {
  console.error = jest.fn()

  const dynamicStore = createInstance({ key: 'one', reducer })
  dynamicStore.attach({ key: 'two', reducer })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ one: {}, two: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ one: { foo: 'bar' }, two: { foo: 'bar' } })

  dynamicStore.detach({ key: 'two' })
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })
})

test('attach same key', () => {
  console.error = jest.fn()

  const dynamicStore = createInstance({ key: 'one', reducer })
  const store = dynamicStore.getStore()

  dynamicStore.attach({ reducer })
  expect(console.error.mock.calls.length).toBe(1)
  store.dispatch({ type: 'foo' })
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })

  dynamicStore.attach({ key: 'one', reducer })
  expect(console.error.mock.calls.length).toBe(2)
  store.dispatch({ type: 'foo' })
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })
})

test('initials', () => {
  const initial = { foo: 'bar' }

  const dynamicStore = createInstance({ key: 'one', initial })
  dynamicStore.attach({ key: 'two', initial })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ one: { foo: 'bar' }, two: { foo: 'bar' } })

  dynamicStore.detach({ key: 'two' })
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })
})

test('thunks', () => {
  const thunk = { foo: 'bar' }

  const dynamicStore = createInstance({ key: 'one', thunk })
  dynamicStore.attach({ key: 'two', thunk })

  const store = dynamicStore.getStore()
  store.dispatch((dispatch, getState, thunkObject) => {
    expect(thunkObject).toEqual({ one: { foo: 'bar' }, two: { foo: 'bar' } })
  })

  dynamicStore.detach({ key: 'two' })
  store.dispatch((dispatch, getState, thunkObject) => {
    expect(thunkObject).toEqual({ one: { foo: 'bar' } })
  })
})

test('middlewares', () => {
  const fx = jest.fn()
  const middleware = () => next => (action) => {
    fx()
    expect(action).toEqual({ type: 'foo' })
    next(action)
  }

  const dynamicStore = createInstance({ key: 'one', middleware })
  dynamicStore.attach({ key: 'two', middleware })

  const store = dynamicStore.getStore()
  store.dispatch({ type: 'foo' })
  expect(fx.mock.calls.length).toBe(2)

  dynamicStore.detach({ key: 'two' })
  store.dispatch({ type: 'foo' })
  expect(fx.mock.calls.length).toBe(3)
})

test('middlewares prevent previous call', () => {
  const fx = jest.fn()
  let dynamicStore

  const middlewareOne = () => next => (action) => {
    dynamicStore.detach({ key: 'two' })
    next(action)
  }

  const middlewareTwo = () => next => (action) => {
    fx()
    next(action)
  }

  dynamicStore = createInstance({ key: 'one', middleware: middlewareOne })
  dynamicStore.attach({ key: 'two', middleware: middlewareTwo })

  const store = dynamicStore.getStore()
  store.dispatch((dispatch) => {
    dispatch({ type: 'foo' })
  })
  expect(fx).not.toBeCalled()
})

test('remove previous state', () => {
  console.error = jest.fn()

  const dynamicStore = createInstance({ key: 'one', reducer })
  dynamicStore.attach({ key: 'two', reducer })

  const store = dynamicStore.getStore()
  store.dispatch({ type: 'foo' })

  dynamicStore.detach({ key: 'two' })
  dynamicStore.attach({ key: 'three', reducer })
  store.dispatch({ type: 'foo' })

  dynamicStore.detach({ key: 'three' })
  dynamicStore.attach({ key: 'two', reducer })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ one: { foo: 'bar' }, two: {} })
})
