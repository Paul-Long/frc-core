export default (initialState: object, handlers: object) => {
  if (initialState === undefined && initialState === null) {
    throw new Error('Initial state is required');
  }

  if (typeof handlers !== 'object') {
    throw new Error('Handlers must be an object');
  }

  return (state = initialState, action: any) => {
    if (!action || !Object.prototype.hasOwnProperty.call(action, 'type')) {
      return state;
    }

    const handler = handlers[action.type];
    let newState = !handler ? state : handler(state, action);
    if (!action.type.endsWith('_FAIL')) {
      delete newState.error;
    }
    return newState;
  };
};
