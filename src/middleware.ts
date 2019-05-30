import { Middleware, Action } from 'redux';
import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';

import { isRAAction } from './action';

export interface CreateRAMiddlewareOptions {
    actionBeforeFetch?: Action<any>;
    actionAfterFetch?: Action<any>;
    actionOnFail?: Action<any>;
    actionCreatorOnFail?: (e: AxiosError) => Action<any>
    axiosClient?: AxiosInstance;
}

export const createRAMiddleware: (option: CreateRAMiddlewareOptions) => Middleware = option => store => next => async (action: Action<any>) => {

    if (isRAAction(action)) {
        
        // show loading before ajax
        if (option.actionBeforeFetch) {
            next(option.actionBeforeFetch);
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
                next(option.actionAfterFetch);
            }

            if (action.successChainAction) {
                if (Array.isArray(action.successChainAction)) {
                    (action.successChainAction as Action[]).forEach(a => store.dispatch(a));
                } else {
                    store.dispatch(action.successChainAction as Action);
                }
            }

            if (action.successChainActionCreator) {
                store.dispatch(action.successChainActionCreator(res.data) as Action);
            }

        } catch(e) {

            // ajax error

            if (option.actionAfterFetch) {
                next(option.actionAfterFetch);
            }
            if (option.actionOnFail) {
                next(option.actionOnFail);
            } else if (option.actionCreatorOnFail) {
                next(option.actionCreatorOnFail(e));
            }
        }
    } else {

        // do nothing
        return next(action);
    }
};