// @flow

import React from "react";
import ReactDOM from "react-dom";
import { canvasRender, defaultCanvasRender } from "./logoCanvas";
import "./style.css";

export class Landing extends React.Component<{}> {
  render() {
    return (
      <div>
        <canvas id="target"></canvas>
        <h1>SourceCred</h1>
        <h2>a reputation protocol for open collaboration</h2>
      </div>
    );
  }

  componentDidMount() {
    const canvas = document.getElementById("target");
    defaultCanvasRender(canvas);
  }
}

const wrapper: any = document.getElementById("target");
wrapper ? ReactDOM.render(<Landing />, wrapper) : false;
