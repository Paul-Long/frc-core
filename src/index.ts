import ReactDOM from 'react-dom';
import {createBrowserHistory, createHashHistory} from 'history';
import invariant from 'invariant';
import {Store} from 'redux';
import {patchHistory, isFunction, isHTMLElement} from './utils';
import {AppOptions, HistoryType, CreateOptions, AppApi} from './types';
import create, {ReduxApp} from './redux';
import App from './App';

const defaultOpts = {
  historyType: HistoryType.BROWSER
};
export default function(opts: AppOptions = defaultOpts) {
  const {onEffect, onFetchOption, onReducer, historyType} = opts;
  let history: any;
  switch (historyType) {
    case HistoryType.HASH:
      history = createHashHistory();
      break;
    case HistoryType.BROWSER:
      history = createBrowserHistory();
      break;
    default:
      history = createBrowserHistory();
      break;
  }
  const options: CreateOptions = {
    setupApp(app: AppApi) {
      app.history = patchHistory(history);
    },
    onEffect,
    onFetchOption,
    onReducer,
    history
  };
  const app: AppApi & {
    rStart: (app: ReduxApp) => void;
    _router?: (app: AppApi) => JSX.Element;
  } = create(options);
  const appStart = app.rStart;
  app.router = router;
  app.start = start;
  return app;

  function render(container: Element | null, store: Store, app: AppApi) {
    ReactDOM.render(App(app), container);
  }

  function start(container: string | Element | null) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
      invariant(container, `[app.start] container ${container} not found`);
    }
    invariant(
      !container || isHTMLElement(container),
      `[app.start] container should be HTMLElement`
    );
    invariant(
      app._router,
      `[app.router] router must be registered before app.start()`
    );

    if (!(app as any).store) {
      appStart(app as any);
    }

    const store: Store = (app as any).store;

    if (container) {
      return render(container, store, app);
    } else {
      return App(app);
    }
  }

  function router(router: (app: AppApi) => JSX.Element) {
    invariant(
      isFunction(router),
      `[app.router] router should be function, but got ${typeof router}`
    );
    app._router = router;
  }
}
