// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import { arc as d3Arc } from "d3-shape";

export type Props = {|
  size: number
|};

type LogoSettings = {|
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
  pupil: 0.35,
  base: 0.45,
  mid: 0.7,
  edge: 0.9,

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

function logo(g, size: number, settings) {
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
  const pupilRadius = pupil * backgroundRadius;
  const baseRadius = base * backgroundRadius;
  const midRadius = mid * backgroundRadius;
  const edgeRadius = edge * backgroundRadius;

  const internal = g
    .append("g")
    .attr("transform", `translate(${size / 2}, ${size / 2})`);

  // Add background circle
  internal
    .append("circle")
    .attr("fill", backgroundColor)
    .attr("r", backgroundRadius);

  for (let i = 0; i < nRays; i++) {
    const offset = (i / nRays) * 2 * Math.PI;
    const w0 = ((2 * Math.PI) / nRays) * rayWidth;
    const arc = d3Arc()
      .startAngle(offset)
      .endAngle(offset + w0);
    function addArc(innerRadius, outerRadius, color) {
      internal
        .append("path")
        .attr("d", arc({ innerRadius, outerRadius }))
        .attr("fill", color);
    }
    const baseDelta = baseRadius - pupilRadius;
    const actualBaseRadius =
      pupilRadius + baseDelta * baseCollapse[i % baseCollapse.length];
    const midDelta = midRadius - baseRadius;
    const actualMidRadius =
      actualBaseRadius + midDelta * midCollapse[i % midCollapse.length];
    const edgeDelta = edgeRadius - midRadius;
    const actualEdgeRadius =
      actualMidRadius + edgeDelta * edgeCollapse[i % edgeCollapse.length];
    addArc(pupilRadius, actualBaseRadius, baseColor);
    addArc(actualBaseRadius, actualMidRadius, midColor);
    addArc(actualMidRadius, actualEdgeRadius, edgeColor);
  }
}

export class Logo extends React.Component<Props> {
  componentDidMount() {
    const svg = select(ReactDOM.findDOMNode(this));
    logo(svg, this.props.size, defaultSettings);
  }

  render() {
    return (
      <svg width={this.props.size + "px"} height={this.props.size + "px"} />
    );
  }
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
