import { ACTIONS } from './constants';

const { INIT, CHANGE } = ACTIONS;

const change = (payload = {}) => {
    return {
        type: CHANGE,
        payload
    };
};

export const init = (props) => async (dispatch, getState, { moduleTwo }) => {
    await dispatch(change(props));
    await moduleTwo.requestApi();

    return dispatch({ type: INIT });
};
