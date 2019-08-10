// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc, stack } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { interpolate } from "d3-interpolate";
import { interval } from "d3-timer";
import "d3-transition";

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
  const rayWidthRadians = ((2 * Math.PI) / nRays) * rayWidth;

  const toPix = x => ((x / 3) * (1 - pupil) + pupil) * backgroundRadius;
  const arc = d3Arc()
    .startAngle(d => (d.i / nRays) * 2 * Math.PI)
    .endAngle(d => (d.i / nRays) * 2 * Math.PI + rayWidthRadians)
    .innerRadius(d => toPix(d.y0))
    .outerRadius(d => toPix(d.y1))
    .context(ctx);

  const redraw = data => {
    // Add background circle
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = "#3f6385";
    ctx.beginPath();
    ctx.arc(0, 0, backgroundRadius, 0, 2 * Math.PI, true);
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
  interval(() => redrawForOffset((offset += 0.05)), 16);
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
  const computes = [sinCompute(4, Math.PI), sinCompute(6), spiralCompute(2)];
  return canvasRender(canvas, computes, renderSettings);
}

function spiralCompute(periods: number): RayCompute {
  return function(i, nRays) {
    const i0 = Math.floor(i);
    const i1 = i0 + 1;
    const id = i - i0;
    const periodLength = Math.floor(nRays / periods);
    const f = x => 1 - (x % periodLength) / periodLength;
    const y0 = f(i0);
    const y1 = f(i1);
    return y0 * (1 - id) + y1 * id;
  };
}

function constantCompute(k: number): RayCompute {
  return function(i, nRays) {
    return k;
  };
}
function sinCompute(periods: number, offset: ?number): RayCompute {
  offset = offset || 0;
  return function(i, nRays) {
    const periodLength = Math.floor(nRays / periods);
    const x = (i / periodLength) * Math.PI * 2 + offset;
    return Math.sin(x) / 2 + 0.5;
  };
}
function cosCompute(periods: number, offset: ?number): RayCompute {
  offset = offset || 0;
  return function(i, nRays) {
    const periodLength = Math.floor(nRays / periods);
    const x = ((i % periodLength) / periodLength) * Math.PI * 2 + offset;
    return Math.cos(x) / 2 + 0.5;
  };
}
