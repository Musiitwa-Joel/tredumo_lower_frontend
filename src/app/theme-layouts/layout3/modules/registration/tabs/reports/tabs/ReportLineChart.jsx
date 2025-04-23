import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";

const facultyData = [
  { faculty_code: "SCI", registered: 300, provisional: 150, enrolled: 200 },
  { faculty_code: "SBA", registered: 400, provisional: 250, enrolled: 350 },
  { faculty_code: "SLAW", registered: 200, provisional: 100, enrolled: 180 },
  { faculty_code: "SCIAD", registered: 500, provisional: 200, enrolled: 450 },
  { faculty_code: "SCOS", registered: 350, provisional: 150, enrolled: 300 },
  { faculty_code: "SOSS", registered: 600, provisional: 250, enrolled: 500 },
];

const ReportLineChart = () => {
  const [height, setHeight] = useState(window.innerHeight - 602);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 602); // Update height when window is resized (example: half of the window height)
    };

    // Add event listener for window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);

  return (
    <Card
      title="Student Statistics per Faculty"
      bordered={true}
      style={{
        // backgroundColor: "#f0f5ff",
        borderRadius: "8px",
        borderColor: "lightgray",
        borderWidth: 1,
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={facultyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="faculty_code" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="registered"
            stroke="#1890ff"
            activeDot={{ r: 8 }}
            name="Registered Students"
          />
          <Line
            type="monotone"
            dataKey="provisional"
            stroke="#fa8c16"
            name="Provisionally Registered Students"
          />
          <Line
            type="monotone"
            dataKey="enrolled"
            stroke="#52c41a"
            name="Enrolled Students"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ReportLineChart;
