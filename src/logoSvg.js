// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc, stack } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { interpolate } from "d3-interpolate";
import { interval } from "d3-timer";
import "d3-transition";

import { type RenderSettings, type LogoData, dataGen } from "./logo";

const TAU = 2 * Math.PI;

export function render(g: any, size: number, settings: RenderSettings) {
  const data = dataGen(settings.nRays, settings.computes, settings.weights)(0);
  const {
    nRays,
    rayWidth,
    pupil,
    backgroundColor,
    baseColor,
    midColor,
    edgeColor,
    pupilColor,
    reverse,
  } = settings;

  const backgroundRadius = (size / Math.sqrt(2)) * 0.7;
  const internal = g
    .append("g")
    .attr("transform", `translate(${size / 2}, ${size / 2})`);

  // Add background circle
  internal
    .append("circle")
    .attr("fill", backgroundColor)
    .attr("r", backgroundRadius);

  // Add the pupil
  internal
    .append("circle")
    .attr("fill", pupilColor)
    .attr("r", backgroundRadius * pupil);

  const layers = ["base", "mid", "edge"];
  const color = scaleOrdinal()
    .domain(layers)
    .range([baseColor, midColor, edgeColor]);
  const width = (TAU / nRays) * rayWidth;

  const toPix = (x) => (x * (1 - pupil) * 0.9 + pupil) * backgroundRadius;
  const reverseMult = reverse ? 1 : -1;
  const arc = d3Arc()
    .startAngle((d) => ((reverseMult * d.i) / nRays) * TAU)
    .endAngle((d) => ((reverseMult * d.i) / nRays) * TAU - width)
    .innerRadius((d) => toPix(d.y0))
    .outerRadius((d) => toPix(d.y1));

  layers.forEach((layer, layer_index) => {
    const rays = internal
      .selectAll(`.ray-${layer}`)
      .data(data[layer_index], (d) => d.i + "-" + layer);

    rays
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(layer));
  });
}
