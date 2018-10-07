import { applyMiddleware, createStore } from 'redux'

const reducer = (state = {}, action) => {
  if (action.type === 'foo') return { foo: 'bar' }
  return state
}

test('redux should work without error', () => {
  // eslint-disable-next-line no-console
  console.error = jest.fn()
  const store = createStore(reducer, applyMiddleware())
  expect(store.getState()).toEqual({})
  store.dispatch({ type: 'foo' })
  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ foo: 'bar' })
})
