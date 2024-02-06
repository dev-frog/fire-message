import { combineReducers } from 'redux';
import userAuthReducer from './userAuthReducer';

const userReducer = combineReducers({
  user: userAuthReducer,
});

export default userReducer;
