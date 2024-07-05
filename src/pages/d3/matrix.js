import React, { useRef, useEffect } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@d3/brushable-scatterplot-matrix";

// https://observablehq.com/@d3/brushable-scatterplot-matrix

function BrushableScatterplotMatrix() {
  const chartRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, name => {
      if (name === "chart") return new Inspector(chartRef.current);
      return ["selection"].includes(name);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={chartRef} />
      <p>Credit: <a href="https://observablehq.com/@d3/brushable-scatterplot-matrix@latest">Brushable scatterplot matrix by D3</a></p>
    </>
  );
}

export { BrushableScatterplotMatrix };