export const prepareActions = (actions, directory) => {
  const prefix = directory
    .replace(/^node_modules\//, '')
    .replace(/\//g, '-')

  return actions.reduce((acc, action) => ({
    ...acc,
    [action]: `${prefix}-${action}`,
  }), {})
}
