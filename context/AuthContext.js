import createDataContext from "./createDataContext";
import sheltieApi from "../api/sheltie";
import * as RootNavigation from "../navigationRef";
import * as SecureStore from "expo-secure-store";
import { storage } from "../utils/storage";

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

const updatePassword = (dispatch) => async ({ email, password }) => {
  try {
    await sheltieApi.post("/resetpassword", {
      email: email.toString().toLowerCase(),
      password: password,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const sendCodeToEmail = (dispatch) => async (email) => {
  let prng = Math.random();
  prng = prng.toString().substring(3, 9);
  await SecureStore.setItemAsync("fpcode", prng);

  try {
    await sheltieApi.post("/sendEmailCode", {
      email: email.toString().toLowerCase(),
      code: prng,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const emailExists = (dispatch) => async (email) => {
  try {
    await sheltieApi.post("/getfavourites", {
      email: email.toString().toLowerCase(),
    });

    return true;
  } catch (err) {
    storage.set("fpcode", null);

    return false;
  }
};

const tryLocalSignin = (dispatch) => () => {
  const token = storage.getString("authtoken");

  if (token) {
    dispatch({ type: "signin", payload: token });
    storage.set("guest", false);
    RootNavigation.reset("List");
  } else {
    RootNavigation.reset("Signin");
  }
};

const signup = (dispatch) => async ({ email, password }) => {
  //make API request to sign-up with that email and password
  try {
    const response = await sheltieApi.post("/signup", { email, password });
    if (response.data.token) {
      storage.set("authtoken", response.data.token);
      storage.set("email", email);
      storage.set("guest", false);
      dispatch({
        type: "signin",
        payload: response.data.token,
      });
      RootNavigation.reset("List");
    } else {
      console.error('could not complete sign up.');
    }
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
    if (response.data.token) {
      storage.set("authtoken", response.data.token);
      storage.set("email", email);
      storage.set("guest", false);
      dispatch({ type: "signin", payload: response.data.token });
      RootNavigation.reset("List");
    } else {
      console.error('could not complete sign in.');
    }
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong during signin.",
    });
  }
};

const signout = (dispatch) => () => {
  storage.clearAll();
  dispatch({ type: "signout" });
  RootNavigation.reset("Signin");
};

const getfavs = (dispatch) => async (email) => {
  try {
    const response = await sheltieApi.post("/getfavourites", {
      email: email,
    });
    if (response.data) {
      storage.set("favourites", JSON.stringify(response.data));
      RootNavigation.navigate("Favourites");
    }
  } catch (err) {}
};

const checkfav = (dispatch) => async ({ email, petid }) => {
  try {
    const response = await sheltieApi.post("/getfavourites", {
      email: email,
    });
    if (response.data) {
      storage.set("favourites", JSON.stringify(response.data));
  
      if (response.data.includes(petid + "")) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {}
};

const addfav = (dispatch) => async ({ email, petid }) => {
  try {
    await sheltieApi.post("/addfav", {
      email: email,
      petid: petid,
    });
  } catch (err) {}
};

const removefav = (dispatch) => async ({ email, petid }) => {
  try {
    const response = await sheltieApi.post("/removefav", {
      email: email,
      petid: petid,
    });

    if (response.data.favourites) {
      storage.set(
        "favourites",
        JSON.stringify(response.data.favourites)
      );
    }
  } catch (err) {}
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
