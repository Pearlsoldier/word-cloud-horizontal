import * as d3 from "https://cdn.skypack.dev/d3@7";
import { cloud } from "https://code4fukui.github.io/d3-cloud-es/index.js";

export const createWordCloud = async (container, data) => {
  if (!Array.isArray(data)) {
    data = data.split(" ");
  }

  await new Promise((resolve) => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    
    const randomColor = () => {
      return `hsl(${Math.random() * 360} 55% 50%)`;
    };
    const create = (layout, words) => {
      d3.select(container)
        .append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", d => d.size + "px")
          //.style("font-family", "Impact")
          .style("fill", (d, i) => randomColor())
          .attr("text-anchor", "middle")
          .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
          .text(d => d.text);
      resolve();
    };

    //const max = data.reduce((p, c) => p < c.value ? c.value : p, 0);
    const max = data.length;
    const size = (value) => {
      /*
      if (value > max / 4 * 3) {
        return 80;
      } else if (value > max / 4 * 2) {
        return 60;
      } else if (value > max / 4 * 1) {
        return 50;
      } else {
        return 10;
      }
      */
      if (value < 5) {
        return 80;
      } else if (value < 10) {
        return 60;
      } else if (value < 30) {
        return 40;
      } else if (value < 60) {
        return 15;
      } else {
        return 10;
      }
    };

    const layout = cloud()
      .size([w, h])
      .words(data.map((d, i) => ({ text: d.text ? d.text : d, size: size(/*d.value*/i) }))) // text, size
      .padding(1)
      .rotate(function() { return 0; })
      //.font("Impact")
      .fontSize(d => d.size)
      .on("end", (words) => create(layout, words));
    layout.start();

  });
};
