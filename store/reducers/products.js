import PRODUCTS from "../../data/dummy-data";

const initState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((p) => p.ownerId === "u1"),
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default productReducer;
