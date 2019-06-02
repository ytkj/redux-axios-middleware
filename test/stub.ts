import { ThunkAction, ThunkDispatch }  from 'redux-thunk';
import { Action, ActionCreator } from 'redux';
import { AxiosError } from 'axios';
import update from 'immutability-helper';

import { raAction, RAAction } from '..';


export class State {
    public log: string ='';
    public errorMessage: string;
    public message: string;
}

export const LOG: 'LOG' = 'LOG';
export interface Log extends Action<typeof LOG> {
    payload: string;
}
export function log(s: string): Log {
    return {
        type: LOG,
        payload: s,
    };
}

export const HANDLE_ERROR: 'HANDLE_ERROR' = 'HANDLE_ERROR';
export interface HandleError extends Action<typeof HANDLE_ERROR> {
    payload?: string;
}
export function handleError(e: AxiosError): HandleError {
    return {
        type: HANDLE_ERROR,
        payload: e.response.data,
    };
}

export const FETCH_MESSAGE: 'FETCH_MESSAGE' = 'FETCH_MESSAGE';
export interface FetchMessage extends Action<typeof FETCH_MESSAGE> {
    payload: string;
}

export function fetchMessage(
    url: string,
    chainAction: Action|Action[],
    chainActionCreator: ActionCreator<Action>|Array<ActionCreator<Action>>
): ThunkAction<Promise<RAAction>, State, void, RAAction|FetchMessage> {

    let thunkAction = async(
        dispatch: ThunkDispatch<State, void, RAAction|FetchMessage>,
        getState: () => State
    ): Promise<RAAction> => {

        return dispatch(raAction({
            url: url,
            method: 'GET',
            successActionType: FETCH_MESSAGE,
            successChainAction: chainAction,
            successChainActionCreator: chainActionCreator,
        }));
    }

    return thunkAction;
}

export function reducer(
    state: State = new State(),
    action: Log|HandleError|FetchMessage
) {
    if (!action) return state;
    switch (action.type) {
        case LOG:
            return update<State>(state, {
                log: {$set: state.log + action.payload},
            });
        case HANDLE_ERROR:
            return update<State>(state, {
                errorMessage: {$set: action.payload},
            });
        case FETCH_MESSAGE:
            return update<State>(state, {
                message: {$set: action.payload},
            });
        default:
            return state;
    }
}
