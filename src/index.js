// @flow

import React from "react";
import ReactDOM from "react-dom";
import { Logo, type LogoSettings } from "./logo";

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
  pupil: 0.4,
  base: 0.5,
  mid: 0.8,
  edge: 0.97,

  baseCollapse: spiralLength(36),
  midCollapse: spiralLength(18),
  edgeCollapse: spiralLength(9),
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
      <svg width="1125" height="2436">
        <Logo
          x={(1125 - 1024) / 2}
          y={(2436 - 1024) / 2}
          size={1024}
          settings={otherCoolLogo}
        />
        ;
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
