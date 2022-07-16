//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
let defaultState = {
  LoginedUser: [],
  userLocation: {},
};

let LoginedUser = (state = defaultState, action) => {
  switch (action.type) {
    case "Get_Logined": {
      //console.log(action.payload)
      let newState = { ...state };
      newState = {
        LoginedUser: [action.payload],
        userLocation: newState.userLocation,
      };
      // console.log("user Data", newState);
      return newState;
    }
    case "Save_User_location": {
      let newState = { ...state };
      newState = {
        userLocation: action.payload,
        LoginedUser: [newState.LoginedUser],
      };
      //console.log("location", newState);
      return newState;
    }

    case "Delete_nUser": {
      let newState = { ...state };
      console.log("Logout");
      newState = {
        LoginedUser: "",
      };
      return newState;
    }
    default:
      return state;
  }
};

export default LoginedUser;
