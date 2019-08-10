// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc, stack } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { interpolate } from "d3-interpolate";
import { interval } from "d3-timer";
import "d3-transition";

export type LogoSettings = {|
  edgeCollapse: number[],
  midCollapse: number[],
  baseCollapse: number[],

  pupil: number,
  base: number,
  mid: number,
  edge: number,

  rayWidth: number,
  nRays: number,

  backgroundColor: string,
  baseColor: string,
  midColor: string,
  edgeColor: string
|};

export function logoData(offset: number, settings: LogoSettings) {
  const {
    pupil,
    base,
    mid,
    edge,
    baseCollapse,
    midCollapse,
    edgeCollapse,
    nRays,
    rayWidth,
    backgroundColor,
    baseColor,
    midColor,
    edgeColor
  } = settings;
  const steps = Math.floor(offset);
  const remainder = offset - steps;
  const data = range(nRays).map(i => {
    const j = steps + i;
    const base0 = baseCollapse[j % baseCollapse.length];
    const base1 = baseCollapse[(j + 1) % baseCollapse.length];
    const mid0 = midCollapse[j % midCollapse.length];
    const mid1 = midCollapse[(j + 1) % midCollapse.length];
    const edge0 = edgeCollapse[j % edgeCollapse.length];
    const edge1 = edgeCollapse[(j + 1) % edgeCollapse.length];
    return {
      i,
      base: base * interpolate(base0, base1)(remainder),
      mid: mid * interpolate(mid0, mid1)(remainder),
      edge: edge * interpolate(edge0, edge1)(remainder)
    };
  });
  const layers = ["base", "mid", "edge"];
  const stacked = stack().keys(layers)(data);
  return stacked;
}

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
