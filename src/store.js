import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const loadState = () => {
  try {
    const serialized = localStorage.getItem('pbtState');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    // localStorage.setItem('pbtState', JSON.stringify(state));
  } catch {}
};

const persistedState = loadState();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, persistedState, composeEnhancers(applyMiddleware(thunk)));
store.subscribe(() => saveState(store.getState()));

export default store;