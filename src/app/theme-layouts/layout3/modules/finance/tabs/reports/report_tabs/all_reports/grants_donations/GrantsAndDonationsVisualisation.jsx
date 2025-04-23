import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Row, Col } from "antd";

// Dummy data for Ugandan companies
const pieData = [
  { name: "MTN Uganda", value: 5000000 },
  { name: "Uganda Breweries Limited", value: 3000000 },
  { name: "Stanbic Bank Uganda", value: 10000000 },
  { name: "Mukwano Group of Companies", value: 2000000 },
  { name: "Dfcu Bank", value: 4000000 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`UGX ${value.toLocaleString()}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Updated data for Bar Chart (donations over time)
const barData = [
  { name: "Jan", MTN: 4000000, UBL: 0, Stanbic: 0, Mukwano: 0, Dfcu: 0 },
  { name: "Feb", MTN: 0, UBL: 0, Stanbic: 1000000, Mukwano: 0, Dfcu: 2000000 },
  { name: "Mar", MTN: 0, UBL: 3000000, Stanbic: 0, Mukwano: 0, Dfcu: 0 },
  { name: "Apr", MTN: 5000000, UBL: 0, Stanbic: 0, Mukwano: 0, Dfcu: 0 },
  { name: "May", MTN: 0, UBL: 0, Stanbic: 10000000, Mukwano: 0, Dfcu: 0 },
  { name: "Jun", MTN: 0, UBL: 0, Stanbic: 0, Mukwano: 2000000, Dfcu: 0 },
  { name: "Jul", MTN: 0, UBL: 0, Stanbic: 0, Mukwano: 0, Dfcu: 4000000 },
];

export default class GrantsAndDonationsCharts extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                activeIndex={this.state.activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={this.onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col span={12}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="MTN" fill="#8884d8" />
              <Bar dataKey="UBL" fill="#82ca9d" />
              <Bar dataKey="Stanbic" fill="#ff7300" />
              <Bar dataKey="Mukwano" fill="#387908" />
              <Bar dataKey="Dfcu" fill="#ff0000" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    );
  }
}
