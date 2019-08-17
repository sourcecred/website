// @flow

import { type RenderSettings } from "./logo";
import { spiral } from "./rays";

export function defaultSettings(): RenderSettings {
  const computes = [spiral(10), spiral(10), spiral(10)];
  const weights = [
    { fixed: 2, variable: 1 },
    { fixed: 2, variable: 6 },
    { fixed: 3, variable: 4 },
  ];
  return {
    pupil: 0.4,
    rayWidth: 0.75,
    nRays: 20,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes,
    weights,
    reverse: false,
  };
}
