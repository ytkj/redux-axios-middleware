import { Middleware, Action } from 'redux';
import { AxiosError, AxiosInstance } from 'axios';
export interface CreateRAMiddlewareOptions {
    actionBeforeFetch?: Action<any>;
    actionAfterFetch?: Action<any>;
    actionOnFail?: Action<any>;
    actionCreatorOnFail?: (e: AxiosError) => Action<any>;
    axiosClient?: AxiosInstance;
}
export declare const createRAMiddleware: (option: CreateRAMiddlewareOptions) => Middleware;
