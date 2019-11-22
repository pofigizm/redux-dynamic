/* eslint-disable no-console */
import { createInstanceFlat } from './index'

const reducer = (state = {}, action) => {
  if (action.type === 'foo') return { ...state, foo: 'bar' }
  return state
}

const complexReducer = {
  reducers: {
    one: reducer,
  },
}

test('flat - without params', () => {
  console.error = jest.fn()

  const dynamicStore = createInstanceFlat()

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ __EMPTY__: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
})

test('flat - one module with simple reducer', () => {
  console.error = jest.fn()

  const dynamicStore = createInstanceFlat({ key: 'key', reducer })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ key: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ key: { foo: 'bar' } })
})

test('flat - one module with complex reducer', () => {
  console.error = jest.fn()

  const dynamicStore = createInstanceFlat({ key: 'key', reducer: complexReducer })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ one: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })
})

test('flat - attach and detach module', () => {
  console.error = jest.fn()

  const dynamicStore = createInstanceFlat({ key: 'key', reducer: complexReducer })
  dynamicStore.attach({ key: 'two', reducer })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ one: {}, two: {} })

  store.dispatch({ type: 'foo' })
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ one: { foo: 'bar' }, two: { foo: 'bar' } })

  dynamicStore.detach({ key: 'two' })
  expect(store.getState()).toEqual({ one: { foo: 'bar' } })
})

test('flat - initials', () => {
  const initial = { one: 'bar' }
  const initial2 = { foo: 'bar' }

  const dynamicStore = createInstanceFlat({ key: 'key', initial, reducer: complexReducer })
  dynamicStore.attach({ key: 'two', initial: initial2 })

  const store = dynamicStore.getStore()
  expect(store.getState()).toEqual({ one: 'bar', two: { foo: 'bar' } })

  dynamicStore.detach({ key: 'two' })
  expect(store.getState()).toEqual({ one: 'bar' })
})
