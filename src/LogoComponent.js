// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";

import { logo, type LogoSettings } from "./logo";

export type Props = {|
  size: number,
  settings: LogoSettings,
  x: number,
  y: number
|};

export class Logo extends React.Component<Props> {
  componentDidMount() {
    const g = select(ReactDOM.findDOMNode(this));
    logo(g, this.props.size, this.props.settings);
  }

  render() {
    return <g transform={`translate(${this.props.x}, ${this.props.y})`} />;
  }
}
