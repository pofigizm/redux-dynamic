/* eslint-disable no-console */
import { createInstance } from './index'

const reducer = (state = {}, action) => {
  if (action.type === 'foo') return { foo: 'bar' }
  return state
}

test('reduxDynamic one module', () => {
  console.error = jest.fn()

  const dynamicStore = createInstance({ key: 'key', reducer })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ key: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ key: { foo: 'bar' } })
})

test('reduxDynamic attach and detach module', () => {
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

test('reduxDynamic attach same key', () => {
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

test('reduxDynamic initials', () => {
  const initial = { foo: 'bar' }

  const dynamicStore = createInstance({ key: 'one', initial })
  dynamicStore.attach({ key: 'two', initial })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ one: { foo: 'bar' }, two: { foo: 'bar' } })

  dynamicStore.detach({ key: 'two' })
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })
})

test('reduxDynamic thunks', () => {
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

test('reduxDynamic middlewares', () => {
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
