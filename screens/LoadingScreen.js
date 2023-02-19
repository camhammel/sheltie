import { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { isReadyRef } from "../navigationRef";

const LoadingScreen = () => {
  const { tryLocalSignin } = useContext(AuthContext);

  useEffect(() => {
    if (isReadyRef.current)
      tryLocalSignin();
  }, [isReadyRef.current]);

  return null;
};

export default LoadingScreen;
