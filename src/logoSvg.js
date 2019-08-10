// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc, stack } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { interpolate } from "d3-interpolate";
import { interval } from "d3-timer";
import "d3-transition";

import { type LogoSettings } from "./logo";
import { logoData } from "./logo";

export function render(g: any, size: number, settings: LogoSettings) {
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

  const backgroundRadius = (size / Math.sqrt(2)) * 0.7;
  const internal = g
    .append("g")
    .attr("transform", `translate(${size / 2}, ${size / 2})`);

  // Add background circle
  internal
    .append("circle")
    .attr("fill", backgroundColor)
    .attr("stroke", "#3f6385")
    .attr("stroke-width", 2)
    .attr("r", backgroundRadius);

  const layers = ["base", "mid", "edge"];
  const color = scaleOrdinal()
    .domain(layers)
    .range([baseColor, midColor, edgeColor]);
  const width = ((2 * Math.PI) / nRays) * rayWidth;

  const arc = d3Arc()
    .startAngle(d => (d.data.i / nRays) * 2 * Math.PI)
    .endAngle(d => (d.data.i / nRays) * 2 * Math.PI + width)
    .innerRadius(d => (d[0] + pupil) * backgroundRadius)
    .outerRadius(d => (d[1] + pupil) * backgroundRadius);

  const redraw = data => {
    layers.forEach((layer, layer_index) => {
      const rays = internal
        .selectAll(`.ray-${layer}`)
        .data(data[layer_index], d => d.data.i + "-" + layer);

      rays
        .enter()
        .append("path")
        .each(function(d) {
          this._current = d;
        })
        .attr("d", arc)
        .attr("class", d => `ray-${layer}`)
        .attr("fill", d => color(layer));
    });
  };

  let k = 0;
}
