import * as actions from './actions';
import * as constants from './constants';
import * as selectors from './selectors';
import middleware from './middleware';
import reducer from './reducer';
import Container from './container';

const reducers = {
    [constants.STORE_KEY]: reducer
};

const thunkConfig = {
    requestTwoApi: () => new Promise(res => setTimeout(res, 2000))
};

export {
    actions,
    constants,
    middleware,
    reducers,
    selectors,
    thunkConfig,
    Container
};
