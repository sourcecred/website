// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { interpolate } from "d3-interpolate";
import { interval } from "d3-timer";
import "d3-transition";

const TAU = 2 * Math.PI;

import {
  type RayCompute,
  type LogoData,
  dataGen,
  type RayWeight,
  type RenderSettings
} from "./logo";

export function canvasRender(
  canvas: HTMLCanvasElement,
  renderSettings: RenderSettings
) {
  const {
    pupil,
    rayWidth,
    backgroundColor,
    baseColor,
    midColor,
    edgeColor,
    nRays,
    computes,
    weights
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
    const size = Math.min(rect.height, rect.width);
    ctx.translate(size / 2, size / 2);
    return { ctx, size };
  }

  const { ctx, size } = setupCanvas(canvas);
  const backgroundRadius = (size / Math.sqrt(2)) * 0.7;

  const colors = [baseColor, midColor, edgeColor];
  const rayWidthRadians = (TAU / nRays) * rayWidth;

  const toPix = x => (x * (1 - pupil) * 0.9 + pupil) * backgroundRadius;
  const arc = d3Arc()
    .startAngle(d => (-d.i / nRays) * TAU)
    .endAngle(d => (-d.i / nRays) * TAU - rayWidthRadians)
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

    const pupilColor = "#111c27";
    ctx.fillStyle = pupilColor;
    ctx.strokeStyle = pupilColor;
    ctx.beginPath();
    ctx.arc(0, 0, pupil * backgroundRadius, 0, TAU, true);
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

  const gen = dataGen(nRays, computes, weights);
  const redrawForOffset = o => redraw(gen(o));
  let offset = 0;
  redrawForOffset(offset);
  interval(() => redrawForOffset((offset += 0.002)), 16);
}
