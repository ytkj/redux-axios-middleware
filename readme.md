# Redux Axios Middleware

This repository is related to npm package [@ytkj/redux-axios-middleware](https://www.npmjs.com/package/@ytkj/redux-axios-middleware).

## Installation

`npm install -S @ytkj/redux-axios-middleware`

## Usage

1. Create your `store` applying `raMiddleware` with `thunkMiddleware`.
    ```typescript
    import { createStore, applyMiddleware } from 'redux';
    import thunkMiddleware from 'redux-thunk';
    import { AxiosError } from 'axios';

    import { raAction, createRAMiddleware, RAAction } from '@ytkj/redux-axios-middleware';

    const raMiddleware = createRAMiddleware({
        actionBeforeFetch: { type: 'FOO_ACTION'},
        actionAfterFetch: { type: 'BAR_ACTION'},
        actionCreatorOnFail: (e: AxiosError) => ({type: 'ERROR', payload: e.response.data}),
    });
    store = createStore(reducer, applyMiddleware(thunkMiddleware, raMiddleware));
    ```
2. dispatch `raAction` from inside your `ThunkAction`.
    ```typescript
    import { ThunkAction, ThunkDispatch }  from 'redux-thunk';

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
            }));
        }

        return thunkAction;
    }

    store.dispatch(fetchMessage('/api/hello/world'));
    ```

## API

### `createRAMiddleware()`

`middleware` factory function.

#### arguments

|type|description|
|---|---|
|`CreateRAMiddlewareOption`|1st argument

#### return

|type|description|
|---|---|
|`RAMiddleware`|created raMiddleware|


### `CreateRAMiddlewareOption`

|property|type|description|
|---|---|---|
|`actionBeforeFetch?`|[`Action\|Action[]`](https://redux.js.org/basics/actions)|`action` that should be dispatched before sending Ajax request.|
|`actionAfterFetch?`|[`Action\|Action[]`](https://redux.js.org/basics/actions)|`action` that should be dispatched after receiving Ajax response, whether success or fail.|
|`actionCreatorOnFail?`|`(e: AxiosError) => Action \| Array<(e: AxiosError) => Action>`|function that shold be called after receiving failure response. [`AxiosError`](https://github.com/axios/axios/blob/master/index.d.ts#L79) object will be passed to this function.|
|`axiosClient?`|[`AxiosInstance`](https://github.com/axios/axios#axios-api)|`axios` instance that shold be used to call Ajax request; default to `axios` global object.|

### `raAction()`

`action creator` for `RAAction`.

#### argument

|type|description|
|---|---|
|`RAActionPayload`|1st argument.|

#### return

|type|description|
|---|---|
|`RAAction`|dispatched and will trigger some events in `raMiddleware`|

### `RAActionPayload`

|property|type|description|
|---|---|---|
|`url`|`string`|request URL.|
|`method`|`'GET'\|'POST'\|'PUT'`|requst HTTP method.|
|`successActionType`|`any`|`action.type` string.|
|`requestBody?`|`any`|request body (only for `'POST'` and `'PUT'`).|
|`requestConfig?`|[`AxiosRequestConfig`](https://github.com/axios/axios#request-config)|request config for `axios`.|
|`successChainAction?`|`Action\|TunkAction\|Action[]\|ThunkAction[]`|`action` that shold be dispatced after receiving Ajax response only if succeed.|
|`successChainActionCreator?`|`ActionCreator<Action\|ThunkAction> \| Array<ActionCreator<Action>|ActionCreator<TunkAction>>`|`action creator` that shold be dispatched after receiving Ajax response only if succeed. response content(`res.data`) will be passed as argument.|


