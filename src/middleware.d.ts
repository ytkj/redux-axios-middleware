import { Middleware, Action } from 'redux';
import { AxiosError, AxiosInstance } from 'axios';
declare type ACOF = (e: AxiosError) => Action;
export interface CreateRAMiddlewareOptions {
    actionBeforeFetch?: Action | Action[];
    actionAfterFetch?: Action | Action[];
    actionOnFail?: Action | Action[];
    actionCreatorOnFail?: ACOF | ACOF[];
    axiosClient?: AxiosInstance;
}
export declare const createRAMiddleware: (option: CreateRAMiddlewareOptions) => Middleware;
export {};
