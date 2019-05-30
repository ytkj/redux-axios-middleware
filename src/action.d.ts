import { Action } from 'redux';
import { AxiosRequestConfig } from 'axios';
import { ThunkAction } from 'redux-thunk';
export declare const RA_ACTION: '@@redux-axios-action/REDUX_AXIOS_ACTION';
export interface RAAction extends Action<typeof RA_ACTION>, RAActionPayload {
}
declare type TAction = ThunkAction<Promise<any>, any, void, any>;
interface RAActionPayload {
    url: string;
    method: 'GET' | 'POST' | 'PUT';
    successActionType: any;
    requestBody?: any;
    requestConfig?: AxiosRequestConfig;
    successChainAction?: Action | TAction | Action[] | TAction[];
    successChainActionCreator?: (payload: RAActionPayload) => Action | TAction;
}
export declare function raAction(payload: RAActionPayload): RAAction;
export declare function isRAAction(action: Action<any>): action is RAAction;
export {};
