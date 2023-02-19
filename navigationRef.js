import * as React from "react";
export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function reset(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.resetRoot({
      index: 0,
      routes: [{ name: name, params }],
    });
  }  else {
    console.warn('tried to reset navigation to ', name);
  }
}

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current && navigationRef.current.navigate(name, params);
  } else {
    console.warn('tried to navigate to ', name);
  }
}
