// @flow

import { svg } from "./svg";
import { render } from "./logoSvg";
import { defaultSettings } from "./defaultSettings";

const x = 512;

function design(g) {
  g = g.append("g").attr("transform", `translate(${x / 2}, ${x / 2})`);
  render(g, x, defaultSettings());
}

console.log(svg(design, x, x));
