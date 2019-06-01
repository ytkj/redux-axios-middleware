import { Middleware, Action, Dispatch } from 'redux';
import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';

import { isRAAction } from './action';

type ACOF = (e: AxiosError) => Action;

export interface CreateRAMiddlewareOptions {
    actionBeforeFetch?: Action|Action[];
    actionAfterFetch?: Action|Action[];
    actionOnFail?: Action|Action[];
    actionCreatorOnFail?: ACOF|ACOF[];
    axiosClient?: AxiosInstance;
}

const superNext = (actionOrArray: Action|Action[], next: Dispatch): void => {
    if (Array.isArray(actionOrArray)) {
        actionOrArray.forEach(a => next(a));
    } else {
        next(actionOrArray);
    }
};

export const createRAMiddleware: (option: CreateRAMiddlewareOptions) => Middleware = option => store => next => async (action: Action<any>) => {

    if (isRAAction(action)) {
        
        // show loading before ajax
        if (option.actionBeforeFetch) {
            superNext(option.actionBeforeFetch, next);
        }

        // ajax
        let res: AxiosResponse<any>;
        let axiosClient = option.axiosClient || axios;
        try {
            if (action.method === 'GET') {
                res = await axiosClient.get(action.url, action.requestConfig);
            } else if (action.method === 'POST') {
                res = await axiosClient.post(action.url, action.requestBody, action.requestConfig);
            } else {
                res = await axiosClient.put(action.url, action.requestBody, action.requestConfig);
            }

            // ajax success: dispatch action and hide loading
            next({
                type: action.successActionType,
                payload: res.data,
            });

            if (option.actionAfterFetch) {
                superNext(option.actionAfterFetch, next);
            }

            if (action.successChainAction) {
                if (Array.isArray(action.successChainAction)) {
                    (action.successChainAction as Action[]).forEach(a => store.dispatch(a));
                } else {
                    store.dispatch(action.successChainAction as Action);
                }
            }

            if (action.successChainActionCreator) {
                if (Array.isArray(action.successChainActionCreator)) {
                    action.successChainActionCreator.forEach(ac => {
                        store.dispatch(ac(res.data) as Action);
                    });
                } else {
                    store.dispatch(action.successChainActionCreator(res.data) as Action);
                }
            }

        } catch(e) {

            // ajax error

            if (option.actionAfterFetch) {
                superNext(option.actionAfterFetch, next);
            }
            if (option.actionOnFail) {
                superNext(option.actionOnFail, next);
            }
            if (option.actionCreatorOnFail) {
                if (Array.isArray(option.actionCreatorOnFail)) {
                    option.actionCreatorOnFail.forEach(ac => next(ac(e)));
                } else {
                    next(option.actionCreatorOnFail(e));
                }
            }
        }
    } else {

        // do nothing
        return next(action);
    }
};