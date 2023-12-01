// Import necessary libraries and components
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./BarChart.scss";
import { ImageCount } from "./typed";
Chart.register(...registerables);



function BarChart({ data }: { data: ImageCount }) {
    // Define the data for your chart

const img_name = Object.keys(data)[0];
const labels = Object.keys(data[img_name])
const count = labels.map((label) => data[img_name][label]["count"])

const chartdata = {
  labels,
  datasets: [
    {
      label: "Count",
      data: count,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.3)",
    },
  ],
};

// Define the options for your chart
const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Liter Breakdown Chtart",
    },
  },
};

  return (
    <div className="chart-container">
      <Bar data={chartdata} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}

export default BarChart;
