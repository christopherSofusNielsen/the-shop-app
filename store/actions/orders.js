import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(
        "https://the-shop-app-server.firebaseio.com/orders/u1.json"
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      const loadedData = [];
      for (let key in data) {
        const { items, totalAmount, date } = data[key];
        loadedData.push(new Order(key, items, totalAmount, new Date(date)));
      }
      dispatch({ type: SET_ORDERS, orders: loadedData });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (items, totalAmount) => {
  return async (dispatch) => {
    const date = new Date().toISOString();
    const res = await fetch(
      "https://the-shop-app-server.firebaseio.com/orders/u1.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          totalAmount,
          date,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const data = res.json();

    dispatch({
      type: ADD_ORDER,
      id: data.name,
      date,
      items,
      totalAmount,
    });
  };
};
