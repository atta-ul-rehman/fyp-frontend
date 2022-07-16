//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
let defaultState = {
  authToken: '',
};

let authToken = (state = defaultState, action) => {
  switch (action.type) {
    case 'New_User': {
      let newState = {...state};
      newState = {
        authToken: action.payload,
      };
      return newState;
    }
    case 'LogOut': {
      let newState = {...state};
     // console.log('Logout');
      newState = {
        authToken: '',
      };
      return newState;
    }
    default:
      return state;
  }
};

export default authToken;
