import React from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "antd";

const TredPayBarReport = () => {
  const option = {
    title: {
      text: "Total Revenue Per Bank",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Daily", "Weekly", "Monthly", "Annually"], // Custom legend labels
      top: "10%", // Position of the legend
      left: "center", // Align legend to the center
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: ["DFCU Bank", "Centenary Bank", "Stanbic Bank"],
    },
    series: [
      {
        name: "Daily", // Custom name to match legend
        type: "bar",
        data: [18203, 23489, 29034],
        itemStyle: {
          color: "#5470C6",
        },
      },
      {
        name: "Weekly", // Custom name to match legend
        type: "bar",
        data: [19325, 23438, 51000],
        itemStyle: {
          color: "#91CC75",
        },
      },
      {
        name: "Monthly", // Custom name to match legend
        type: "bar",
        data: [18203, 23489, 29034],
        itemStyle: {
          color: "#FAC858",
        },
      },
      {
        name: "Annually", // Custom name to match legend
        type: "bar",
        data: [19325, 23438, 31000],
        itemStyle: {
          color: "#EE6666",
        },
      },
    ],
  };

  return (
    <Card bordered={false}>
      <ReactECharts option={option} style={{ height: "200px" }} />
    </Card>
  );
};

export default TredPayBarReport;
