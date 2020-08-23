import React, { useState } from "react";
import { View } from "react-native";
import ResetForm from "../resetPassword/ResetForm";
import CodeForm from "../resetPassword/CodeForm";
import NewPasswordForm from "../resetPassword/NewPasswordForm";

const ForgotPasswordScreen = () => {
  const [stage, setStage] = useState(1);

  const switchStage = () => {
    if (stage == 1) {
      setStage(2);
      determineForm();
    } else if (stage == 2) {
      setStage(3);
      determineForm();
    } else if (stage == 3) {
      setStage(1);
      determineForm();
    }
  };

  const determineForm = () => {
    if (stage == 1) {
      return <ResetForm switchStage={switchStage} setEmail={setEmail} />;
    } else if (stage == 2) {
      return <CodeForm switchStage={switchStage} />;
    } else {
      return <NewPasswordForm switchStage={switchStage} email={email} />;
    }
  };

  const [email, setEmail] = useState("");

  return determineForm();
};

export default ForgotPasswordScreen;
