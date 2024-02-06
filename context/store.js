import { createStore } from 'redux';
import userReducer from './reducers';

const Store = createStore(userReducer);

export default Store;
