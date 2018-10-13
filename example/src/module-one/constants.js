import { prepareActions } from 'redux-dynamic';

export const STORE_KEY = 'moduleOne';
export const ACTIONS = prepareActions([
    'INIT',
    'CHANGE'
], STORE_KEY /* or __dirname */);
