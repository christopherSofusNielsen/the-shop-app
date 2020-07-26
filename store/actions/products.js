import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(
        "https://the-shop-app-server.firebaseio.com/products.json"
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      const loadedData = [];
      for (let key in data) {
        const { title, imageUrl, price, description } = data[key];
        loadedData.push(
          new Product(key, "u1", title, imageUrl, description, price)
        );
      }
      dispatch({ type: SET_PRODUCTS, products: loadedData });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    const res = await fetch(
      `https://the-shop-app-server.firebaseio.com/products/${productId}.json`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong...");
    }

    dispatch({
      type: DELETE_PRODUCT,
      id: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch) => {
    const res = await fetch(
      "https://the-shop-app-server.firebaseio.com/products.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
        }),
      }
    );

    const data = await res.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: data.name,
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch) => {
    const res = await fetch(
      `https://the-shop-app-server.firebaseio.com/products/${id}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong...");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
