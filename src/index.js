// @flow

import React from "react";
import ReactDOM from "react-dom";
import { type LogoSettings } from "./logo";
import { Wrapper } from "./wrapper";
import { render } from "./logoSvg";

const canonicalLogo: LogoSettings = {
  baseCollapse: [1],
  midCollapse: [1, 0.7],
  edgeCollapse: [1, 0.9],
  rayWidth: 0.75,
  nRays: 20,
  backgroundColor: "#20364a",
  baseColor: "#ffbc95",
  midColor: "#e7a59a",
  edgeColor: "#87738c",
  pupil: 0.4,
  base: 0.5,
  mid: 0.8,
  edge: 0.97
};

const otherCoolLogo: LogoSettings = {
  pupil: 0.39,
  base: 0.1,
  mid: 0.2,
  edge: 0.28,

  baseCollapse: [1],
  midCollapse: spiralLength(9).reverse(),
  edgeCollapse: spiralLength(9).reverse(),
  rayWidth: 0.75,
  nRays: 72,
  backgroundColor: "#20364a",
  baseColor: "#ffbc95",
  midColor: "#e7a59a",
  edgeColor: "#87738c"
};
const logos = [canonicalLogo, otherCoolLogo];
export class Main extends React.Component<{}> {
  render() {
    return (
      <svg width="600" height="600">
        <Wrapper x={50} y={50} generator={g => render(g, 512, otherCoolLogo)} />
      </svg>
    );
  }
}

const wrapper = document.getElementById("target");
wrapper ? ReactDOM.render(<Main />, wrapper) : false;

function range(n) {
  const ret = [];
  for (let i = 0; i < n; i++) {
    ret.push(i);
  }
  return ret;
}
function spiralLength(n) {
  return range(n).map(x => x / (n - 1));
}

function spiralLengthNever0(n) {
  return range(n).map(x => (x + 1) / n);
}
