import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";
import Colors from "../../constants/Colors";

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");
  const dispatch = useDispatch();
  const product = useSelector(({ products }) =>
    products.availableProducts.find((p) => p.id === productId)
  );

  return (
    <ScrollView>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <Button
          color={Colors.primary}
          title="Add to Chart"
          onPress={() => {
            dispatch(cartActions.addToCart(product));
          }}
        />
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam("productTitle");
  return {
    headerTitle: title,
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  buttonContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export default ProductDetailScreen;
