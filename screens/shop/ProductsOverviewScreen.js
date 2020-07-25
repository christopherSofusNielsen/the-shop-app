import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";

//components
import ProductItem from "../../components/shop/ProductItem";

const ProductsOverviewScreen = (props) => {
  //redux
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  //functions
  const productContainer = ({ item }) => {
    return (
      <ProductItem
        imageUrl={item.imageUrl}
        title={item.title}
        price={item.price}
        onViewDetails={() => {
          props.navigation.navigate("ProductDetail", {
            productId: item.id,
            productTitle: item.title,
          });
        }}
        onAddToChart={() => {
          dispatch(cartActions.addToCart(item));
        }}
      />
    );
  };

  return <FlatList data={products} renderItem={productContainer} />;
};

ProductsOverviewScreen.navigationOptions = {
  headerTitle: "All Products",
};

const styles = StyleSheet.create({});

export default ProductsOverviewScreen;
