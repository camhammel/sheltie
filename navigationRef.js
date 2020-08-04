import * as React from "react";
export const navigationRef = React.createRef();

export function reset(name) {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: name }],
  });
}

export function navigate(name) {
  navigationRef.current?.navigate(name);
}
