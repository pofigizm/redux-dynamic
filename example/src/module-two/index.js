import * as actions from './actions';
import * as constants from './constants';
import * as selectors from './selectors';
import middleware from './middleware';
import reducer, { initialState as state } from './reducer';
import Container from './container';

const reducers = {
    [constants.STORE_KEY]: reducer
};

const initialState = {
    [constants.STORE_KEY]: {
        ...state,
        someParam: true
    }
}

const thunkConfig = {
    requestTwoApi: () => new Promise(res => setTimeout(res, 2000))
};

export {
    initialState,
    actions,
    constants,
    middleware,
    reducers,
    selectors,
    thunkConfig,
    Container
};
