const middleware = () => next => action => {
    return next(action);
};

export default middleware;
