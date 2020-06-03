import { fork } from 'redux-saga/effects';
import userSaga from './user/saga';

export const rootSaga = function* () {
  yield fork(userSaga);
}