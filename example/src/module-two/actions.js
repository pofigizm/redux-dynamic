import { ACTIONS } from './constants';

const { INIT, CHANGE } = ACTIONS;

const change = (payload = {}) => {
    return {
        type: CHANGE,
        payload
    };
};

export const init = (props) => async (dispatch, getState, { requestTwoApi }) => {
    await dispatch(change(props));
    await requestTwoApi();

    return dispatch({ type: INIT });
};
