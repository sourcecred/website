// @flow

import React from "react";
import ReactDOM from "react-dom";
import deepFreeze from "deep-freeze";
import { canvasRender } from "./logoCanvas";
import { render as svgRender } from "./logoSvg";
import { defaultSettings } from "./defaultSettings";
import "./style.css";
import favicon from "./favicon.png";
import { Wrapper } from "./wrapper";
import { type RenderSettings } from "./logo";
import { spiral, cos, sin } from "./rays";

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

const settings: { [string]: RenderSettings } = deepFreeze({
  sectionDataDriven: {
    pupil: 0.35,
    rayWidth: 0.65,
    nRays: 40,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [spiral(4), spiral(4), spiral(4)],
    weights: [
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 2 },
      { fixed: 2, variable: 1 }
    ],
    reverse: false
  },
  sectionTransparent: {
    pupil: 0.35,
    rayWidth: 0.7,
    nRays: 12,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [spiral(6), spiral(3), spiral(4)],
    weights: [
      { fixed: 1, variable: 0 },
      { fixed: 1, variable: 0 },
      { fixed: 1, variable: 0 }
    ],
    reverse: false
  },
  sectionExtensible: {
    pupil: 0.35,
    rayWidth: 0.5,
    nRays: 40,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [cos(4), cos(8), cos(4)],
    weights: [
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 }
    ],
    reverse: false
  },
  sectionDecentralized: {
    pupil: 0.45,
    rayWidth: 1,
    nRays: 20,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [spiral(4), sin(4), sin(4, Math.PI)],
    weights: [
      { fixed: 0.5, variable: 0 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 }
    ],
    reverse: false
  },
  sectionIntersubjective: {
    pupil: 0.35,
    rayWidth: 0.8,
    nRays: 40,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [cos(8), cos(4), cos(8)],
    weights: [
      { fixed: 1, variable: 1 },
      { fixed: 1, variable: 1 },
      { fixed: 1, variable: 1 }
    ],
    reverse: false
  }
});

function Section(props: {| +settings: RenderSettings, +children: any |}) {
  const settings = props.settings;
  const settingsReverse = { ...settings, reverse: !settings.reverse };
  return (
    <h3>
      <MiniLogo size={48} settings={settings} />
      {props.children}
      <MiniLogo size={48} settings={settingsReverse} />
    </h3>
  );
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

        <Section settings={settings.sectionDataDriven}>Data Driven</Section>
        <p>
          Every contribution is counted, from the biggest redesign to the
          smallest typo fix. First-pass scores are calculated using the
          [PageRank algorithm].
        </p>

        <Section settings={settings.sectionIntersubjective}>
          Intersubjective
        </Section>
        <p>
          No algorithm can capture all the nuances of what makes a project
          successful. That's why everyone in the community helps set priorities,
          recognize important contributions, and calibrate the weights.
        </p>

        <Section settings={settings.sectionTransparent}>Transparent</Section>
        <p>
          You can always see what the cred scores, and, more importantly, how
          they were calculated.
        </p>

        <Section settings={settings.sectionExtensible}>Extensible</Section>
        <p>
          Out of the box, SourceCred operates on data from GitHub. It's built
          around a plugin system, so you can extend it to track any
          contributions you can imagine.
        </p>

        <Section settings={settings.sectionDecentralized}>
          Decentralized
        </Section>
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
