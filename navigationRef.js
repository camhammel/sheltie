import * as React from "react";
export const navigationRef = React.createRef();

export function reset(name, params) {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: name, params }],
  });
}

export function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}
