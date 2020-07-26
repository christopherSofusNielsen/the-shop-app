import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

//components
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import DefaultText from "../../components/text/DefaultText";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //redux
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const onViewDetailsHandler = (item) => {
    props.navigation.navigate("ProductDetail", {
      productId: item.id,
      productTitle: item.title,
    });
  };

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", () => {
      loadProducts();
    });

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [loadProducts]);

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

  if (error) {
    return (
      <View style={styles.spinnerContainer}>
        <DefaultText>An error occurred!</DefaultText>
        <View style={{ marginVertical: 10 }}>
          <Button
            title="Try Again"
            onPress={loadProducts}
            color={Colors.primary}
          />
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.spinnerContainer}>
        <DefaultText>No products, start adding products!</DefaultText>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={productContainer}
    />
  );
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

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductsOverviewScreen;
