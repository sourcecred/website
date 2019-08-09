// @flow

import { JSDOM } from "jsdom";

import { select } from "d3-selection";
import { fs } from "fs";

export function svg(
  generator: (selection: any) => void,
  width: ?number,
  height: ?number
): string {
  const fakeDom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  let body = select(fakeDom.window.document).select("body");

  // Make an SVG Container
  let container = body.append("div").attr("class", "container");
  let svg = container.append("svg").attr("xmlns", "http://www.w3.org/2000/svg");
  if (width) svg.attr("width", width);
  if (height) svg.attr("height", height);

  generator(svg);

  const header = `<?xml version="1.0" encoding="UTF-8"?>`;
  const contents = body.select(".container").html();
  return `${header}\n${contents}`;
}
