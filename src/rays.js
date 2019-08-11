// @flow

import { type RayCompute, type Radians } from "./logo";

const TAU = 2 * Math.PI;

export function spiral(periods: number, offset: ?Radians): RayCompute {
  offset = offset || 0;
  const reverse = periods < 0;
  periods = Math.abs(periods);
  return function(i, rot, nRays) {
    if (reverse) {
      i = nRays - i;
    }
    const periodLength = nRays / periods;
    const rotIndex = ((offset + rot) / TAU) * nRays;
    const r0 = Math.floor(rotIndex) + i;
    const r1 = Math.ceil(rotIndex) + i;
    const f = x => (periodLength - (x % periodLength)) / periodLength;
    const rem = rotIndex - Math.floor(rotIndex);
    return f(r0) * (1 - rem) + f(r1) * rem;
  };
}

export function constant(k: number): RayCompute {
  return function() {
    return k;
  };
}
export function sin(periods: number, offset: ?Radians): RayCompute {
  offset = offset || 0;
  return function(i, rot, nRays) {
    const periodLength = Math.floor(nRays / periods);
    const x = (i / periodLength) * TAU;
    return Math.sin(x + rot + offset) / 2 + 0.5;
  };
}
export function cos(periods: number, offset: ?Radians): RayCompute {
  offset = offset || 0;
  return function(i, rot, nRays) {
    const periodLength = Math.floor(nRays / periods);
    const x = ((i % periodLength) / periodLength) * TAU + offset;
    return Math.cos(x + rot) / 2 + 0.5;
  };
}
export function breathe(periodLength: Radians): RayCompute {
  return function(i, rot, nRays) {
    return Math.sin(rot / periodLength) / 2 + 0.5;
  };
}
