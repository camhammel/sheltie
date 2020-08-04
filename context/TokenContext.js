import createDataContext from "./createDataContext";
import { AsyncStorage } from "react-native";
import * as RootNavigation from "../navigationRef";
import requestAccess from "../api/requestAccess";

const tokenReducer = (state, action) => {
  switch (action.type) {
    case "update_token":
      return { token: action.payload };
    default:
      return state;
  }
};

const update_token = (dispatch) => async () => {
  //make request for new token
  try {
    await requestAccess();
    console.log("Got it: " + AsyncStorage.getItem("token"));
    dispatch({
      type: "update_token",
      payload: my_token,
    });
    //RootNavigation.reset("List");
  } catch (err) {
    dispatch({
      type: "update_token",
      payload: "Something went wrong with requesting the token.",
    });
  }
};

export const { Provider, Context } = createDataContext(
  tokenReducer,
  { update_token },
  { token: "" }
);
