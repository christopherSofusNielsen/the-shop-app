import React, { useCallback, useEffect, useReducer } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

//Components
import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "../../store/actions/products";
import Input from "../../components/UI/Input";

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
  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input", "Please check errors in form", [
        { text: "Okay" },
      ]);
      return;
    }
    const { inputValues } = formState;
    if (editedProd) {
      console.log(inputValues.imageUrl);
      dispatch(
        productsActions.updateProduct(
          prodId,
          inputValues.title,
          inputValues.description,
          inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        productsActions.createProduct(
          inputValues.title,
          inputValues.description,
          inputValues.imageUrl,
          +inputValues.price
        )
      );
    }
    props.navigation.goBack();
  }, [prodId, formState]);

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
