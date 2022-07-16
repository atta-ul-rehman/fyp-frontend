//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
let defaultState = {
  Delivery_time: [{ id: 0, time: 0 }],
  appLeaving_time: [],
};

let Order_delivery_timer = (state = defaultState, action) => {
  switch (action.type) {
    case "set_DeliveryTime": {
      let newState = { ...state };
      if (newState.Delivery_time.find((e) => e.id == action.payload.id)) {
        const i = newState.Delivery_time.findIndex(
          (e) => e.id == action.payload.id
        );
        newState = {
          Delivery_time: [
            ...newState.Delivery_time,
            (newState.Delivery_time[i].time = action.payload.time),
          ],
          appLeaving_time: [...newState.appLeaving_time],
        };
        console.log("payload", newState);
        return newState;
      } else {
        newState = {
          Delivery_time: [
            ...newState.Delivery_time,
            { id: action.payload.id, time: action.payload.time },
          ],
          appLeaving_time: [...newState.appLeaving_time],
        };
        console.log("payload", newState);
        return newState;
      }
    }
    case "Set_Leaving_time": {
      let newState = { ...state };
      newState = {
        appLeaving_time: [...newState.appLeaving_time, action.payload],
        Delivery_time: [...newState.Delivery_time],
      };
      return newState;
    }
    case "Set_Delivery_leaving_time_to_default": {
      console.log("Reset");
      let newState = { ...state };
      newState = {
        appLeaving_time: [],
        Delivery_time: [],
      };
      console.log("reset", newState);
      return newState;
    }
    default:
      return state;
  }
};

export default Order_delivery_timer;
