import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Tag,
} from "antd";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  File as FilePdf,
  FileText,
  Users,
  Calendar,
  Clock,
  Building2,
} from "lucide-react";

const { Title } = Typography;
const { RangePicker } = DatePicker;

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLeaveType, setSelectedLeaveType] = useState("all");

  const cardStyle = {
    marginBottom: "0px",
    borderRadius: "8px",
  };

  const iconStyle = {
    marginRight: "8px",
  };

  const statsCards = [
    {
      title: "Total Leave Days",
      value: "1,234",
      icon: <Calendar size={20} />,
      color: "#1890ff",
    },
    {
      title: "Pending Requests",
      value: "45",
      icon: <Clock size={20} />,
      color: "#faad14",
    },
    {
      title: "Departments",
      value: "8",
      icon: <Building2 size={20} />,
      color: "#52c41a",
    },
    {
      title: "Total Employees",
      value: "156",
      icon: <Users size={20} />,
      color: "#722ed1",
    },
  ];

  const leaveHistoryColumns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "success"
              : status === "Pending"
                ? "warning"
                : "error"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  const leaveHistoryData = [
    {
      key: "1",
      employee: "John Doe",
      department: "Engineering",
      leaveType: "Annual Leave",
      duration: "3 days",
      status: "Approved",
    },
    {
      key: "2",
      employee: "Jane Smith",
      department: "Marketing",
      leaveType: "Sick Leave",
      duration: "1 day",
      status: "Pending",
    },
    {
      key: "3",
      employee: "Mike Johnson",
      department: "HR",
      leaveType: "Personal Leave",
      duration: "2 days",
      status: "Rejected",
    },
  ];

  const departmentData = [
    {
      key: "1",
      department: "Engineering",
      totalEmployees: 45,
      leavesTaken: 123,
      averageDuration: "2.5 days",
    },
    {
      key: "2",
      department: "Marketing",
      totalEmployees: 28,
      leavesTaken: 89,
      averageDuration: "3.1 days",
    },
    {
      key: "3",
      department: "HR",
      totalEmployees: 15,
      leavesTaken: 45,
      averageDuration: "2.8 days",
    },
  ];

  return (
    <div
      style={{
        padding: "0px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0px",
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              <BarChart3
                size={24}
                style={{ marginRight: "12px", verticalAlign: "middle" }}
              />
              Leave Analytics Dashboard
            </Title>
            <Space>
              <Button type="primary" icon={<Download size={16} />}>
                Export Report
              </Button>
            </Space>
          </div>
        </Col>

        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{ ...cardStyle, borderTop: `2px solid ${stat.color}` }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ ...iconStyle, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: "14px", color: "#8c8c8c" }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {stat.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}

        <Col span={24}>
          <Card
            title="Leave History & Trends"
            style={cardStyle}
            extra={
              <Space>
                <Select
                  defaultValue="all"
                  style={{ width: 150 }}
                  onChange={setSelectedDepartment}
                  options={[
                    { value: "all", label: "All Departments" },
                    { value: "engineering", label: "Engineering" },
                    { value: "marketing", label: "Marketing" },
                    { value: "hr", label: "HR" },
                  ]}
                />
                <Select
                  defaultValue="all"
                  style={{ width: 150 }}
                  onChange={setSelectedLeaveType}
                  options={[
                    { value: "all", label: "All Leave Types" },
                    { value: "annual", label: "Annual Leave" },
                    { value: "sick", label: "Sick Leave" },
                    { value: "personal", label: "Personal Leave" },
                  ]}
                />
                <RangePicker style={{ width: 250 }} />
              </Space>
            }
          >
            <Table
              columns={leaveHistoryColumns}
              dataSource={leaveHistoryData}
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Departmental Leave Analysis"
            style={cardStyle}
            extra={
              <Space>
                <Button icon={<FileSpreadsheet size={16} />}>Excel</Button>
                <Button icon={<FilePdf size={16} />}>PDF</Button>
                <Button icon={<FileText size={16} />}>CSV</Button>
              </Space>
            }
          >
            <Table
              columns={[
                {
                  title: "Department",
                  dataIndex: "department",
                  key: "department",
                },
                {
                  title: "Total Employees",
                  dataIndex: "totalEmployees",
                  key: "totalEmployees",
                },
                {
                  title: "Leaves Taken",
                  dataIndex: "leavesTaken",
                  key: "leavesTaken",
                },
                {
                  title: "Average Duration",
                  dataIndex: "averageDuration",
                  key: "averageDuration",
                },
              ]}
              dataSource={departmentData}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
