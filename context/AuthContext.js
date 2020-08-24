import createDataContext from "./createDataContext";
import sheltieApi from "../api/sheltie";
import { AsyncStorage } from "react-native";
import * as RootNavigation from "../navigationRef";
import * as SecureStore from "expo-secure-store";

const authReducer = (state, action) => {
  switch (action.type) {
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: action.payload };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const clearAsyncStorage = async () => {
  AsyncStorage.clear();
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message", payload: "" });
};

const updatePassword = (dispatch) => async ({ email, password }) => {
  try {
    let result = await sheltieApi.post("/resetpassword", {
      email: email.toString().toLowerCase(),
      password: password,
    });
    console.log("Attempted password update: " + result);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const sendCodeToEmail = (dispatch) => async (email) => {
  let prng = Math.random();
  prng = prng.toString().substring(3, 9);
  await SecureStore.setItemAsync("fpcode", prng);
  //AsyncStorage.setItem("fpcode", prng);

  try {
    await sheltieApi.post("/sendEmailCode", {
      email: email.toString().toLowerCase(),
      code: prng,
    });
    console.log(prng);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const emailExists = (dispatch) => async (email) => {
  try {
    await sheltieApi.post("/getfavourites", {
      email: email.toString().toLowerCase(),
    });
    console.log("email verified: " + email);

    return true;
  } catch (err) {
    AsyncStorage.setItem("fpcode", null);
    console.log(err);
    return false;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("authtoken");

  if (token) {
    dispatch({ type: "signin", payload: token });
    AsyncStorage.setItem("guest", "false");
    RootNavigation.reset("List");
  } else {
    RootNavigation.reset("Signup");
  }
};

const signup = (dispatch) => async ({ email, password }) => {
  //make API request to sign-up with that email and password
  try {
    const response = await sheltieApi.post("/signup", { email, password });
    await AsyncStorage.setItem("authtoken", response.data.token);
    await AsyncStorage.setItem("email", email);
    AsyncStorage.setItem("guest", "false");
    dispatch({
      type: "signin",
      payload: response.data.token,
    });
    RootNavigation.reset("List");
  } catch (err) {
    if (err.message == "Request failed with status code 422") {
      dispatch({
        type: "add_error",
        payload: "That email is already in use.",
      });
    }
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const response = await sheltieApi.post("/signin", { email, password });
    await AsyncStorage.setItem("authtoken", response.data.token);
    await AsyncStorage.setItem("email", email);
    AsyncStorage.setItem("guest", "false");
    dispatch({ type: "signin", payload: response.data.token });
    RootNavigation.reset("List");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong during signin.",
    });
  }
};

const signout = (dispatch) => async () => {
  await clearAsyncStorage().then(() => {
    console.log("AsyncStorage cleared.");
    dispatch({ type: "signout" });
    RootNavigation.reset("Welcome");
  });
};

const getfavs = (dispatch) => async (email) => {
  try {
    console.log(email);
    const response = await sheltieApi.post("/getfavourites", {
      email: email,
    });
    console.log("response: " + JSON.stringify(response.data));
    await AsyncStorage.setItem("favourites", JSON.stringify(response.data));

    //dispatch({ type: "getfavs", payload: response.data });
    RootNavigation.navigate("Favourites");
  } catch (err) {
    console.log(err.message);
  }
};

const checkfav = (dispatch) => async ({ email, petid }) => {
  try {
    console.log(email + ", " + petid);
    const response = await sheltieApi.post("/getfavourites", {
      email: email,
    });
    console.log("response: " + JSON.stringify(response.data));
    await AsyncStorage.setItem("favourites", JSON.stringify(response.data));

    if (response.data.includes(petid + "")) {
      console.log("This animal was favourited.");
      return true;
    } else {
      console.log("This animal was not favourited.");
      return false;
    }
  } catch (err) {
    console.log("Had to exit: " + err.message);
  }
};

const addfav = (dispatch) => async ({ email, petid }) => {
  try {
    console.log("email: " + email + ", id: " + petid);
    const response = await sheltieApi.post("/addfav", {
      email: email,
      petid: petid,
    });
    console.log("response: " + JSON.stringify(response.data));
  } catch (err) {
    console.log(err.message);
  }
};

const removefav = (dispatch) => async ({ email, petid }) => {
  try {
    console.log("email: " + email + ", id: " + petid);
    const response = await sheltieApi.post("/removefav", {
      email: email,
      petid: petid,
    });
    console.log("response: " + JSON.stringify(response.data.favourites));
    await AsyncStorage.setItem(
      "favourites",
      JSON.stringify(response.data.favourites)
    );
  } catch (err) {
    console.log(err.message);
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup,
    signin,
    signout,
    clearErrorMessage,
    tryLocalSignin,
    getfavs,
    addfav,
    removefav,
    checkfav,
    emailExists,
    sendCodeToEmail,
    updatePassword,
  },
  { authToken: null, errorMessage: "" }
);
