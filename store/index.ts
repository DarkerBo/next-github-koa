import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { MakeStoreOptions } from "next-redux-wrapper";

export type RootState = ReturnType<typeof rootReducer>;

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(middleware))
  }
  return applyMiddleware(middleware)
}

const initializeStore: any = function (initialState: RootState, 
  { isServer, req }: MakeStoreOptions) {

const sagaMiddleware = createSagaMiddleware();

  if (req && isServer) {
    const session = (req as any).session;
    initialState = {...initialState, user: { userInfo: session.userInfo }}
  }

  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware(sagaMiddleware)
  );
  
  sagaMiddleware.run(rootSaga);
  
  return store;

}

export default initializeStore;
