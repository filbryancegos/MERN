export const authReducer = ( state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    case 'IS_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'IS_NOTIFICATION':
      return {
        ...state,
        notification: {
          message: action.payload.message,
          isNotified: action.payload.isNotified,
          type: action.payload.type
        },
      }
    default:
      return state;
  }
}

