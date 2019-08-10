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

export type Datum = {|
  +i: number,
  +y0: number,
  +y1: number
|};
export type LogoData = Datum[][];
// Compute the height of a ray given the index, and the number of rays
// the number of rays is so it can get the right harmonics
// the index is an integer in [0, nRays)
// t is a "time parameter" in radians, between 0 and 2 * Math.PI
// the time parameter is used to make rotating / updating logos
export type RayCompute = (i: number, t: number, nRays: number) => number;

export function dataGen(
  nRays: number,
  computes: RayCompute[]
): number => LogoData {
  if (computes.length !== 3) {
    throw new Error("wrong number of computes");
  }
  return function(rot: number): LogoData {
    rot = rot % (Math.PI * 2);
    const lastHeight = new Array(nRays).fill(0);
    return computes.map(c => {
      return range(nRays).map(i => {
        const raySize = c(i, rot, nRays);
        const y0 = lastHeight[i];
        const y1 = y0 + raySize;
        lastHeight[i] = y1;
        return { y0, y1, i };
      });
    });
  };
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
