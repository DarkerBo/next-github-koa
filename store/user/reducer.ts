import { UserActionTypes, UserState, UserActionConstants } from './types';

export const initialUserState: UserState = {
  userInfo: {}
};

export default (state = initialUserState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case UserActionConstants.CHANGE_USER_INFO:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
};
