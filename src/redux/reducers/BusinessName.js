//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
let defaultState = {
  businessName: "",
};

let businessName = (state = defaultState, action) => {
  switch (action.type) {
    case "New_busniess_searched": {
      let newState = { ...state };
     // console.log("new-business");
      newState = {
        businessName: action.payload,
      };
     // console.log(action.payload);
      return newState;
    }
    case "Set_to default": {
      let newState = { ...state };
      newState = {
        businessName: " ",
      };
      return newState;
    }
    default:
      return state;
  }
};

export default businessName;
