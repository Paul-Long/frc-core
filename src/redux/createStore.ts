import {applyMiddleware, compose, createStore} from 'redux';

export default function(opts: any = {}) {
  const {reducers, initialState, sagaMiddleware} = opts;
  let devTools = (p: any) => (noop: any) => noop;
  if (
    process.env.NODE_ENV !== 'production' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
  ) {
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  }
  const middlewares = [sagaMiddleware];
  const option: any = (window as any).__REDUX_DEVTOOLS_EXTENSION__OPTIONS;
  const enhancers = [applyMiddleware(...middlewares), devTools(option)];
  return createStore(reducers, initialState, compose(...enhancers));
}
