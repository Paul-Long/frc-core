import React from 'react';
import { Provider } from 'react-redux';
import {AppApi} from './types';
export default function getProvider(app: AppApi) {
  return (
    <Provider store={(app as any).store}>
      {(app as any)._router(app)}
    </Provider>
  );
}
