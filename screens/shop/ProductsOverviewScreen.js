import React from "react";
import { StyleSheet, View, FlatList, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

//components
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = (props) => {
  //redux
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const onViewDetailsHandler = (item) => {
    props.navigation.navigate("ProductDetail", {
      productId: item.id,
      productTitle: item.title,
    });
  };

  //functions
  const productContainer = ({ item }) => {
    return (
      <ProductItem
        imageUrl={item.imageUrl}
        title={item.title}
        price={item.price}
        onSelect={() => onViewDetailsHandler(item)}
      >
        <Button
          color={Colors.primary}
          title="View details"
          onPress={() => onViewDetailsHandler(item)}
        />
        <Button
          color={Colors.primary}
          title="To Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(item));
          }}
        />
      </ProductItem>
    );
  };

  return <FlatList data={products} renderItem={productContainer} />;
};

ProductsOverviewScreen.navigationOptions = (navData) => ({
  headerTitle: "All Products",
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Favorite"
        iconName="md-cart"
        onPress={() => {
          navData.navigation.navigate("Cart");
        }}
      />
    </HeaderButtons>
  ),
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Favorite"
        iconName="md-menu"
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({});

export default ProductsOverviewScreen;
