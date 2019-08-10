// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc, stack } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { interpolate } from "d3-interpolate";
import { interval } from "d3-timer";
import "d3-transition";

export type Radians = number;
const TAU = 2 * Math.PI;

import { type RayCompute, type LogoData, dataGen } from "./logo";

export type DataSettings = {|
  +base: RayCompute,
  +mid: RayCompute,
  +edge: RayCompute
|};

export type RenderSettings = {|
  pupil: number,
  rayWidth: number,
  nRays: number,

  backgroundColor: string,
  baseColor: string,
  midColor: string,
  edgeColor: string
|};

export function canvasRender(
  canvas: HTMLCanvasElement,
  computes: RayCompute[],
  renderSettings: RenderSettings
) {
  const {
    pupil,
    rayWidth,
    backgroundColor,
    baseColor,
    midColor,
    edgeColor,
    nRays
  } = renderSettings;

  function setupCanvas(canvas: HTMLCanvasElement) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    console.log(rect, dpr, canvas);
    const size = Math.min(rect.height, rect.width);
    ctx.translate(size / 2, size / 2);
    return { ctx, size };
  }

  const { ctx, size } = setupCanvas(canvas);
  const backgroundRadius = (size / Math.sqrt(2)) * 0.7;

  const colors = [baseColor, midColor, edgeColor];
  const rayWidthRadians = (TAU / nRays) * rayWidth;

  const toPix = x => ((x / 3) * (1 - pupil) + pupil) * backgroundRadius;
  const arc = d3Arc()
    .startAngle(d => (d.i / nRays) * TAU)
    .endAngle(d => (d.i / nRays) * TAU + rayWidthRadians)
    .innerRadius(d => toPix(d.y0))
    .outerRadius(d => toPix(d.y1))
    .context(ctx);

  const redraw = data => {
    // Add background circle
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = "#3f6385";
    ctx.beginPath();
    ctx.arc(0, 0, backgroundRadius, 0, TAU, true);
    ctx.fill();
    ctx.closePath();

    data.forEach((layer, i) => {
      ctx.strokeStyle = colors[i];
      ctx.fillStyle = colors[i];
      layer.forEach(x => {
        ctx.beginPath();
        arc(x);
        ctx.fill();
        ctx.closePath();
      });
    });
  };

  const gen = dataGen(nRays, computes);
  const redrawForOffset = o => redraw(gen(o));
  let offset = 0;
  redrawForOffset(offset);
  interval(() => redrawForOffset((offset += 0.005)), 16);
}

export function defaultCanvasRender(canvas: HTMLCanvasElement) {
  const renderSettings: RenderSettings = {
    pupil: 0.4,
    rayWidth: 0.5,
    nRays: 120,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c"
  };
  const computes = [spiral(4), spiral(6), spiral(4)];
  return canvasRender(canvas, computes, renderSettings);
}

function spiral(periods: number, offset: ?Radians): RayCompute {
  offset = offset || 0;
  return function(i, rot, nRays) {
    const periodLength = nRays / periods;
    const rotIndex = ((offset + rot) / TAU) * nRays;
    const r0 = Math.floor(rotIndex) + i;
    const r1 = Math.ceil(rotIndex) + i;
    const f = x => (periodLength - (x % periodLength)) / periodLength;
    const rem = rotIndex - Math.floor(rotIndex);
    return f(r0) * (1 - rem) + f(r1) * rem;
  };
}

function spiralReverse(periods: number, offset: ?Radians): RayCompute {
  const s = spiral(periods, offset);
  return (i, rot, nRays) => s(nRays - i, rot, nRays);
}

function constant(k: number): RayCompute {
  return function() {
    return k;
  };
}
function sin(periods: number, offset: ?Radians): RayCompute {
  offset = offset || 0;
  return function(i, rot, nRays) {
    const periodLength = Math.floor(nRays / periods);
    const x = (i / periodLength) * TAU;
    return Math.sin(x + rot) / 2 + 0.5;
  };
}
function cos(periods: number, offset: ?Radians): RayCompute {
  offset = offset || 0;
  return function(i, rot, nRays) {
    const periodLength = Math.floor(nRays / periods);
    const x = ((i % periodLength) / periodLength) * TAU + offset;
    return Math.cos(x + rot) / 2 + 0.5;
  };
}
function breathe(periodLength: Radians): RayCompute {
  return function(i, rot, nRays) {
    return Math.sin(rot / periodLength) / 2 + 0.5;
  };
}
