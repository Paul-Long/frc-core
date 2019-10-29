import {History} from 'history';
import {AppApi} from '../types';
export const patchHistory = function(history: History) {
  const oldListen = history.listen;
  history.listen = (callback: any) => {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
};

export const isFunction = (o: any) => typeof o === 'function';
export const isString = (o: any) => typeof o === 'string';
export const isArray = Array.isArray.bind(Array);

export function isHTMLElement(node: any) {
  return (
    typeof node === 'object' && node !== null && node.nodeType && node.nodeName
  );
}

export const onError = (app: AppApi, onError: any) => {
  return (err: any) => {
    if (err) {
      if (typeof err === 'string') {
        err = new Error(err);
      }
      if (onError && typeof onError === 'function') {
        onError(err, (app as any).store.dispatch);
        throw new Error(err.stack || err);
      }
    }
  };
};
export const onEffect = () => {};
