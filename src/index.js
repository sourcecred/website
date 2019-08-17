// @flow

import React from "react";
import ReactDOM from "react-dom";
import deepFreeze from "deep-freeze";
import { canvasRender } from "./logoCanvas";
import { render as svgRender } from "./logoSvg";
import { defaultSettings } from "./defaultSettings";
import "./style.css";
import favicon from "./favicon.png";
import { Wrapper } from "./Wrapper";
import { type RenderSettings } from "./logo";
import { spiral, cos, sin } from "./rays";

const TAU = Math.PI * 2;
class MiniLogo extends React.Component<{|
  size: number,
  settings?: RenderSettings,
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

function ButtonLink(props) {
  return (
    <div className="button-link-container">
      <a className="button-link" href={props.href}>
        {props.children}
      </a>
    </div>
  );
}

const settings: { [string]: RenderSettings } = deepFreeze({
  sectionDataDriven: {
    pupil: 0.35,
    rayWidth: 0.65,
    nRays: 70,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes: [spiral(2), spiral(2), spiral(2)],
    weights: [
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 },
    ],
    reverse: false,
  },
  sectionTransparent: {
    pupil: 0.35,
    rayWidth: 0.2,
    nRays: 60,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes: [spiral(-30), spiral(-15), spiral(-30)],
    weights: [
      { fixed: 1, variable: 1 },
      { fixed: 1, variable: 1 },
      { fixed: 1, variable: 1 },
    ],
    reverse: false,
  },
  sectionExtensible: {
    pupil: 0.35,
    rayWidth: 0.5,
    nRays: 80,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes: [cos(4), cos(8), cos(4)],
    weights: [
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 2 },
    ],
    reverse: false,
  },
  sectionCommunity: {
    pupil: 0.35,
    rayWidth: 0.85,
    nRays: 77,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes: [sin(3), sin(7, Math.PI), sin(7)],
    weights: [
      { fixed: 1, variable: 0 },
      { fixed: 0, variable: 2 },
      { fixed: 0, variable: 1 },
    ],
    reverse: false,
  },
  sectionDecentralized: {
    pupil: 0.35,
    rayWidth: 1,
    nRays: 80,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes: [sin(1), sin(1, Math.PI), spiral(4)],
    weights: [
      { fixed: 0.5, variable: 1 },
      { fixed: 0, variable: 1 },
      { fixed: 0, variable: 4 },
    ],
    reverse: false,
  },
  sectionIntersubjective: {
    pupil: 0.35,
    rayWidth: 0.9,
    nRays: 120,
    backgroundColor: "#282d48",
    baseColor: "#ffbc95",
    midColor: "#e7a59a",
    edgeColor: "#87738c",
    pupilColor: "#111c27",
    computes: [cos(6), cos(7), spiral(6)],
    weights: [
      { fixed: 1, variable: 0 },
      { fixed: 0, variable: 2 },
      { fixed: 0, variable: 3 },
    ],
    reverse: false,
  },
});

function Card(props: {|
  +settings: RenderSettings,
  title: string,
  children: any,
|}) {
  return (
    <div className="card">
      <MiniLogo size={200} settings={props.settings} />
      <h3>{props.title}</h3>
      {props.children}
    </div>
  );
}

export class Landing extends React.Component<{}> {
  render() {
    return (
      <div className="container">
        <div>
          <canvas id="logo-canvas"></canvas>
          <h1 id="topline">SourceCred</h1>
          <div id="tagline">
            <h2 className="tagline" id="tagline-top">
              a reputation protocol
            </h2>
            <h2 className="tagline" id="tagline-bottom">
              for open collaboration
            </h2>
          </div>
          <div className="outlinks-grid">
            <ButtonLink href="https://discourse.sourcecred.io">
              forums
            </ButtonLink>
            <ButtonLink href="https://discord.gg/tsBTgc9">chat</ButtonLink>
            <ButtonLink href="https://github.com/sourcecred/sourcecred">
              github
            </ButtonLink>
            <ButtonLink href="https://twitter.com/sourcecred">
              twitter
            </ButtonLink>
            <ButtonLink href="https://sourcecred.io/cred/timeline/@sourcecred/">
              prototype
            </ButtonLink>
          </div>
        </div>

        <div id="how-sourcecred-works">
          <h2 class="section-header">how SourceCred works</h2>

          <p>
            Everything people do to support a project—like writing code, filing
            bug reports, organizing meetups, or even mediating hard
            discussions—is considered a <b>contribution</b>.
          </p>

          <p>
            These contributions are connected to each other based on their
            relationships. For example, a pull request may fix a particular bug,
            and a code review may review that pull request.
          </p>

          <p>
            This network of contributions and relationships form a{" "}
            <b>contribution graph</b>. SourceCred applies the{" "}
            <a href="https://en.wikipedia.org/wiki/PageRank">
              PageRank algorithm
            </a>{" "}
            to this graph, generating a score, called <b>cred</b> for every
            contribution.
          </p>

          <p>
            The basic idea is: a contribution earns cred if it is connected to
            other contributions that earn lots of cred. Contributors are
            connected to the contributions they've helped with, which means that
            they also earn cred.
          </p>

          <p>
            The project's community and maintainers have a lot of influence over
            this process. They can reconfigure SourceCred weights and
            parameters. For example, they could assign extra weight to some very
            important contributions, or decrease the weights of contributions
            that seem spammy. They can also add <b>heuristics</b> to do this
            automatically.
          </p>
        </div>

        <h2 class="section-header">properties</h2>
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
              Each project community sets the values, priorities, weights, and
              norms.
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
              set up and use.
            </p>
          </Card>
          <Card
            settings={settings.sectionIntersubjective}
            title="Intersubjective"
          >
            <p>
              Scores are a blend of objective data and subjective judgement.
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
