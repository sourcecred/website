// @flow

import { type RenderSettings } from "./logo";
import { spiral } from "./rays";

export function defaultSettings(): RenderSettings {
  const computes = [spiral(14), spiral(6), spiral(20)];
  const weights = [
    { fixed: 2, variable: 0 },
    { fixed: 2, variable: 2 },
    { fixed: 2, variable: 1 }
  ];
  return {
    pupil: 0.4,
    rayWidth: 0.75,
    nRays: 40,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes,
    weights,
    reverse: false
  };
}
