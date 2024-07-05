import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const pieChartData = [
  { name: "Christians", value: 2_173_180_000 },
  { name: "Muslims", value: 1_598_510_000 },
  { name: "None", value: 1_126_500_000 },
  { name: "Hindus", value: 1_033_080_000 },
  { name: "Buddhists", value: 487_540_000 },
  { name: "Folk Religionists", value: 405_120_000 },
  { name: "Other Religions", value: 58_110_000 },
  { name: "Jews", value: 13_850_000 },
];

export const combineChartDimensions = (dimensions) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop || 10,
    marginRight: dimensions.marginRight || 10,
    marginBottom: dimensions.marginBottom || 40,
    marginLeft: dimensions.marginLeft || 75,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
      parsedDimensions.marginTop -
      parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
      parsedDimensions.marginLeft -
      parsedDimensions.marginRight,
      0
    ),
  };
};

const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions];

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width !== entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [dimensions, height, width]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

const offsetX = 70;

const PieChart = ({ height, data }) => {
  const [ref, dms] = useChartDimensions({});
  const width = dms.width;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    ...data[0],
    x: 0,
    y: 0,
  });

  // Calculate the total value
  const totalValue = data.reduce((sum, religion) => sum + religion.value, 0);

  // Calculate the percentage for each religion and format the result
  let percentageData = {};
  data.forEach((religion) => {
    percentageData[religion.name] = (
      (religion.value / totalValue) *
      100
    ).toFixed(1);
  });

  // Create the color scale
  const color = d3
    .scaleOrdinal(d3.schemeTableau10)
    .domain(data.map((d) => d.name));

  // Create the pie layout and arc generator.
  const pie = d3.pie().value((d) => d.value);

  const outerRadius = Math.min(width - 2, height - 2) / 2 - offsetX;

  const arc = d3.arc().innerRadius(0).outerRadius(outerRadius);

  // A separate arc generator for labels.
  const labelRadius = arc.outerRadius()() * 0.75;
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pie(data);

  return (
    <div
      ref={ref}
      style={{
        height,
      }}
      className="container"
    >
      <svg
        width={width}
        height={height}
        viewBox={`${-width / 2 + offsetX} ${-height / 2} ${width} ${height}`}
        style={{
          overflow: "visible",
        }}
        className="viz"
      >
        {arcs.map((d, i) => (
          <g
            key={d.data.name}
            stroke="white"
            onMouseOver={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onMouseMove={() => {
              setTooltipData({
                ...data[i],
                x: arcLabel.centroid(d)[0],
                y: arcLabel.centroid(d)[1],
              });
            }}
          >
            <path d={arc(d)} fill={color(data[i].name)} />
            <text
              x={arcLabel.centroid(d)[0]}
              y={arcLabel.centroid(d)[1]}
              textAnchor="middle"
              stroke="none"
              fontSize={16}
              strokeWidth={0}
              fill="white"
            >
              {percentageData[d.data.name] > 5
                ? `${percentageData[d.data.name]}%`
                : ""}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g>
          {data.map((d, i) => {
            const x = outerRadius + 14;
            const y = -height / 2 + i * 20 + 20;

            return (
              <g key={d.name}>
                <rect x={x} y={y} width={20} height={15} fill={color(d.name)} />
                <text
                  x={x}
                  y={y}
                  dx={25}
                  fontSize={14}
                  alignmentBaseline="hanging"
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Tooltip */}
        <g
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          className={`tooltip ${tooltipVisible ? "visible" : ""}`}
        >
          <rect
            width={200}
            height={60}
            x={tooltipData.x - 10}
            y={tooltipData.y + 10}
            stroke="#cccccc"
            strokeWidth="1"
            fill="#ffffff"
          ></rect>
          <g>
            <text
              textAnchor="start"
              x={tooltipData.x}
              y={tooltipData.y + 35}
              fontSize={16}
            >
              {tooltipData.name}
            </text>
          </g>
          <g>
            <text
              textAnchor="start"
              x={tooltipData.x}
              y={tooltipData.y + 55}
              fontSize={16}
              fontWeight="bold"
            >
              {tooltipData.value.toLocaleString()}
              {` (${percentageData[tooltipData.name]}%)`}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

const Pie = () => {
  return <PieChart width={650} height={450} data={pieChartData} />
}

export { Pie }