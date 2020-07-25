import { ADD_ORDER } from "../actions/orders";

import Order from "../../models/order";

const initState = {
  orders: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        Math.random().toString(),
        action.items,
        action.totalAmount,
        new Date()
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };

    default:
      return state;
  }
};
