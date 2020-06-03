import { UserActionConstants } from './types';

/**
 * @description 修改用户信息 action
 */
export const changeUserInfo = (payload: Record<string, any>) => 
  ({ type: UserActionConstants.CHANGE_USER_INFO,
    payload
  } as const);

