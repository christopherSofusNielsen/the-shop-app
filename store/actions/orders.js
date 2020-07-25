export const ADD_ORDER = "ADD_ORDER";

export const addOrder = (items, totalAmount) => {
  return {
    type: ADD_ORDER,
    items,
    totalAmount,
  };
};
