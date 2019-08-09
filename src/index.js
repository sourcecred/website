// @flow

import React from "react";
import ReactDOM from "react-dom";
import { Logo } from "./logo";

export class Main extends React.Component<{}> {
  render() {
    return <Logo size={512} />;
  }
}

const wrapper = document.getElementById("target");
wrapper ? ReactDOM.render(<Main />, wrapper) : false;
