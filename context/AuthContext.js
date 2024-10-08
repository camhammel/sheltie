import createDataContext from "./createDataContext";
import sheltieApi from "../api/sheltie";
import * as RootNavigation from "../navigationRef";
import * as SecureStore from "expo-secure-store";
import { storage } from "../utils/storage";
import _uniqBy from "lodash/uniqBy";

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

const updatePassword =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      await sheltieApi.post("resetpassword", {
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
    await sheltieApi.post("sendEmailCode", {
      email: email.toString().toLowerCase(),
      code: prng,
    });
    return true;
  } catch (err) {
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

const signup =
  (dispatch) =>
  async ({ email, password }) => {
    //make API request to sign-up with that email and password
    try {
      const response = await sheltieApi.post("signup", { email, password });
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
        console.error("could not complete sign up.");
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

const signin =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await sheltieApi.post("signin", { email, password });
      if (response.data.token) {
        storage.set("authtoken", response.data.token);
        storage.set("email", email);
        storage.set("guest", false);
        dispatch({ type: "signin", payload: response.data.token });
        RootNavigation.reset("List");
      } else {
        console.error("could not complete sign in.");
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

const getfavs =
  (dispatch) =>
  async (email, shouldNavigate = true) => {
    try {
      const response = await sheltieApi.get("getfavourites", {
        params: {
          email,
        },
      });
      if (response.data) {
        storage.set("favourites", JSON.stringify(_uniqBy(response.data, "id")));
        if (shouldNavigate) RootNavigation.navigate("Favourites");
      }
    } catch (err) {
      console.error("err", err);
    }
  };

const checkfav =
  (dispatch) =>
  async ({ email, petid }) => {
    try {
      const response = await sheltieApi.get("getfavourites", {
        params: {
          email,
        },
      });
      if (response.data) {
        storage.set("favourites", JSON.stringify(response.data));
        return !!response.data.find(({ id }) => String(id) == String(petid));
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  };

const addfav =
  (dispatch) =>
  async ({ email, pet }) => {
    const token = storage.getString("authtoken");
    try {
      await sheltieApi.post(
        "addfav",
        {
          email,
          pet,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
    } catch (err) {
      console.error(err.toString());
    }
  };

const removefav =
  (dispatch) =>
  async ({ email, petid }) => {
    const token = storage.getString("authtoken");
    try {
      const response = await sheltieApi.post(
        "removefav",
        {
          email,
          petid,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.favourites) {
        storage.set("favourites", JSON.stringify(response.data.favourites));
      }
    } catch (err) {
      console.error(err);
    }
  };

export const { Provider, Context } = createDataContext(authReducer, {
  signup,
  signin,
  signout,
  clearErrorMessage,
  tryLocalSignin,
  getfavs,
  addfav,
  removefav,
  checkfav,
  sendCodeToEmail,
  updatePassword,
});
