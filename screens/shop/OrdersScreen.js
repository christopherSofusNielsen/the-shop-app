import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as ordersActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderItem
          date={item.readableDate}
          amount={item.totalAmount}
          items={item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All orders",
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
  };
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
