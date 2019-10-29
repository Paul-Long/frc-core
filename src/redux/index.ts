import createSagaMiddleware from 'redux-saga';
import {Base64} from 'js-base64';
import createStore from './createStore';
import {reducerBuilder} from './reducerBuilder';
import {sagaBuilder} from './sagaBuilder';
import {CreateOptions, ModelApi, AppApi} from '../types';

const cSagaMiddleware = createSagaMiddleware;
export const _models_ = Symbol('_models_');
export type ReduxApp = AppApi & {
  [_models_]: Array<ModelApi | Array<ModelApi>>;
  rStart: (app: ReduxApp) => void;
};

export default function create(createOpts: CreateOptions) {
  const {
    setupApp,
    // onError: onErr,
    onEffect,
    onFetchOption,
    onReducer,
    history
  } = createOpts;
  const app: ReduxApp = {
    [_models_]: [],
    model,
    models,
    rStart
  };
  function model(model: ModelApi | Array<ModelApi>) {
    app[_models_] = [...app[_models_], model];
  }

  function models(models: Array<ModelApi | Array<ModelApi>>) {
    app[_models_] = [...app[_models_], ...models];
  }

  function rStart(app: ReduxApp) {
    const sagaMiddleware = cSagaMiddleware();
    let initialState = {};
    if ((window as any).__INITIAL_STATE__) {
      try {
        initialState =
          JSON.parse(Base64.decode((window as any).__INITIAL_STATE__)) || {};
      } catch (e) {
        console.error('parse window initial state error -> ', e);
      }
    }
    app.store = createStore({
      reducers: reducerBuilder(app[_models_], onReducer),
      initialState,
      sagaMiddleware
    });

    (app.store as any).runSaga = sagaMiddleware.run;
    const sagas = sagaBuilder(app[_models_], {
      onEffect,
      onFetchOption,
      history
    });
    sagaMiddleware.run(sagas);
    setupApp(app);
  }

  return app;
}
