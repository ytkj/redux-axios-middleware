import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, Store } from 'redux';

import { createRAMiddleware } from '..';
import { axios, URL_APP_ERROR, URL_NET_ERROR, URL_SUCCESS } from './mock';
import { State, log, fetchMessage, handleError, reducer} from './stub';


let store: Store<State>;

describe('basic usage', function() {
    
    beforeEach(function() {
        const raMiddleware = createRAMiddleware({
            actionBeforeFetch: log('ajax:start;'),
            actionAfterFetch: log('ajax:finish;'),
            actionOnFail: log('ajax:fail;'),
            actionCreatorOnFail: handleError,
            axiosClient: axios,
        });
        store = createStore(reducer, applyMiddleware(thunkMiddleware, raMiddleware));
    });

    describe('ajax success', function() {

        beforeEach(function(done) {
            store.dispatch(fetchMessage(URL_SUCCESS, log('chain-action;'), log) as any);
            setTimeout(() => {
                done();
            }, 10);
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
            store.dispatch(fetchMessage(URL_APP_ERROR, log('chain-action;'), log) as any);
            setTimeout(() => {
                done();
            }, 10);
        });

        it('actionBeforeFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:start;');
        });

        it('actionAfterFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:finish;');
        });

        it('actionOnFail', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:fail;');
        });

        it('actionCreatorOnFail', function() {
            let s = store.getState();
            expect(s.errorMessage).to.equal('Fail to Hello World');
        });
    });

});

describe('array options', function() {

    beforeEach(function() {
        const raMiddleware = createRAMiddleware({
            actionBeforeFetch: [log('ajax:start;'), log('ajax:start2;')],
            actionAfterFetch: [log('ajax:finish;'), log('ajax:finish2;')],
            actionOnFail: [log('ajax:fail;'), log('ajax:fail2;')],
            actionCreatorOnFail: [handleError, e => log(`error:${e.response.data};`)],
            axiosClient: axios,
        });
        store = createStore(reducer, applyMiddleware(thunkMiddleware, raMiddleware));
    });

    describe('ajax success', function() {

        beforeEach(function(done) {
            let ac = (m: string) => log(`${m}2`);
            store.dispatch(fetchMessage(URL_SUCCESS, [log('chain-action;'), log('chain-action2;')], [log, ac]) as any);
            setTimeout(() => {
                done();
            }, 10);
        });

        it('actionBeforeFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:start;');
            expect(s.log).to.have.string('ajax:start2;');
        });

        it('actionAfterFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:finish;');
            expect(s.log).to.have.string('ajax:finish2;');
        });

        it('successChainAction', function() {
            let s = store.getState();
            expect(s.log).to.have.string('chain-action;');
            expect(s.log).to.have.string('chain-action2;');
        });

        it('successChainActionCreator', function() {
            let s = store.getState();
            expect(s.log).to.have.string('Hello World');
            expect(s.log).to.have.string('Hello World2');
        });

    });

    describe('ajax fail', function() {

        beforeEach(function(done) {
            let ac = (m: string) => log(`${m}2`);
            store.dispatch(fetchMessage(URL_APP_ERROR, [log('chain-action;'), log('chain-action2;')], [log, ac]) as any);
            setTimeout(() => {
                done();
            }, 10);
        });

        it('actionBeforeFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:start;');
            expect(s.log).to.have.string('ajax:start2;');
        });

        it('actionAfterFetch', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:finish;');
            expect(s.log).to.have.string('ajax:finish2;');
        });

        it('actionOnFail', function() {
            let s = store.getState();
            expect(s.log).to.have.string('ajax:fail;');
            expect(s.log).to.have.string('ajax:fail2;');
        });

        it('actionCreatorOnFail', function() {
            let s = store.getState();
            expect(s.errorMessage).to.equal('Fail to Hello World');
            expect(s.log).to.have.string('error:Fail to Hello World;');
        });

    });

});