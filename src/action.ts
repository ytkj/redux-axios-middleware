import { Action, ActionCreator } from 'redux';
import { AxiosRequestConfig } from 'axios';
import { ThunkAction } from 'redux-thunk';

export const RA_ACTION: '@@redux-axios-action/REDUX_AXIOS_ACTION' = '@@redux-axios-action/REDUX_AXIOS_ACTION';

export interface RAAction extends Action<typeof RA_ACTION>, RAActionPayload {

}

type TAction = ThunkAction<Promise<any>, any, void, any>;

interface RAActionPayload {
    url: string;
    method: 'GET' | 'POST' | 'PUT';
    successActionType: any;
    requestBody?: any;
    requestConfig?: AxiosRequestConfig;
    successChainAction?: Action | TAction | Array<Action|TAction>;
    successChainActionCreator?: ActionCreator<Action|TAction> | Array<ActionCreator<Action>|ActionCreator<TAction>>
}

export function raAction(payload: RAActionPayload): RAAction {

    return {
        type: RA_ACTION,
        ...payload,
    }
}

export function isRAAction(action: Action<any>): action is RAAction {
    return action.type === RA_ACTION;
}
