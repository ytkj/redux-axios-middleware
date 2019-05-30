import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
export const URL_SUCCESS: string = '/api/success';
export const URL_APP_ERROR: string = '/api/fail';
export const URL_NET_ERROR: string = '/api/err';

mock.onGet(URL_SUCCESS).reply(200, 'Hello World');
mock.onGet(URL_APP_ERROR).reply(500, 'Fail to Hello World');
mock.onGet(URL_NET_ERROR).networkError();

export { axios };