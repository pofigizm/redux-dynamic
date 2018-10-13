import { ACTIONS } from './constants';

const { INIT, CHANGE } = ACTIONS;

const change = (payload = {}) => {
    return {
        type: CHANGE,
        payload
    };
};

export const init = (props) => async (dispatch, getState, { requestOneApi }) => {
    await dispatch(change(props));
    await requestOneApi();

    return dispatch({ type: INIT });
};
