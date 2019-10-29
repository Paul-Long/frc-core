import {History} from 'history';
import {Store} from 'redux';

type ReducerHandle = (state: any, action: any) => any;
export interface ModelApi {
  key: string;
  action?: string;
  resultKey: string;
  single?: boolean;
  subKeys: Array<string>;
  initialState?: any;
  method?: string;
  url?: (payload: any) => string;
  loading?: ReducerHandle;
  success?: ReducerHandle;
  fail?: ReducerHandle;
  takeEvery?: any;
  effect?: (item: ModelApi) => any;
  headers?: object;
  payload?: any;
  body?: (p: any, t: string, method: string) => any;
  type?: string;
}
export enum HistoryType {
  HASH,
  BROWSER
}
export type PutAction = {
  type: string;
  payload: any;
  loading?: boolean;
  success?: boolean;
  status?: number;
  message?: string;
  result?: any;
  url?: string;
};
export type OnReducerApi = (ns: any, s: any, a: any, t: string) => any;
export type AppOptions = {
  onEffect?: (pa: PutAction, res: any, effects: any, history: History) => any;
  onFetchOption?: (e: any, item: any) => any;
  onReducer?: OnReducerApi;
  historyType?: HistoryType;
};
export type CreateOptions = AppOptions & {
  setupApp: (app: AppApi) => void;
  history: History;
};
export interface AppApi {
  model?: (model: ModelApi | Array<ModelApi>) => void;
  models?: (models: Array<ModelApi | Array<ModelApi>>) => void;
  start?: (container: string | Element | null) => void;
  store?: Store;
  router?: (router: (app: AppApi) => JSX.Element) => void;
  history?: History;
}
export const _router_ = Symbol('_router_');
