// @flow

import { JSDOM } from "jsdom";

import { logo } from "./logo";
import { select } from "d3-selection";
import { fs } from "fs";

const fakeDom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
let body = select(fakeDom.window.document).select("body");

// Make an SVG Container
let svgContainer = body
  .append("div")
  .attr("class", "container")
  .append("svg")
  .attr("width", 1280)
  .attr("height", 1024);

// Draw a line
let circle = svgContainer
  .append("line")
  .attr("x1", 5)
  .attr("y1", 5)
  .attr("x2", 500)
  .attr("y2", 500)
  .attr("stroke-width", 2)
  .attr("stroke", "black");

// Output the result to console
console.log(body.select(".container").html());
