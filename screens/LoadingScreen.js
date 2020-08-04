import { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as TokenContext } from "../context/TokenContext";

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
