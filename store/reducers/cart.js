import CartItem from "../../models/cart-item";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initState = {
  items: {},
  totalAmount: 0,
};

const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { id, price, title } = action.product;
      let cartItem;
      if (state.items[id]) {
        cartItem = new CartItem(
          state.items[id].quantity + 1,
          price,
          title,
          state.items[id].sum + price
        );
      } else {
        cartItem = new CartItem(1, price, title, price);
      }
      return {
        ...state,
        items: {
          ...state.items,
          [id]: cartItem,
        },
        totalAmount: state.totalAmount + price,
      };

    case REMOVE_FROM_CART:
      const selectedItem = state.items[action.id];
      let cartItems;
      if (selectedItem.quantity > 1) {
        const updatedItem = new CartItem(
          selectedItem.quantity - 1,
          selectedItem.productPrice,
          selectedItem.productTitle,
          selectedItem.sum - selectedItem.productPrice
        );
        cartItems = { ...state.items, [action.id]: updatedItem };
      } else {
        cartItems = { ...state.items };
        delete cartItems[action.id];
      }
      return {
        ...state,
        items: cartItems,
        totalAmount: state.totalAmount - selectedItem.productPrice,
      };

    case ADD_ORDER:
      return initState;

    case DELETE_PRODUCT:
      let updatedItems = { ...state.items };
      let updatedAmount = state.totalAmount;
      if (state.items[action.id]) {
        delete updatedItems[action.id];
        updatedAmount -= state.items[action.id].sum;
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: updatedAmount,
      };

    default:
      return state;
  }
};

export default cartReducer;
