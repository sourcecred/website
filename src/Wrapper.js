// @flow

import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";

import { type LogoSettings } from "./logo";

export type Props = {|
  generator: (g: any) => void,
  x: number,
  y: number
|};

export class Wrapper extends React.Component<Props> {
  componentDidMount() {
    const g = select(ReactDOM.findDOMNode(this));
    this.props.generator(g);
  }

  render() {
    return <g transform={`translate(${this.props.x}, ${this.props.y})`} />;
  }
}
