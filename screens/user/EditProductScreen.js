import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

//Components
import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "../../store/actions/products";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import DefaultText from "../../components/text/DefaultText";

const FORM_UPDATE = "FORM_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.name]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.name]: action.isValid,
    };
    let formIsValid = true;
    for (let key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid,
    };
  }
  return state;
};

const EditProductScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId = props.navigation.getParam("productId");
  const editedProd = useSelector((state) => {
    return state.products.userProducts.find((prod) => prod.id === prodId);
  });

  //reducer
  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editedProd ? editedProd.title : "",
      imageUrl: editedProd ? editedProd.imageUrl : "",
      description: editedProd ? editedProd.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProd ? true : false,
      imageUrl: editedProd ? true : false,
      description: editedProd ? true : false,
      price: editedProd ? true : false,
    },
    formIsValid: editedProd ? true : false,
  });

  //Functions
  useEffect(() => {
    if (error) {
      Alert.alert("Error occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input", "Please check errors in form", [
        { text: "Okay" },
      ]);
      return;
    }

    setError(null);
    setIsLoading(true);

    const { inputValues } = formState;

    try {
      if (editedProd) {
        console.log(inputValues.imageUrl);
        await dispatch(
          productsActions.updateProduct(
            prodId,
            inputValues.title,
            inputValues.description,
            inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            inputValues.title,
            inputValues.description,
            inputValues.imageUrl,
            +inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [prodId, formState, setIsLoading, setError, dispatch]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const onInputChange = useCallback(
    (name, value, isValid) => {
      formDispatch({
        type: FORM_UPDATE,
        value,
        isValid,
        name,
      });
    },
    [formDispatch]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <DefaultText>An error occurred!</DefaultText>
      </View>
    );
  }

  const { inputValues, inputValidities } = formState;
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            errorText="Please provide correct title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            id="title"
            onInputChange={onInputChange}
            initValue={editedProd ? editedProd.title : ""}
            initValid={editedProd ? true : false}
            required
          />
          <Input
            label="Image URL"
            errorText="Please provide correct image URL"
            keyboardType="default"
            returnKeyType="next"
            id="imageUrl"
            onInputChange={onInputChange}
            initValue={editedProd ? editedProd.imageUrl : ""}
            initValid={editedProd ? true : false}
            required
          />

          {editedProd ? null : (
            <Input
              label="Price"
              errorText="Please enter valid price"
              keyboardType="decimal-pad"
              returnKeyType="next"
              id="price"
              onInputChange={onInputChange}
              required
              min={0}
            />
          )}
          <Input
            label="Description"
            errorText="Please enter valid description"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiLine
            numberOfLines={3}
            id={"description"}
            onInputChange={onInputChange}
            initValue={editedProd ? editedProd.description : ""}
            initValid={editedProd ? true : false}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

EditProductScreen.navigationOptions = (navData) => {
  const productId = navData.navigation.getParam("productId");
  const submitHandler = navData.navigation.getParam("submit");
  return {
    headerTitle: productId ? "Edit Product" : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Edit" iconName="md-checkmark" onPress={submitHandler} />
      </HeaderButtons>
    ),
  };
};

export default EditProductScreen;
