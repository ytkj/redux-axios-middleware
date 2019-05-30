import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import thunkMiddleware, { ThunkAction, ThunkDispatch }  from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, Action, Store } from 'redux';
import { AxiosError } from 'axios';
import update from 'immutability-helper';

import { raAction, createRAMiddleware, RAAction } from '..';
import { axios, URL_APP_ERROR, URL_NET_ERROR, URL_SUCCESS } from './mock';

class State {
    public log: string ='';
    public errorMessage: string;
    public message: string;
}

const LOG: 'LOG' = 'LOG';
interface Log extends Action<typeof LOG> {
    payload: string;
}
function log(s: string): Log {
    return {
        type: LOG,
        payload: s,
    };
}

const HANDLE_ERROR: 'HANDLE_ERROR' = 'HANDLE_ERROR';
interface HandleError extends Action<typeof HANDLE_ERROR> {
    payload?: string;
}
function handleError(e: AxiosError): HandleError {
    return {
        type: HANDLE_ERROR,
        payload: e.response.data,
    };
}

const FETCH_MESSAGE: 'FETCH_MESSAGE' = 'FETCH_MESSAGE';
interface FetchMessage extends Action<typeof FETCH_MESSAGE> {
    payload: string;
}

function fetchMessage(
    url: string
): ThunkAction<Promise<RAAction>, State, void, RAAction|FetchMessage> {

    let thunkAction = async(
        dispatch: ThunkDispatch<State, void, RAAction|FetchMessage>,
        getState: () => State
    ): Promise<RAAction> => {

        return dispatch(raAction({
            url: url,
            method: 'GET',
            successActionType: FETCH_MESSAGE,
            successChainAction: log('chain-action;'),
            successChainActionCreator: log,
        }));
    }

    return thunkAction;
}

function reducer(
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

let store: Store<State>;

describe('basic usage', function() {
    
    beforeEach(function() {
        const raMiddleware = createRAMiddleware({
            actionBeforeFetch: log('ajax:start;'),
            actionAfterFetch: log('ajax:finish;'),
            actionCreatorOnFail: handleError,
            axiosClient: axios,
        });
        store = createStore(reducer, applyMiddleware(thunkMiddleware, raMiddleware));
    });

    describe('ajax success', function() {

        beforeEach(function(done) {
            store.dispatch(fetchMessage(URL_SUCCESS) as any);
            setTimeout(() => {
                done();
            }, 1);
        });

        it('actionBeforeFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:start;');
        });

        it('actionAfterFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:finish;');
        });

        it('successActionType', function() {
            let s = store.getState();
            expect(s.message).to.equal('Hello World');
        });

        it('successChainAction', function() {
            let s = store.getState();
            expect(s.log).to.have.string('chain-action');
        });

        it('successChainActionCreator', function() {
            let s = store.getState();
            expect(s.log).to.have.string('Hello World');
        });
    });

    describe('ajax fail', function() {

        beforeEach(function(done) {
            store.dispatch(fetchMessage(URL_APP_ERROR) as any);
            setTimeout(() => {
                done();
            }, 1);    
        });

        it('actionBeforeFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:start;');
        });

        it('actionAfterFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:finish;');
        });

        it('actionCreatorOnFail', function() {
            let s = store.getState();
            expect(s.errorMessage).to.equal('Fail to Hello World');
        });
    });

});