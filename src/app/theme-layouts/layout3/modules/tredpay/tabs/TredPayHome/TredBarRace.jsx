import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "antd";

const TredPayBarRace = () => {
  const chartRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    {
      year: "2021",
      values: [
        { name: "DFCU Bank", value: 5000 },
        { name: "Centenary Bank", value: 7000 },
        { name: "Stanbic Bank", value: 8000 },
      ],
    },
    {
      year: "2022",
      values: [
        { name: "DFCU Bank", value: 6000 },
        { name: "Centenary Bank", value: 7500 },
        { name: "Stanbic Bank", value: 8500 },
      ],
    },
    {
      year: "2023",
      values: [
        { name: "DFCU Bank", value: 7000 },
        { name: "Centenary Bank", value: 8000 },
        { name: "Stanbic Bank", value: 9000 },
      ],
    },
    {
      year: "2024",
      values: [
        { name: "DFCU Bank", value: 8000 },
        { name: "Centenary Bank", value: 8500 },
        { name: "Stanbic Bank", value: 9500 },
      ],
    },
  ];

  const getOption = (index) => {
    const yearData = data[index];
    return {
      title: {
        text: `Tred Pay Collections in ${yearData.year}`,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["Daily", "Weekly", "Monthly", "Annually"],
        top: "10%",
        left: "center",
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
        data: yearData.values.map((item) => item.name),
      },
      series: [
        {
          name: "Daily",
          type: "bar",
          data: yearData.values.map((item) => item.value * 0.25),
          itemStyle: {
            color: "#5470C6",
          },
        },
        {
          name: "Weekly",
          type: "bar",
          data: yearData.values.map((item) => item.value * 0.5),
          itemStyle: {
            color: "#91CC75",
          },
        },
        {
          name: "Monthly",
          type: "bar",
          data: yearData.values.map((item) => item.value * 0.75),
          itemStyle: {
            color: "#FAC858",
          },
        },
        {
          name: "Annually",
          type: "bar",
          data: yearData.values.map((item) => item.value),
          itemStyle: {
            color: "#EE6666",
          },
        },
      ],
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card bordered={false}>
      <ReactECharts
        ref={chartRef}
        option={getOption(currentIndex)}
        style={{ height: "200px" }}
      />
    </Card>
  );
};

export default TredPayBarRace;
