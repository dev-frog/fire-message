const userAuthReducer = (state = null, actions) => {
  switch (actions.type) {
    case 'SET_USER':
      return {
        ...state,
        user: actions.user,
      };
    case 'SET_USER_NULL':
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

export default userAuthReducer;
