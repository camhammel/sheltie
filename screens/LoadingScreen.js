import { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as TokenContext } from "../context/TokenContext";
import * as Linking from "expo-linking";

const LoadingScreen = () => {
  const { tryLocalSignin } = useContext(AuthContext);
  const { update_token } = useContext(TokenContext);

  useEffect(() => {
    tryLocalSignin();
    update_token();
  }, []);

  return null;
};

export default LoadingScreen;
