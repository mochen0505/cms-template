import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import api from '../api';
import * as authReducers from './reducers/authReducer';
import * as profileReducers from './reducers/profileReducer';

const reducer = combineReducers({
  ...authReducers,
  ...profileReducers
});
const middleware = [logger, thunk.withExtraArgument(api)];
const enhancers = [applyMiddleware(...middleware)];

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const store = createStore(reducer, composeEnhancers(...enhancers));

export default store;
