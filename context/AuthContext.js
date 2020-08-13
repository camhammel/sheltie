import createDataContext from "./createDataContext";
import sheltieApi from "../api/sheltie";
import { AsyncStorage } from "react-native";
import * as RootNavigation from "../navigationRef";

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

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message", payload: "" });
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    dispatch({ type: "signin", payload: token });
    RootNavigation.reset("List");
  } else {
    RootNavigation.reset("Signup");
  }
};

const signup = (dispatch) => async ({ email, password }) => {
  //make API request to sign-up with that email and password
  try {
    const response = await sheltieApi.post("/signup", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem("email", email);

    dispatch({
      type: "signin",
      payload: response.data.token,
    });
    RootNavigation.reset("List");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong during signup.",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const response = await sheltieApi.post("/signin", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem("email", email);

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
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  RootNavigation.reset("Welcome");
};

const getfavs = (dispatch) => async (email) => {
  try {
    console.log(email);
    const response = await sheltieApi.post("/getfavourites", {
      email: email,
    });
    // const response = await sheltieApi.post("/getfavourites", {
    //   email: "camhammel3@gmail.com",
    // });
    console.log("response: " + JSON.stringify(response.data));
    await AsyncStorage.setItem("favourites", JSON.stringify(response.data));

    //dispatch({ type: "getfavs", payload: response.data });
    RootNavigation.navigate("Favourites");
  } catch (err) {
    console.log(err.message);
  }
};

const togglefav = (dispatch) => async ({ email, petid }) => {
  try {
    console.log("email: " + email + ", id: " + petid);
    const response = await sheltieApi.post("/togglefav", { email, petid });
    console.log("response: " + JSON.stringify(response.data));
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
    togglefav,
  },
  { token: null, errorMessage: "" }
);
