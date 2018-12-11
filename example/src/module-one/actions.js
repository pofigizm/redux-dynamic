import { ACTIONS } from './constants';

const { INIT, CHANGE } = ACTIONS;

const change = (payload = {}) => {
    return {
        type: CHANGE,
        payload
    };
};

export const init = (props) => async (dispatch, getState, { moduleOne }) => {
    await dispatch(change(props));
    await moduleOne.requestApi();

    return dispatch({ type: INIT });
};
