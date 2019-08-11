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
    nRays: 70,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [spiral(2), spiral(2), spiral(2)],
    weights: [
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 }
    ],
    reverse: false
  },
  sectionTransparent: {
    pupil: 0.35,
    rayWidth: 0.2,
    nRays: 60,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [spiral(-30), spiral(-15), spiral(-30)],
    weights: [
      { fixed: 1, variable: 1 },
      { fixed: 1, variable: 1 },
      { fixed: 1, variable: 1 }
    ],
    reverse: false
  },
  sectionExtensible: {
    pupil: 0.35,
    rayWidth: 0.5,
    nRays: 80,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [cos(4), cos(8), cos(4)],
    weights: [
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 2 }
    ],
    reverse: false
  },
  sectionCommunity: {
    pupil: 0.35,
    rayWidth: 0.85,
    nRays: 77,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [sin(3), sin(7, Math.PI), sin(7)],
    weights: [
      { fixed: 1, variable: 0 },
      { fixed: 0, variable: 2 },
      { fixed: 0, variable: 1 }
    ],
    reverse: false
  },
  sectionDecentralized: {
    pupil: 0.45,
    rayWidth: 1,
    nRays: 80,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [sin(4), sin(4, Math.PI), spiral(4)],
    weights: [
      { fixed: 0.5, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 }
    ],
    reverse: false
  },
  sectionIntersubjective: {
    pupil: 0.35,
    rayWidth: 0.8,
    nRays: 120,
    backgroundColor: "#20364a",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    computes: [cos(6), cos(7), spiral(6)],
    weights: [
      { fixed: 1, variable: 0 },
      { fixed: 0, variable: 2 },
      { fixed: 0, variable: 3 }
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
      <span className="sectionText">{props.children}</span>
      <MiniLogo size={48} settings={settingsReverse} />
    </h3>
  );
}

function Card(props: {|
  +settings: RenderSettings,
  title: string,
  children: any
|}) {
  return (
    <div className="card">
      <MiniLogo size={128} settings={props.settings} />
      <h3>{props.title}</h3>
      {props.children}
    </div>
  );
}

export class Landing extends React.Component<{}> {
  render() {
    return (
      <div className="container">
        <canvas id="logo-canvas"></canvas>
        <h1 id="topline">SourceCred</h1>
        <h2 className="no-bottom-margin">a reputation protocol</h2>
        <h2 className="no-top-margin">for open collaboration</h2>

        <p>
          SourceCred creates <em>cred</em>, a project-specific reputation
          metric.
        </p>
        <p>Everyone who participates in the project earns cred.</p>

        <div className="card-container">
          <Card settings={settings.sectionDataDriven} title={"Data Driven"}>
            <p>
              Scores are calculated using data from a project: forum posts,
              commits, comments, and more.
            </p>
          </Card>

          <Card
            settings={settings.sectionCommunity}
            title="Community Controlled"
          >
            <p>
              Every instance is controlled by the project's community. They set
              the values, priorities, and the weights.
            </p>
          </Card>

          <Card settings={settings.sectionTransparent} title="Transparent">
            <p>You can see what every score is, and more importantly, why.</p>
          </Card>

          <Card settings={settings.sectionExtensible} title="Extensible">
            <p>
              SourceCred is built around a plugin architecture. You can extend
              it to track any kind of contribution.
            </p>
          </Card>

          <Card settings={settings.sectionDecentralized} title="Decentralized">
            <p>
              There's no "CredHub"; just an open-source system that anyone can
              setup and use.
            </p>
          </Card>
          <Card
            settings={settings.sectionIntersubjective}
            title="Intersubjective"
          >
            <p>
              SourceCred mixes objective data about contributions with
              subjective human judgements of what matters, and why.
            </p>
          </Card>
        </div>
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
