import {effects} from 'redux-saga';
import {ModelApi, CreateOptions, PutAction} from '../types';
import Fetch from '../../fetch';
export function sagaBuilder(options: Array<any>, args: any) {
  const sagaArr: Array<any> = [];
  for (let index in options) {
    if (options.hasOwnProperty(index)) {
      let value = options[index];
      if (value instanceof Array) {
        for (let item of value) {
          if (item.url) {
            sagaArr.push(createSaga(item, args));
          }
        }
      } else {
        if (value && Object.prototype.hasOwnProperty.call(value, 'url')) {
          sagaArr.push(createSaga(value, args));
        }
      }
    }
  }
  return function*() {
    for (let saga of sagaArr) {
      yield effects.fork(saga);
    }
  };
}

function bodyHandler(data: any, type: string, method: string) {
  if (method === 'get') {
    return '';
  }
  if (method !== 'get' && data) {
    if (type === 'json') {
      return JSON.stringify(data);
    } else if (type === 'from') {
      let pairs = [];
      for (let key of data) {
        pairs.push(key + '=' + data[key]);
      }
      return pairs.join('&');
    }
  }
  return data;
}

function getEffect(item: ModelApi) {
  return function* baseEffect(action: object, args: object, e: any, i: any) {
    return yield fetch(
      (item as any).url((action as any).payload),
      (args as any).option
    );
  };
}

export function createSaga(item: ModelApi, options: CreateOptions) {
  const {onFetchOption, onEffect, history} = options;
  const action = item.action || item.key;
  return function*() {
    let take = item.takeEvery || effects.takeEvery;
    yield take(action, function*(actions: any) {
      let response;
      const effect = item.effect || getEffect(item);
      let putAction: PutAction = {
        type: action,
        payload: actions.payload
      };
      try {
        let type = item.type || 'json';
        let bodyParser = item.body || bodyHandler;
        let option = createOptions(
          (item as any).method,
          type,
          (item as any).headers,
          bodyParser(actions.payload, type, (item as any).method)
        );
        if (typeof onFetchOption === 'function') {
          option = onFetchOption(option, item);
        }
        response = yield effect(actions, {fetch: Fetch, option}, effects, item);
      } catch (error) {
        putAction.success = false;
        putAction.loading = false;
        putAction.result = null;
        putAction.message = error || '请求异常';
        putAction.type = `${putAction.type}_FAIl`;
        yield effects.put(putAction);
      }
      if (response) {
        if (typeof onEffect === 'function') {
          putAction.url = (item as any).url(actions.payload);
          putAction = yield onEffect(putAction, response, effects, history);
        } else {
          putAction.loading = false;
          putAction.success = response.status === 200;
          putAction.status = response.status;
          putAction.result = yield response.json();
        }
        putAction.type = `${putAction.type}${
          putAction.success ? '_SUCCESS' : '_FAIL'
        }`;
        yield effects.put(putAction);
      }
    });
  };
}

function createOptions(
  method: string,
  type: string,
  extHeaders: object,
  payload: any
) {
  let options: {headers?: object; body?: any; method: string} = {method};
  options.headers = extHeaders || {
    Accept: 'application/json',
    'Content-Type':
      type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded'
  };
  if (method !== 'get') {
    options.body = payload;
  }
  return options;
}
