import * as actions from './actions';
import * as constants from './constants';
import * as selectors from './selectors';
import middleware from './middleware';
import reducer from './reducer';
import Container from './container';

const thunk = {
    requestApi: () => new Promise(res => setTimeout(res, 2000))
};

const key = constants.STORE_KEY;

export {
    key,
    actions,
    constants,
    middleware,
    reducer,
    selectors,
    thunk,
    Container
};
