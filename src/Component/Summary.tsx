import React, { useEffect, useState } from "react";
import "./Summary.scss";
import { ApiData, ImageCount } from "./typed";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);

function Summary({ data, updateCount }: { data: ApiData; updateCount: any }) {
  const [chartData, setchartdata] = useState<any>();
  const [chartconfig, setchartconfig] = useState<any>();
    const [isFinished, setisFinished] = useState(false)
  useEffect(() => {
    const img_key = Object.keys(data[0])[0];
    const labels = Object.keys(data[0][img_key]);
    let sum: { [key: string]: number } = {};
    labels.forEach((label) => {
      sum[label] = 0;
    });
    for (const img_data of data) {
      const img_key = Object.keys(img_data)[0];

      for (const label of labels) {
        sum[label] = sum[label] + img_data[img_key][label]["count"];
      }
    }
    const count = labels.map((label) => sum[label]);

    const chartdata = {
      labels,
      datasets: [
        {
          label: "Count",
          data: count,
          borderColor: "rgb(0, 137, 196)",
          backgroundColor: "rgba(0, 137, 196, 0.3)",
        },
      ],
    };
    setchartdata({...chartdata});
    // Define the options for your chart
    const options = {
      // indexAxis: "y" as const,
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Liter Breakdown Chart",
        },
      },
    };
    setchartconfig(options);
    setisFinished(true)
    updateCount(sum);
    return () => {};
  }, []);

  return (
    <div className="Summary">
      <h3>Summary</h3>
      {isFinished && (<Bar data={chartData} options={chartconfig} plugins={[ChartDataLabels]} />)}
    </div>
  );
}

export default Summary;
