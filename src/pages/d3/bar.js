import { useEffect } from "react";
import * as d3 from "d3";

const marginTop = 30;
const marginBottom = 70;
const marginLeft = 50;
const marginRight = 25;
const oneMillion = 1_000_000;

const data = [
  { country: "India", population: 1_417_173_173, city: "Kiev" },
  { country: "China", population: 1_412_175_000, city: "Zhora" },
  { country: "United States", population: 333_287_557, city: "Gena" },
  { country: "Indonesia", population: 275_501_339, city: "Vova" },
  { country: "Pakistan", population: 235_824_862, city: "Lviv" },
  { country: "Nigeria", population: 218_541_212, city: "Petr" },
  { country: "Brazil", population: 215_313_498, city: "Test" },
  { country: "Bangladesh", population: 171_186_372, city: "Odessa" },
  { country: "Russia", population: 144_236_933, city: "Ivan" },
  { country: "Mexico", population: 127_504_125, city: "York" },
  { country: "Japan", population: 125_124_989, city: "London" },
  { country: "Ethiopia", population: 123_379_924, city: "California" },
];

const BarChart = ({ width, height, data }) => {
  const chartBottomY = height - marginBottom;

  // Create the horizontal scale and its axis generator.
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  // Create the vertical scale and its axis generator.
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.population / oneMillion)])
    .nice()
    .range([chartBottomY, marginTop]);

  const yAxis = d3.axisLeft(yScale);

  useEffect(() => {
    d3.select(".x-axis")
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "14px")
      // Rotate the labels to make them easier to read.
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");
    d3.select(".y-axis")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "14px");
  }, [xAxis, yAxis]);

  return (
    <div className="container">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="viz"
      >
        <g className="bars">
          {data.map((d) => (
            <rect
              key={d.country}
              x={xScale(d.country)}
              y={yScale(d.population / oneMillion)}
              height={chartBottomY - yScale(d.population / oneMillion)}
              width={xScale.bandwidth()}
              fill="#6baed6"
            />
          ))}
        </g>
        <g className="x-axis" transform={`translate(0,${chartBottomY})`}></g>
        <g className="y-axis" transform={`translate(${marginLeft},0)`}></g>
      </svg>
    </div>
  );
};

const Bar = () => {
  return <BarChart data={data} width={700} height={500} />
}

export { Bar }