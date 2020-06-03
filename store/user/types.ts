import { changeUserInfo, } from './actions';

/**
 * Action Constants
 */
export enum UserActionConstants {
  /** 修改用户信息 */
  CHANGE_USER_INFO = 'CHANGE_USER_INFO',
  /** 退出登录 清空用户信息 */
  LOGOUT = 'LOGOUT',
}

/**
 * Action Types
 */
export type changeUserInfoType = ReturnType<typeof changeUserInfo>;

export type UserActionTypes = changeUserInfoType;

/**
 * Saga Action Types
 */


/**
 * Reducer State
 */
export interface UserState {
  readonly userInfo: Record<string, any>;
}