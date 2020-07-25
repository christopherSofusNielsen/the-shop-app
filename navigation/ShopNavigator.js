import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

//screens
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";

/**
 * Stack navigator
 */

const defaultOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductNavigator = createStackNavigator(
  {
    ProductOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    defaultNavigationOptions: defaultOptions,
    navigationOptions: {
      drawerIcon: (config) => (
        <Ionicons name="md-cart" size={23} color={config.tintColor} />
      ),
    },
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Order: OrdersScreen,
  },
  {
    defaultNavigationOptions: defaultOptions,
    navigationOptions: {
      drawerIcon: (config) => (
        <Ionicons name="md-list" size={23} color={config.tintColor} />
      ),
    },
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    defaultNavigationOptions: defaultOptions,
    navigationOptions: {
      drawerIcon: (config) => (
        <Ionicons name="md-create" size={23} color={config.tintColor} />
      ),
    },
  }
);

/**
 * Drawer navigator
 */

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
  }
);

export default createAppContainer(ShopNavigator);
