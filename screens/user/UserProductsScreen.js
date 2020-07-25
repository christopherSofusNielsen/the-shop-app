import React from "react";
import { FlatList, Button, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
//Components
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as productsActions from "../../store/actions/products";

const UserProductsScreen = (props) => {
  const dispatch = useDispatch();
  const userProduct = useSelector((state) => state.products.userProducts);

  const editProductHandler = (productId) => {
    props.navigation.navigate("EditProduct", { productId });
  };

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", `Do you want to delete ${userProduct.title}`, [
      { text: "NO", style: "default" },
      {
        text: "YES",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        },
      },
    ]);
  };

  return (
    <FlatList
      data={userProduct}
      renderItem={({ item }) => (
        <ProductItem
          {...item}
          onSelect={() => {
            editProductHandler(item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              deleteHandler(item.id);
            }}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = (navData) => ({
  headerTitle: "User Products",
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Menu"
        iconName="md-menu"
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Edit"
        iconName="md-add"
        onPress={() => {
          navData.navigation.navigate("EditProduct");
        }}
      />
    </HeaderButtons>
  ),
});

export default UserProductsScreen;
