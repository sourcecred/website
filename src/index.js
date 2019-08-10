// @flow

import React from "react";
import ReactDOM from "react-dom";
import { canvasRender } from "./logoCanvas";
import { render as svgRender } from "./logoSvg";
import { defaultSettings } from "./defaultSettings";
import "./style.css";
import favicon from "./favicon.png";
import { Wrapper } from "./wrapper";
import { type RenderSettings } from "./logo";
import { spiral } from "./rays";

class MiniLogo extends React.Component<{|
  size: number,
  settings?: RenderSettings
|}> {
  render() {
    const size = this.props.size;
    const settings = this.props.settings || defaultSettings();
    function svgGen(g) {
      //g = g.append("g").attr("transform", `translate(${x / 2}, ${x / 2})`);
      svgRender(g, size, settings);
    }
    return (
      <svg width={size} height={size}>
        <Wrapper generator={svgGen} x={0} y={0} />
      </svg>
    );
  }
}

export function miniSettings(): RenderSettings {
  const computes = [spiral(4), spiral(4), spiral(4)];
  const weights = [
    { fixed: 2, variable: 0 },
    { fixed: 2, variable: 2 },
    { fixed: 2, variable: 1 }
  ];
  return {
    pupil: 0.35,
    rayWidth: 0.5,
    nRays: 12,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes,
    weights
  };
}

export class Landing extends React.Component<{}> {
  render() {
    return (
      <div className="container">
        <canvas id="logo-canvas"></canvas>
        <h1>SourceCred</h1>
        <h2 className="no-bottom-margin">a reputation protocol</h2>
        <h2 className="no-top-margin">for open collaboration</h2>

        <p>
          SourceCred creates <em>cred</em>, a project-specific reputation
          metric.
        </p>
        <p>Everyone who participates in the project earns cred.</p>

        <h3>
          <MiniLogo size={32} settings={miniSettings()} />
          Data Driven
        </h3>
        <p>
          Every contribution is counted, from the biggest redesign to the
          smallest typo fix. First-pass scores are calculated using the
          [PageRank algorithm].
        </p>

        <h3>Intersubjective</h3>
        <p>
          No algorithm can capture all the nuances of what makes a project
          successful. That's why everyone in the community helps set priorities,
          recognize important contributions, and calibrate the weights.
        </p>

        <h3>Transparent</h3>
        <p>
          You can always see what the cred scores, and, more importantly, how
          they were calculated.
        </p>

        <h3>
          <img src={favicon} />
          Extensible
        </h3>
        <p>
          Out of the box, SourceCred operates on data from GitHub. It's built
          around a plugin system, so you can extend it to track any
          contributions you can imagine.
        </p>

        <h3>Decentralized</h3>
        <p>
          There's no "CredHub"; just an open-source system that anyone can setup
          and use.
        </p>
      </div>
    );
  }

  componentDidMount() {
    const canvas: any = document.getElementById("logo-canvas");
    canvasRender(canvas, defaultSettings());
  }
}

const wrapper: any = document.getElementById("target");
wrapper ? ReactDOM.render(<Landing />, wrapper) : false;
