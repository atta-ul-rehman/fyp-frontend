import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import businessName from "./BusinessName";
import authToken from "./authToken";
import Order_delivery_timer from "./Order_delivery_timer";
import LoginedUser from "./LoginedUser";

let reducers = combineReducers({
  cartReducer: cartReducer,
  businessName: businessName,
  authToken: authToken,
  Order_delivery_timer: Order_delivery_timer,
  LoginedUser: LoginedUser,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
