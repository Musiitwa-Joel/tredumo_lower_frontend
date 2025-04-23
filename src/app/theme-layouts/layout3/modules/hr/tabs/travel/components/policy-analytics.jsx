"use client";

import { useState } from "react";
import {
  Table,
  Space,
  Tag,
  Button,
  Progress,
  Card,
  Row,
  Col,
  List,
} from "antd";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  BarChart3,
} from "lucide-react";
import { Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const { Title, Text } = Typography;

// Sample data for policy compliance
const policyComplianceData = [
  {
    key: "1",
    policy: "Flight Booking Advance Notice",
    description: "Flights must be booked at least 14 days in advance",
    compliance: 92,
    status: "Good",
    trend: "up",
    lastUpdated: "2025-03-01",
    department: "All",
  },
  {
    key: "2",
    policy: "Hotel Rate Compliance",
    description: "Hotel rates must not exceed location-specific limits",
    compliance: 87,
    status: "Good",
    trend: "up",
    lastUpdated: "2025-03-01",
    department: "All",
  },
  {
    key: "3",
    policy: "Expense Report Submission",
    description: "Expense reports must be submitted within 7 days of return",
    compliance: 78,
    status: "Needs Improvement",
    trend: "down",
    lastUpdated: "2025-03-01",
    department: "All",
  },
  {
    key: "4",
    policy: "Pre-Trip Approval",
    description: "All trips must receive manager approval before booking",
    compliance: 95,
    status: "Excellent",
    trend: "up",
    lastUpdated: "2025-03-01",
    department: "All",
  },
];

// Sample data for travel metrics
const travelMetricsData = [
  { month: "Jan", expenses: 42000, trips: 15 },
  { month: "Feb", expenses: 38000, trips: 12 },
  { month: "Mar", expenses: 52000, trips: 18 },
  { month: "Apr", expenses: 35000, trips: 10 },
  { month: "May", expenses: 40000, trips: 14 },
  { month: "Jun", expenses: 48000, trips: 16 },
];

// Sample data for top destinations
const topDestinationsData = [
  { destination: "New York, USA", count: 24, spending: 84000 },
  { destination: "London, UK", count: 18, spending: 72000 },
  { destination: "Tokyo, Japan", count: 12, spending: 65000 },
  { destination: "Paris, France", count: 10, spending: 42000 },
  { destination: "Singapore", count: 8, spending: 38000 },
];

// Sample data for expense categories
const expenseCategoriesData = [
  { category: "Flights", amount: 125000, percentage: 40 },
  { category: "Accommodation", amount: 95000, percentage: 30 },
  { category: "Meals", amount: 45000, percentage: 15 },
  { category: "Transportation", amount: 25000, percentage: 8 },
  { category: "Other", amount: 22000, percentage: 7 },
];

// Restructured data for monthly expense trends to work with Recharts
const monthlyExpenseTrendsForRecharts = [
  { month: "Jan", 2024: 38000, 2025: 42000 },
  { month: "Feb", 2024: 42000, 2025: 38000 },
  { month: "Mar", 2024: 35000, 2025: 52000 },
  { month: "Apr", 2024: 40000, 2025: null },
  { month: "May", 2024: 45000, 2025: null },
  { month: "Jun", 2024: 48000, 2025: null },
  { month: "Jul", 2024: 52000, 2025: null },
  { month: "Aug", 2024: 49000, 2025: null },
  { month: "Sep", 2024: 55000, 2025: null },
  { month: "Oct", 2024: 60000, 2025: null },
  { month: "Nov", 2024: 58000, 2025: null },
  { month: "Dec", 2024: 65000, 2025: null },
];

// Sample data for department spending
const departmentSpendingData = [
  { department: "Sales", amount: 120000, trips: 35, avgPerTrip: 3428 },
  { department: "Marketing", amount: 95000, trips: 28, avgPerTrip: 3392 },
  { department: "Engineering", amount: 85000, trips: 22, avgPerTrip: 3863 },
  { department: "Product", amount: 65000, trips: 18, avgPerTrip: 3611 },
  { department: "Executive", amount: 55000, trips: 12, avgPerTrip: 4583 },
];

const PolicyAnalytics = ({ viewMode }) => {
  const [activeTab, setActiveTab] = useState("policy");

  // Status tag renderer with enhanced styling
  const renderStatusTag = (status) => {
    let color;
    let icon;

    switch (status) {
      case "Excellent":
        color = "success";
        icon = <CheckCircle2 size={14} />;
        break;
      case "Good":
        color = "success";
        icon = <CheckCircle2 size={14} />;
        break;
      case "Needs Improvement":
        color = "warning";
        icon = <Clock size={14} />;
        break;
      default:
        color = "default";
        icon = null;
    }

    return (
      <Tag
        color={color}
        style={{ display: "flex", alignItems: "center", gap: "4px" }}
      >
        {icon} {status}
      </Tag>
    );
  };

  // Trend indicator renderer
  const renderTrend = (trend) => {
    if (trend === "up") {
      return <ArrowUpRight size={16} color="#52c41a" />;
    } else {
      return <ArrowDownRight size={16} color="#ff4d4f" />;
    }
  };

  // Table columns for policy compliance with enhanced features
  const policyComplianceColumns = [
    {
      title: "Policy",
      dataIndex: "policy",
      key: "policy",
      render: (policy, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{policy}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.description}
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.policy.localeCompare(b.policy),
    },
    {
      title: "Compliance Rate",
      dataIndex: "compliance",
      key: "compliance",
      render: (compliance, record) => (
        <Space>
          <Progress
            type="circle"
            percent={compliance}
            width={40}
            format={(percent) => `${percent}%`}
            status={
              compliance >= 90
                ? "success"
                : compliance >= 80
                  ? "normal"
                  : "exception"
            }
          />
          <Space direction="vertical" size={0}>
            <Space>
              {renderTrend(record.trend)}
              <Text>{record.trend === "up" ? "Improving" : "Declining"}</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Last updated: {record.lastUpdated}
            </Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => a.compliance - b.compliance,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
      filters: [
        { text: "Excellent", value: "Excellent" },
        { text: "Good", value: "Good" },
        { text: "Needs Improvement", value: "Needs Improvement" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => handleViewDetails(record)}
          >
            View Details
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => handleSendReminder(record)}
          >
            Send Reminder
          </Button>
        </Space>
      ),
    },
  ];

  // Handle view details
  const handleViewDetails = (record) => {
    console.log("View details for:", record);
    // In a real app, you would show details in a modal or drawer
  };

  // Handle send reminder
  const handleSendReminder = (record) => {
    console.log("Send reminder for:", record);
    // In a real app, you would send a reminder and show a success message
  };

  // Render card view for policy compliance
  const renderPolicyCardView = () => {
    return (
      <Row gutter={[16, 16]}>
        {policyComplianceData.map((policy) => (
          <Col xs={24} sm={12} md={8} key={policy.key}>
            <Card hoverable>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 16 }}>
                  {policy.policy}
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary">{policy.description}</Text>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Progress
                  type="circle"
                  percent={policy.compliance}
                  width={80}
                  format={(percent) => `${percent}%`}
                  status={
                    policy.compliance >= 90
                      ? "success"
                      : policy.compliance >= 80
                        ? "normal"
                        : "exception"
                  }
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {renderTrend(policy.trend)}
                    <Text>
                      {policy.trend === "up" ? "Improving" : "Declining"}
                    </Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {renderStatusTag(policy.status)}
                  </div>
                  <Text
                    type="secondary"
                    style={{ fontSize: "12px", display: "block", marginTop: 4 }}
                  >
                    Last updated: {policy.lastUpdated}
                  </Text>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button type="link" onClick={() => handleViewDetails(policy)}>
                  View Details
                </Button>
                <Button type="link" onClick={() => handleSendReminder(policy)}>
                  Send Reminder
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Custom formatter for Y-axis labels
  const formatYAxisTick = (value) => {
    return `UGX${(value / 1000).toFixed(0)}k`;
  };

  // Custom formatter for bar labels
  const formatBarLabel = (props) => {
    const { x, y, width, value } = props;
    if (!value) return null;
    return `UGX${(value / 1000).toFixed(0)}k`;
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {`${entry.name}: UGX${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render monthly expense chart using Recharts
  const renderMonthlyExpenseChart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={monthlyExpenseTrendsForRecharts}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatYAxisTick} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="2024" fill="#1890ff" name="2024">
            <LabelList
              dataKey="2024"
              position="top"
              formatter={formatBarLabel}
            />
          </Bar>
          <Bar dataKey="2025" fill="#f5222d" name="2025">
            <LabelList
              dataKey="2025"
              position="top"
              formatter={formatBarLabel}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render expense categories chart
  const renderExpenseCategoriesChart = () => {
    // This would be a real pie chart in a production app
    // For this example, we'll create a visual representation with divs
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", height: "24px" }}>
          {expenseCategoriesData.map((item, index) => (
            <div
              key={index}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: getColorForCategory(item.category),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {item.percentage}%
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {expenseCategoriesData.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginRight: "16px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: getColorForCategory(item.category),
                }}
              ></div>
              <div>
                {item.category}: UGX&nbsp;{item.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get color for expense category
  const getColorForCategory = (category) => {
    switch (category) {
      case "Flights":
        return "#1890ff";
      case "Accommodation":
        return "#52c41a";
      case "Meals":
        return "#faad14";
      case "Transportation":
        return "#722ed1";
      case "Other":
        return "#f5222d";
      default:
        return "#1890ff";
    }
  };

  // Render department spending table
  const renderDepartmentSpendingTable = () => {
    const columns = [
      {
        title: "Department",
        dataIndex: "department",
        key: "department",
      },
      {
        title: "Total Spending",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => `UGX${amount.toLocaleString()}`,
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: "Number of Trips",
        dataIndex: "trips",
        key: "trips",
        sorter: (a, b) => a.trips - b.trips,
      },
      {
        title: "Avg. Per Trip",
        dataIndex: "avgPerTrip",
        key: "avgPerTrip",
        render: (avgPerTrip) => `UGX${avgPerTrip.toLocaleString()}`,
        sorter: (a, b) => a.avgPerTrip - b.avgPerTrip,
      },
    ];

    return (
      <Table
        dataSource={departmentSpendingData}
        columns={columns}
        pagination={false}
        size="small"
      />
    );
  };

  // Render analytics section
  const renderAnalytics = () => {
    return (
      <Row gutter={[16, 24]}>
        <Col span={24} md={12}>
          <Card title="Monthly Travel Expenses" bordered={false}>
            {renderMonthlyExpenseChart()}
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card title="Top Destinations" bordered={false}>
            <List
              size="small"
              dataSource={topDestinationsData}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Text key="spending">
                      UGX&nbsp;{item.spending.toLocaleString()}
                    </Text>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<MapPin size={16} />}
                    title={item.destination}
                    description={`${item.count} trips`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card title="Expense Categories" bordered={false}>
            {renderExpenseCategoriesChart()}
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card title="Expense Report Submission Compliance" bordered={false}>
            <div style={{ padding: "16px 0" }}>
              <Progress
                percent={78}
                status="exception"
                format={(percent) => `${percent}%`}
              />
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Text type="secondary">Target:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    95%
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Current:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    78%
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Trend:</Text>
                  <Text type="danger" strong style={{ marginLeft: 8 }}>
                    -2.5%
                  </Text>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  22% of employees are submitting expense reports late or not at
                  all. This is a 2.5% decrease in compliance from last month.
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Department Spending Analysis" bordered={false}>
            {renderDepartmentSpendingTable()}
          </Card>
        </Col>
      </Row>
    );
  };

  // Render tabs for policy and analytics
  const renderTabs = () => {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type={activeTab === "policy" ? "primary" : "default"}
              icon={<FileText size={16} />}
              onClick={() => setActiveTab("policy")}
            >
              Policy Compliance
            </Button>
            <Button
              type={activeTab === "analytics" ? "primary" : "default"}
              icon={<BarChart3 size={16} />}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </Button>
          </Space>
        </div>

        {activeTab === "policy" ? (
          viewMode === "table" ? (
            <Table
              columns={policyComplianceColumns}
              dataSource={policyComplianceData}
              size="small"
              pagination={{
                pageSize: 5,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              rowKey="key"
            />
          ) : (
            renderPolicyCardView()
          )
        ) : (
          renderAnalytics()
        )}
      </div>
    );
  };

  return renderTabs();
};

// Simple Statistic component
const Statistic = ({ title, value, suffix }) => {
  return (
    <div>
      <div style={{ color: "rgba(0, 0, 0, 0.45)", fontSize: 14 }}>{title}</div>
      <div style={{ color: "rgba(0, 0, 0, 0.85)", fontSize: 24, marginTop: 4 }}>
        {value}
      </div>
      {suffix && <div style={{ marginTop: 4 }}>{suffix}</div>}
    </div>
  );
};

export default PolicyAnalytics;
