import React from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "antd";

const TredPieReport = () => {
  const option = {
    title: {
      text: "Total Annual Collections of Different Banks",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "Annual Collections",
        type: "pie",
        radius: [20, 140],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 1048, name: "Centenary Bank" },
          { value: 735, name: "Stanbic Bank" },
          { value: 580, name: "Opportunity Bank" },
          { value: 484, name: "DFCU Bank" },
          { value: 300, name: "Equity Bank" },
        ],
      },
    ],
  };

  return (
    <Card bordered={false}>
      <ReactECharts option={option} style={{ height: "400px" }} />
    </Card>
  );
};

export default TredPieReport;
