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

export function canvasRender(
  canvas: HTMLCanvasElement,
  settings: LogoSettings
) {
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
    return { ctx, width: rect.width, height: rect.height };
  }

  const { ctx, height, width } = setupCanvas(canvas);
  console.log(ctx, canvas);
  const size = Math.min(height, width);
  const backgroundRadius = (size / Math.sqrt(2)) * 0.7;

  const layers = ["base", "mid", "edge"];
  const color = scaleOrdinal()
    .domain(layers)
    .range([baseColor, midColor, edgeColor]);
  const rayWidthRadians = ((2 * Math.PI) / nRays) * rayWidth;

  const arc = d3Arc()
    .startAngle(d => (d.data.i / nRays) * 2 * Math.PI)
    .endAngle(d => (d.data.i / nRays) * 2 * Math.PI + rayWidthRadians)
    .innerRadius(d => (d[0] + pupil) * backgroundRadius)
    .outerRadius(d => (d[1] + pupil) * backgroundRadius)
    .context(ctx);

  ctx.translate(size / 2, size / 2);
  const redraw = data => {
    console.log("redraw");
    // Add background circle
    /*
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = "#3f6385";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, backgroundRadius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
    */
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = "#3f6385";
    ctx.beginPath();
    d3Arc()
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .innerRadius(0)
      .outerRadius(backgroundRadius)
      .context(ctx)();
    ctx.fill();
    ctx.closePath();

    data.reverse().forEach(layer => {
      const f = color(layer.key);
      ctx.strokeStyle = f;
      ctx.fillStyle = f;
      layer.forEach(d => {
        ctx.beginPath();
        arc(d);
        ctx.fill();
        ctx.closePath();
      });
    });
  };

  const redrawForOffset = o => {
    const data = logoData(offset, settings);
    redraw(data);
  };
  let offset = 0;
  redrawForOffset(offset);
  interval(() => redrawForOffset((offset += 0.03)), 16);
}

function logoData(offset: number, settings: LogoSettings) {
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
