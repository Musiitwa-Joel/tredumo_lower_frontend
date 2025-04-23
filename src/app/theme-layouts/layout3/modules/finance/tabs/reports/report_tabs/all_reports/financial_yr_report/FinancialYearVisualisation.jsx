import React from "react";
import ReactECharts from "echarts-for-react"; // Import the ECharts component

const FinancialYearVisualisation = () => {
  // Data for revenue distribution
  const data = [
    { value: 15000, name: "B.Sc. Computer Science" },
    { value: 12000, name: "B.IT" },
    { value: 8000, name: "DCS" },
    { value: 6000, name: "DIT" },
    { value: 4000, name: "CIT" },
  ];

  // Option configuration for the half-donut chart
  const option = {
    title: {
      left: "center",
      top: "20",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: UGX {c} ({d}%)", // Display name, value, and percentage
    },
    series: [
      {
        name: "Revenue",
        type: "pie",
        radius: ["50%", "90%"], // Make it a donut by setting inner and outer radius
        center: ["50%", "55%"], // Position the chart at the center
        data: data,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: UGX {c} ({d}%)", // Display name, value, and percentage outside
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default FinancialYearVisualisation;
