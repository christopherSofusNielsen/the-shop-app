import { ADD_ORDER, SET_ORDERS } from "../actions/orders";

import Order from "../../models/order";

const initState = {
  orders: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders,
      };

    case ADD_ORDER:
      const newOrder = new Order(
        action.id,
        action.items,
        action.totalAmount,
        action.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };

    default:
      return state;
  }
};
