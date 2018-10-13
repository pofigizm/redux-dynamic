import { ACTIONS } from './constants';

const { INIT, CHANGE } = ACTIONS;

const initialState = {
    loading: true
};

const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case INIT: {
            return {
                ...state,
                loading: false
            };
        }

        case CHANGE: {
            return {
                ...state,
                ...action.payload
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
export {
    initialState
};
