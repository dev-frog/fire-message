export const SET_USER = user => {
  return {
    type: 'SET_USER',
    user,
  };
};

export const SET_USER_NULL = () => {
  return {
    type: 'SET_USER_NULL',
  };
};
