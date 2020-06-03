import { put, takeLatest, call } from 'redux-saga/effects';
import { changeUserInfo } from './actions';
import { UserActionConstants } from './types';
import { userLogout } from '../../service/user';

/**
 * @description 退出登录 清空用户信息 saga
 */
function* logoutAsync() {
  yield call(userLogout)
  yield put(changeUserInfo({}));
}

export default function*() {
  yield takeLatest(UserActionConstants.LOGOUT, logoutAsync);
}
