//import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
let defaultState = {
  selectedItems: {
    items: [],
    checkeditems: [],
    quantity: [{quantity: 0, id: 0}],
  },
};

let cartReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      let newState = {...state};
      if (action.payload.checkboxValue) {
        //console.log('ADD TO CART', action.payload);
        newState.selectedItems = {
          checkeditems: [
            ...newState.selectedItems.checkeditems,
            action.payload,
          ],
          items: [...newState.selectedItems.items],
          quantity: [...newState.selectedItems.quantity],
        };
       // console.log('ADD TO CART return');
      } else {
       // console.log('REMOVE FROM CART');
        newState.selectedItems = {
          checkeditems: [
            ...newState.selectedItems.checkeditems.filter(
              item => item.name !== action.payload.name,
            ),
          ],
          items: [...newState.selectedItems.items],
          quantity: [...newState.selectedItems.quantity],
        };
      }
      //console.log(newState, '👉');
      return newState;
    }
    case 'CART_PRESSED': {
      let newState = {...state};
     // console.log('CART PRESSED');
      newState.selectedItems = {
        items: [...newState.selectedItems.items, action.payload],
        checkeditems: [...newState.selectedItems.checkeditems],
        quantity: [
          ...newState.selectedItems.quantity,
          {quantity: action.payload.quantity, id: action.payload.id},
        ],
      };
      //console.log(newState, '👉');
      return newState;
    }
    case 'ADD_QUANTITY': {
      let newState = {...state};
      //console.log('Quantity_pressed');
      if (
        newState.selectedItems.quantity.find(e => e.id == action.payload.id)
      ) {
        const i = newState.selectedItems.quantity.findIndex(
          e => e.id == action.payload.id,
        );
        //console.log(i);
        newState.selectedItems = {
          items: [...newState.selectedItems.items],
          checkeditems: [...newState.selectedItems.checkeditems],
          quantity: [
            ...newState.selectedItems.quantity,
            newState.selectedItems.quantity[i].quantity++,
          ],
        };
      } else {
        newState.selectedItems = {
          items: [...newState.selectedItems.items],
          checkeditems: [...newState.selectedItems.checkeditems],
          quantity: [
            ...newState.selectedItems.quantity,
            {quantity: action.payload.quantity, id: action.payload.id},
          ],
        };
      }
      //  console.log("includes or not ",newState.selectedItems.quantity.find(e=>e.id==action.payload.id))
     // console.log(newState, '👉');
      return newState;
    }
    case 'REMOVE_QUANTITY': {
      let newState = {...state};
      // console.log(
      //   'Quantity_reomoved',
      //   newState.selectedItems.quantity.find(e => e.id === action.payload.id),
      // );
      if (
        newState.selectedItems.quantity.find(e => e.id == action.payload.id)
      ) {
       // console.log('found');
        const i = newState.selectedItems.quantity.findIndex(
          e => e.id == action.payload.id,
        );
      //  console.log(i);
        if (newState.selectedItems.quantity[i].quantity > 1) {
          newState.selectedItems = {
            items: [...newState.selectedItems.items],
            checkeditems: [...newState.selectedItems.checkeditems],
            quantity: [
              ...newState.selectedItems.quantity,
              newState.selectedItems.quantity[i].quantity--,
            ],
          };
        } else {
         // console.log('exit the item', newState.selectedItems.quantity[i].id);
          newState.selectedItems = {
            items: [
              ...newState.selectedItems.items.filter(
                item => item.id != action.payload.id,
              ),
            ],
            checkeditems: [
              ...newState.selectedItems.checkeditems.filter(
                item => item.id != action.payload.id,
              ),
            ],
            quantity: [
              ...newState.selectedItems.quantity.filter(
                item => item.id != action.payload.id,
              ),
            ],
          };
        }
      }
      //console.log(newState, '👉');
      return newState;
    }
    case 'PLACE_ORDER': {
      let newState = {...state};
     // console.log('Orderplaced');
      newState.selectedItems = {
        items: [],
        checkeditems: [],
        quantity: [],
      };
      console.log(newState, '👉');
      return newState;
    }
    case 'NEW_L': {
      let newState = {...state};
      const len = newState.selecteditems.newitems.length;
    //  console.log('New');
      newState.selectedItems = {
        newitems: [...newState.selectedItems.newitems, action.payload],
      };
      //  newState.selectedItems.newitems={
      //  cheked:[...newState.selectedItems.newitems.cheked, action.payload]
      //  }
      //console.log(newState, '👉');
      return newState;
    }
    default:
      return state;
  }
};

export default cartReducer;
