import { svg } from "./svg";
import { logo } from "./logo";

const width = 1125;
const height = 2436;

function design(g) {
  const size = 768;
  const x = (width - size) / 2;
  const y = ((height - size) * 2) / 3;
  g = g.append("g").attr("transform", `translate(${x}, ${y})`);
  logo(g, size);
}

console.log(svg(design, width, height));
