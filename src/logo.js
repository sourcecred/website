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

const defaultSettings: LogoSettings = {
  pupil: 0.4,
  base: 0.1,
  mid: 0.2,
  edge: 0.3,

  baseCollapse: spiralLength(36),
  midCollapse: spiralLength(18),
  edgeCollapse: spiralLength(9),
  rayWidth: 0.75,
  nRays: 72,
  backgroundColor: "#20364a",
  baseColor: "#ffbc95",
  midColor: "#e7a59a",
  edgeColor: "#87738c"
};

export function logo(g: any, size: number, settings: ?LogoSettings) {
  if (settings == null) settings = defaultSettings;
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

  const redraw = offset => {
    const data = range(nRays).map(i => {
      const j = i + (72 - (offset % 72));
      return {
        i,
        base: base * baseCollapse[j % baseCollapse.length],
        mid: mid * midCollapse[j % midCollapse.length],
        edge: edge * edgeCollapse[j % edgeCollapse.length]
      };
    });
    console.log(`offset: ${offset}, base: ${data[0].base}`);

    const layers = ["base", "mid", "edge"];
    const stacked = stack().keys(layers)(data);
    const color = scaleOrdinal()
      .domain(layers)
      .range([baseColor, midColor, edgeColor]);

    const width = ((2 * Math.PI) / nRays) * rayWidth;
    const arc = d3Arc()
      .startAngle(d => (d.data.i / nRays) * 2 * Math.PI)
      .endAngle(d => (d.data.i / nRays) * 2 * Math.PI + width)
      .innerRadius(d => (d[0] + pupil) * backgroundRadius)
      .outerRadius(d => (d[1] + pupil) * backgroundRadius);

    function arcTween(data, layer) {
      return function(d) {
        const [bot0, top0] = this._current;
        const [bot1, top1] = d;
        this._current = d;
        const botI = interpolate(bot0, bot1);
        const topI = interpolate(top0, top1);
        return function(t) {
          d[0] = botI(t);
          d[1] = topI(t);
          return arc(d);
        };
      };
    }

    layers.forEach((layer, layer_index) => {
      const rays = internal
        .selectAll(`.ray-${layer}`)
        .data(stacked[layer_index], d => d.data.i + "-" + layer);

      rays
        .transition()
        .duration(1000)
        .attrTween("d", arcTween(stacked[layer_index]));

      rays
        .enter()
        .append("path")
        .each(function(d) {
          this._current = d;
        })
        //      .attr("d", arc)
        .attr("class", d => `ray-${layer}`)
        .attr("fill", d => color(layer));
    });
  };
  let k = 0;
  interval(() => redraw((k += 1)), 1000);
  redraw(0);
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
