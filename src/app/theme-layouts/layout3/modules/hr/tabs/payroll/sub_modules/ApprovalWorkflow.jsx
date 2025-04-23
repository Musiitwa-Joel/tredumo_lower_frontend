import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Timeline,
  Typography,
  Avatar,
  Row,
  Col,
  Progress,
  Statistic,
  Tabs,
  DatePicker,
  Dropdown,
  Menu,
} from "antd";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  FileText,
  DollarSign,
  MoreHorizontal,
  Search,
  RefreshCw,
  CheckSquare,
  Clock3,
  XSquare,
  FileCheck,
  Users,
  BarChart4,
  Wallet,
} from "lucide-react";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function ApprovalWorkflow() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [form] = Form.useForm();

  // Sample data for payroll approval requests
  const approvalData = [
    {
      key: "1",
      id: "PAY-2023-04",
      title: "April 2023 Payroll",
      initiatedBy: "Nantume Grace",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "25/04/2023",
      amount: 178000000,
      status: "Approved",
      currentStep: 3,
      dueDate: "30/04/2023",
      department: "Human Resources",
      employees: 45,
      description:
        "Regular monthly payroll for all departments including overtime and bonuses for Q1 performance.",
    },
    {
      key: "2",
      id: "PAY-2023-05",
      title: "May 2023 Payroll",
      initiatedBy: "Nantume Grace",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "25/05/2023",
      amount: 180500000,
      status: "Pending Approval",
      currentStep: 1,
      dueDate: "31/05/2023",
      department: "Human Resources",
      employees: 47,
      description:
        "Regular monthly payroll including new hires in the IT department and marketing team.",
    },
    {
      key: "3",
      id: "ADV-2023-05-01",
      title: "Salary Advance - Marketing Team",
      initiatedBy: "Nabukenya Patricia",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "10/05/2023",
      amount: 15000000,
      status: "Pending Approval",
      currentStep: 2,
      dueDate: "15/05/2023",
      department: "Marketing",
      employees: 8,
      description:
        "Salary advance for the marketing team for the upcoming product launch campaign expenses.",
    },
    {
      key: "4",
      id: "BON-2023-Q1",
      title: "Q1 Performance Bonuses",
      initiatedBy: "Mukasa David",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "05/04/2023",
      amount: 45000000,
      status: "Rejected",
      currentStep: 2,
      dueDate: "15/04/2023",
      department: "Finance",
      employees: 32,
      description:
        "Performance bonuses for Q1 2023 based on department KPIs and individual achievements.",
    },
    {
      key: "5",
      id: "ADJ-2023-05-01",
      title: "Salary Adjustment - IT Department",
      initiatedBy: "Mukasa David",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "15/05/2023",
      amount: 12500000,
      status: "Draft",
      currentStep: 0,
      dueDate: "20/05/2023",
      department: "Information Technology",
      employees: 12,
      description:
        "Salary adjustments for the IT department based on annual performance review and market rates.",
    },
  ];

  // Timeline data for selected record
  const timelineData = [
    {
      date: "25/05/2023 09:15 AM",
      user: "Nantume Grace",
      avatar: "/placeholder.svg?height=32&width=32",
      position: "HR Manager",
      action: "Initiated payroll processing",
      comment:
        "Regular monthly payroll for May 2023. All employee records have been verified and updated.",
      status: "Completed",
    },
    {
      date: "25/05/2023 11:30 AM",
      user: "Namukwaya Sarah",
      avatar: "/placeholder.svg?height=32&width=32",
      position: "Finance Manager",
      action: "Reviewed payroll calculations",
      comment:
        "All calculations verified. Tax deductions are correct. Proceeding to next step.",
      status: "Completed",
    },
    {
      date: "25/05/2023 02:45 PM",
      user: "Okello John",
      avatar: "/placeholder.svg?height=32&width=32",
      position: "CFO",
      action: "Final approval",
      comment:
        "Pending review of total budget allocation and final verification.",
      status: "Pending",
    },
  ];

  // Statistics data
  const statsData = {
    pending: 8,
    approved: 24,
    rejected: 3,
    draft: 5,
    totalAmount: 450000000,
  };

  const getStatusIcon = (status, size = 16) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={size} className="text-green-500" />;
      case "Pending Approval":
        return <Clock size={size} className="text-blue-500" />;
      case "Rejected":
        return <XCircle size={size} className="text-red-500" />;
      case "Draft":
        return <FileText size={size} className="text-gray-500" />;
      default:
        return <AlertTriangle size={size} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { color: "#52c41a", bgColor: "#f6ffed", borderColor: "#b7eb8f" };
      case "Pending Approval":
        return { color: "#1677ff", bgColor: "#e6f7ff", borderColor: "#91caff" };
      case "Rejected":
        return { color: "#f5222d", bgColor: "#fff1f0", borderColor: "#ffa39e" };
      case "Draft":
        return { color: "#8c8c8c", bgColor: "#f5f5f5", borderColor: "#d9d9d9" };
      default:
        return { color: "#faad14", bgColor: "#fffbe6", borderColor: "#ffe58f" };
    }
  };

  const columns = [
    {
      title: "Request Details",
      key: "request",
      render: (_, record) => (
        <div className="flex items-center">
          <div className="mr-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: getStatusColor(record.status).bgColor,
                color: getStatusColor(record.status).color,
              }}
            >
              {getStatusIcon(record.status, 20)}
            </div>
          </div>
          <div>
            <div className="font-medium text-base">{record.title}</div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="mr-2">{record.id}</span>
              <Tag
                style={{
                  fontSize: "11px",
                  lineHeight: "16px",
                  padding: "0 6px",
                  borderRadius: "4px",
                }}
              >
                {record.department}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Initiated By",
      key: "initiator",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} size={32} className="mr-2" />
          <div>
            <div>{record.initiatedBy}</div>
            <div className="text-xs text-gray-500">{record.date}</div>
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <div className="font-medium">
            UGX {record.amount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {record.employees} employees
          </div>
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount,
      width: 180,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const { color, bgColor, borderColor } = getStatusColor(record.status);

        return (
          <div>
            <Tag
              icon={getStatusIcon(record.status, 14)}
              style={{
                color: color,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderRadius: "4px",
                padding: "0px 8px",
                fontSize: "12px",
                fontWeight: 500,
                display: "inline-flex", // Ensures it only takes the necessary width
                alignItems: "center", // Aligns text and icon in a row
                gap: "4px", // Adds spacing between the icon and text
                width: "auto", // Prevents unnecessary stretching
              }}
            >
              {record.status}
            </Tag>

            <div className="text-xs text-gray-500 mt-1">
              Due: {record.dueDate}
            </div>
          </div>
        );
      },
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "Pending Approval", value: "Pending Approval" },
        { text: "Rejected", value: "Rejected" },
        { text: "Draft", value: "Draft" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      width: 160,
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => {
        const { currentStep } = record;
        const steps = ["HR", "Finance", "Management", "Payment"];
        const percent = ((currentStep + 1) / steps.length) * 100;

        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              {steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    color: index <= currentStep ? "#1677ff" : "#8c8c8c",
                    fontWeight: index === currentStep ? 500 : 400,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              size="small"
              strokeColor={{
                "0%": "#1677ff",
                "100%": "#1677ff",
              }}
              trailColor="#f0f0f0"
              style={{ marginBottom: 0 }}
            />
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="middle"
            icon={<Eye size={14} />}
            onClick={() => showDetailModal(record)}
            style={{
              borderRadius: "6px",
              background: "#1677ff",
              boxShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
            }}
          >
            View Details
          </Button>
          {record.status === "Pending Approval" && (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="approve"
                    icon={<CheckCircle size={14} className="text-green-500" />}
                    onClick={() => {}}
                  >
                    Approve Request
                  </Menu.Item>
                  <Menu.Item
                    key="reject"
                    icon={<XCircle size={14} className="text-red-500" />}
                    onClick={() => {}}
                  >
                    Reject Request
                  </Menu.Item>
                  <Menu.Item
                    key="comment"
                    icon={<MessageSquare size={14} className="text-gray-500" />}
                    onClick={() => {}}
                  >
                    Add Comment
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
            >
              <Button
                size="middle"
                icon={<MoreHorizontal size={14} />}
                style={{
                  borderRadius: "6px",
                }}
              />
            </Dropdown>
          )}
        </Space>
      ),
      width: 180,
    },
  ];

  const showDetailModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const renderStepStatus = (record, step) => {
    if (record.status === "Rejected" && record.currentStep >= step) {
      return <XSquare size={16} className="text-red-500" />;
    }

    if (record.currentStep > step) {
      return <CheckSquare size={16} className="text-green-500" />;
    }

    if (record.currentStep === step) {
      return <Clock3 size={16} className="text-blue-500" />;
    }

    return <div className="w-4 h-4 rounded-full border border-gray-300"></div>;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            Payroll Approval Workflow
          </Title>
          <Text type="secondary">
            Multi-level approval system for payroll processing
          </Text>
        </div>
        <Space>
          <Button
            icon={<FileCheck size={16} />}
            type="primary"
            style={{
              borderRadius: "6px",
              background: "#1677ff",
              boxShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
            }}
          >
            New Approval Request
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card
            bordered={true}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              height: "100%",
              borderColor: "#1677ff",
              borderStyle: "dotted",
            }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Clock3 size={16} className="text-blue-500 mr-2" />
                  <span>Pending Approvals</span>
                </div>
              }
              value={statsData.pending}
              valueStyle={{ color: "#1677ff", fontWeight: 600 }}
            />
            <div className="mt-2">
              <Progress
                percent={
                  (statsData.pending /
                    (statsData.pending +
                      statsData.approved +
                      statsData.rejected +
                      statsData.draft)) *
                  100
                }
                showInfo={false}
                strokeColor="#1677ff"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            bordered={true}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              height: "100%",
              borderColor: "#52c41a",
              borderStyle: "dotted",
            }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Approved</span>
                </div>
              }
              value={statsData.approved}
              valueStyle={{ color: "#52c41a", fontWeight: 600 }}
            />
            <div className="mt-2">
              <Progress
                percent={
                  (statsData.approved /
                    (statsData.pending +
                      statsData.approved +
                      statsData.rejected +
                      statsData.draft)) *
                  100
                }
                showInfo={false}
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            bordered={true}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              height: "100%",
              borderColor: "#f5222d",
              borderStyle: "dotted",
            }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <XCircle size={16} className="text-red-500 mr-2" />
                  <span>Rejected</span>
                </div>
              }
              value={statsData.rejected}
              valueStyle={{ color: "#f5222d", fontWeight: 600 }}
            />
            <div className="mt-2">
              <Progress
                percent={
                  (statsData.rejected /
                    (statsData.pending +
                      statsData.approved +
                      statsData.rejected +
                      statsData.draft)) *
                  100
                }
                showInfo={false}
                strokeColor="#f5222d"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            bordered={true}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              height: "100%",
              borderStyle: "dotted",
              borderColor: "#722ed1",
            }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Wallet size={16} className="text-purple-500 mr-2" />
                  <span>Total Amount (UGX)</span>
                </div>
              }
              value={statsData.totalAmount}
              valueStyle={{ color: "#722ed1", fontWeight: 600 }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
            <div className="mt-2 text-xs text-gray-500">
              For all pending and approved requests
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters and Tabs */}
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <div className="mb-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            tabBarStyle={{ marginBottom: 24 }}
          >
            <TabPane
              tab={
                <span className="flex items-center">
                  <Clock3 size={14} className="mr-1" />
                  Pending Approval ({statsData.pending})
                </span>
              }
              key="pending"
            />
            <TabPane
              tab={
                <span className="flex items-center">
                  <CheckCircle size={14} className="mr-1" />
                  Approved ({statsData.approved})
                </span>
              }
              key="approved"
            />
            <TabPane
              tab={
                <span className="flex items-center">
                  <XCircle size={14} className="mr-1" />
                  Rejected ({statsData.rejected})
                </span>
              }
              key="rejected"
            />
            <TabPane
              tab={
                <span className="flex items-center">
                  <FileText size={14} className="mr-1" />
                  Draft ({statsData.draft})
                </span>
              }
              key="draft"
            />
            <TabPane
              tab={
                <span className="flex items-center">
                  <BarChart4 size={14} className="mr-1" />
                  All Requests
                </span>
              }
              key="all"
            />
          </Tabs>

          <div className="flex justify-between items-center mb-4">
            <Space size="middle">
              <Input
                placeholder="Search requests..."
                prefix={<Search size={16} className="text-gray-400" />}
                style={{ width: 250, borderRadius: "8px" }}
              />
              <Select
                placeholder="Department"
                style={{ width: 180, borderRadius: "8px" }}
                allowClear
              >
                <Option value="hr">Human Resources</Option>
                <Option value="finance">Finance</Option>
                <Option value="it">Information Technology</Option>
                <Option value="marketing">Marketing</Option>
                <Option value="operations">Operations</Option>
              </Select>
              <RangePicker
                style={{ borderRadius: "8px" }}
                placeholder={["Start Date", "End Date"]}
              />
            </Space>
            <Button
              icon={<RefreshCw size={16} />}
              style={{ borderRadius: "8px" }}
            >
              Refresh
            </Button>
          </div>

          <Table
            size="small"
            columns={columns}
            dataSource={approvalData}
            pagination={{
              pageSize: 10,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} requests`,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
            }}
            rowClassName={(record) =>
              record.status === "Pending Approval" ? "bg-blue-50" : ""
            }
          />
        </div>
      </Card>

      {/* Detailed Modal */}
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        bodyStyle={{ padding: 0 }}
        style={{ top: 20 }}
        className="rounded-lg overflow-hidden"
      >
        {selectedRecord && (
          <div>
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1677ff, #0958d9)",
                padding: "24px",
                color: "white",
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {getStatusIcon(selectedRecord.status, 24)}
                  </div>
                  <div>
                    <div className="text-2xl font-medium">
                      {selectedRecord.title}
                    </div>
                    <div className="text-sm opacity-80 mt-1">
                      {selectedRecord.id} • {selectedRecord.department} •{" "}
                      {selectedRecord.employees} Employees
                    </div>
                  </div>
                </div>
                <Tag
                  style={{
                    color: "white",
                    backgroundColor:
                      selectedRecord.status === "Approved"
                        ? "rgba(82, 196, 26, 0.6)"
                        : selectedRecord.status === "Pending Approval"
                          ? "rgba(24, 144, 255, 0.6)"
                          : selectedRecord.status === "Rejected"
                            ? "rgba(245, 34, 45, 0.6)"
                            : "rgba(140, 140, 140, 0.6)",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {selectedRecord.status}
                </Tag>
              </div>
              <div className="mt-6 text-sm opacity-90">
                {selectedRecord.description}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <Row gutter={24}>
                {/* Left Column */}
                <Col span={16}>
                  {/* Workflow Visualization */}
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      marginBottom: "24px",
                    }}
                  >
                    <div className="mb-4">
                      <Title level={5}>Approval Workflow</Title>
                      <Text type="secondary">
                        Current status and progress of this request
                      </Text>
                    </div>

                    <div className="relative mt-8 mb-8">
                      {/* Workflow Line */}
                      <div
                        className="absolute top-4 left-0 right-0 h-1 bg-gray-200"
                        style={{ zIndex: 1 }}
                      ></div>

                      {/* Colored Progress Line */}
                      <div
                        className="absolute top-4 left-0 h-1"
                        style={{
                          width: `${((selectedRecord.currentStep + 1) / 4) * 100}%`,
                          backgroundColor:
                            selectedRecord.status === "Rejected"
                              ? "#f5222d"
                              : "#1677ff",
                          zIndex: 2,
                        }}
                      ></div>

                      {/* Steps */}
                      <div
                        className="flex justify-between relative"
                        style={{ zIndex: 3 }}
                      >
                        {/* HR Step */}
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  selectedRecord.currentStep >= 0
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 0
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#f0f0f0",
                                border: `2px solid ${
                                  selectedRecord.currentStep >= 0
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 0
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#d9d9d9"
                                }`,
                              }}
                            >
                              {renderStepStatus(selectedRecord, 0)}
                            </div>
                          </div>
                          <div className="font-medium">HR Initiation</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Payroll processing
                          </div>
                        </div>

                        {/* Finance Step */}
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  selectedRecord.currentStep >= 1
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 1
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#f0f0f0",
                                border: `2px solid ${
                                  selectedRecord.currentStep >= 1
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 1
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#d9d9d9"
                                }`,
                              }}
                            >
                              {renderStepStatus(selectedRecord, 1)}
                            </div>
                          </div>
                          <div className="font-medium">Finance Review</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Verification & approval
                          </div>
                        </div>

                        {/* Management Step */}
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  selectedRecord.currentStep >= 2
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 2
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#f0f0f0",
                                border: `2px solid ${
                                  selectedRecord.currentStep >= 2
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 2
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#d9d9d9"
                                }`,
                              }}
                            >
                              {renderStepStatus(selectedRecord, 2)}
                            </div>
                          </div>
                          <div className="font-medium">Management Approval</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Final authorization
                          </div>
                        </div>

                        {/* Payment Step */}
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  selectedRecord.currentStep >= 3
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 3
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#f0f0f0",
                                border: `2px solid ${
                                  selectedRecord.currentStep >= 3
                                    ? selectedRecord.status === "Rejected" &&
                                      selectedRecord.currentStep === 3
                                      ? "#f5222d"
                                      : "#1677ff"
                                    : "#d9d9d9"
                                }`,
                              }}
                            >
                              {renderStepStatus(selectedRecord, 3)}
                            </div>
                          </div>
                          <div className="font-medium">Payment Processing</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Disbursement
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Timeline Card */}
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      marginBottom: "24px",
                    }}
                  >
                    <div className="mb-4">
                      <Title level={5}>Approval Timeline</Title>
                      <Text type="secondary">
                        Track the progress of this request
                      </Text>
                    </div>

                    <Timeline
                      items={timelineData.map((item, index) => ({
                        color:
                          item.status === "Completed"
                            ? "green"
                            : item.status === "Pending"
                              ? "blue"
                              : "red",
                        children: (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <Avatar src={item.avatar} size={32} />
                              <div className="ml-2">
                                <div className="font-medium">{item.user}</div>
                                <div className="text-xs text-gray-500">
                                  {item.position}
                                </div>
                              </div>
                              <div className="ml-auto text-xs text-gray-500">
                                {item.date}
                              </div>
                            </div>
                            <div className="ml-10">
                              <div className="font-medium mb-1">
                                {item.action}
                              </div>
                              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                {item.comment}
                              </div>
                            </div>
                          </div>
                        ),
                      }))}
                    />

                    {selectedRecord.status === "Pending Approval" && (
                      <>
                        <Divider />
                        <div className="mb-4">
                          <Title level={5}>Add Your Response</Title>
                        </div>
                        <Form layout="vertical">
                          <Form.Item label="Comment">
                            <TextArea
                              rows={3}
                              placeholder="Enter your comment or feedback..."
                              style={{ borderRadius: "8px" }}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button
                                type="primary"
                                icon={<ThumbsUp size={14} />}
                                style={{
                                  borderRadius: "6px",
                                  background: "#52c41a",
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                danger
                                icon={<ThumbsDown size={14} />}
                                style={{
                                  borderRadius: "6px",
                                }}
                              >
                                Reject
                              </Button>
                              <Button
                                icon={<MessageSquare size={14} />}
                                style={{
                                  borderRadius: "6px",
                                }}
                              >
                                Comment Only
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </>
                    )}
                  </Card>
                </Col>

                {/* Right Column */}
                <Col span={8}>
                  {/* Request Details Card */}
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      marginBottom: "16px",
                    }}
                  >
                    <div className="mb-4">
                      <Title level={5}>Request Details</Title>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Text type="secondary">Initiated By:</Text>
                        <div className="flex items-center">
                          <Avatar
                            src={selectedRecord.avatar}
                            size={20}
                            className="mr-1"
                          />
                          <Text strong>{selectedRecord.initiatedBy}</Text>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Text type="secondary">Department:</Text>
                        <Text strong>{selectedRecord.department}</Text>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Text type="secondary">Date:</Text>
                        <Text strong>{selectedRecord.date}</Text>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Text type="secondary">Due Date:</Text>
                        <Text strong>{selectedRecord.dueDate}</Text>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Text type="secondary">Amount:</Text>
                        <Text strong>
                          UGX {selectedRecord.amount.toLocaleString()}
                        </Text>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Text type="secondary">Employees:</Text>
                        <Text strong>{selectedRecord.employees}</Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text type="secondary">Current Step:</Text>
                        <Text strong>
                          {selectedRecord.currentStep === 0
                            ? "HR Initiation"
                            : selectedRecord.currentStep === 1
                              ? "Finance Review"
                              : selectedRecord.currentStep === 2
                                ? "Management Approval"
                                : "Payment Processing"}
                        </Text>
                      </div>
                    </div>
                  </Card>

                  {/* Approval Progress Card */}
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      marginBottom: "16px",
                    }}
                  >
                    <div className="mb-4">
                      <Title level={5}>Approval Progress</Title>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <Users size={14} className="mr-2 text-gray-500" />
                            <Text>HR Department</Text>
                          </div>
                          <Text
                            type={
                              selectedRecord.currentStep >= 0
                                ? "success"
                                : "secondary"
                            }
                          >
                            {selectedRecord.currentStep >= 0
                              ? "Completed"
                              : "Pending"}
                          </Text>
                        </div>
                        <Progress
                          percent={selectedRecord.currentStep >= 0 ? 100 : 0}
                          status={
                            selectedRecord.status === "Rejected" &&
                            selectedRecord.currentStep === 0
                              ? "exception"
                              : selectedRecord.currentStep >= 0
                                ? "success"
                                : "normal"
                          }
                          showInfo={false}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <DollarSign
                              size={14}
                              className="mr-2 text-gray-500"
                            />
                            <Text>Finance Department</Text>
                          </div>
                          {selectedRecord.currentStep >= 1 ? (
                            <Text type="success">Completed</Text>
                          ) : selectedRecord.currentStep === 0 ? (
                            <Text type="warning">In Progress</Text>
                          ) : (
                            <Text type="secondary">Pending</Text>
                          )}
                        </div>
                        <Progress
                          percent={
                            selectedRecord.currentStep >= 1
                              ? 100
                              : selectedRecord.currentStep === 0
                                ? 50
                                : 0
                          }
                          status={
                            selectedRecord.status === "Rejected" &&
                            selectedRecord.currentStep === 1
                              ? "exception"
                              : selectedRecord.currentStep >= 1
                                ? "success"
                                : selectedRecord.currentStep === 0
                                  ? "active"
                                  : "normal"
                          }
                          showInfo={false}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <CheckSquare
                              size={14}
                              className="mr-2 text-gray-500"
                            />
                            <Text>Management</Text>
                          </div>
                          {selectedRecord.currentStep >= 2 ? (
                            <Text type="success">Completed</Text>
                          ) : selectedRecord.currentStep === 1 ? (
                            <Text type="warning">In Progress</Text>
                          ) : (
                            <Text type="secondary">Pending</Text>
                          )}
                        </div>
                        <Progress
                          percent={
                            selectedRecord.currentStep >= 2
                              ? 100
                              : selectedRecord.currentStep === 1
                                ? 50
                                : 0
                          }
                          status={
                            selectedRecord.status === "Rejected" &&
                            selectedRecord.currentStep === 2
                              ? "exception"
                              : selectedRecord.currentStep >= 2
                                ? "success"
                                : selectedRecord.currentStep === 1
                                  ? "active"
                                  : "normal"
                          }
                          showInfo={false}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <Wallet size={14} className="mr-2 text-gray-500" />
                            <Text>Payment Processing</Text>
                          </div>
                          {selectedRecord.currentStep >= 3 ? (
                            <Text type="success">Completed</Text>
                          ) : selectedRecord.currentStep === 2 ? (
                            <Text type="warning">In Progress</Text>
                          ) : (
                            <Text type="secondary">Pending</Text>
                          )}
                        </div>
                        <Progress
                          percent={
                            selectedRecord.currentStep >= 3
                              ? 100
                              : selectedRecord.currentStep === 2
                                ? 50
                                : 0
                          }
                          status={
                            selectedRecord.status === "Rejected" &&
                            selectedRecord.currentStep === 3
                              ? "exception"
                              : selectedRecord.currentStep >= 3
                                ? "success"
                                : selectedRecord.currentStep === 2
                                  ? "active"
                                  : "normal"
                          }
                          showInfo={false}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  {selectedRecord.status === "Pending Approval" && (
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div className="mb-4">
                        <Title level={5}>Actions</Title>
                      </div>
                      <div className="space-y-3">
                        <Button
                          type="primary"
                          icon={<ThumbsUp size={14} />}
                          style={{
                            borderRadius: "6px",
                            background: "#52c41a",
                            width: "100%",
                            height: "40px",
                          }}
                        >
                          Approve Request
                        </Button>
                        <Button
                          danger
                          icon={<ThumbsDown size={14} />}
                          style={{
                            borderRadius: "6px",
                            width: "100%",
                            height: "40px",
                          }}
                        >
                          Reject Request
                        </Button>
                        <Button
                          icon={<MessageSquare size={14} />}
                          style={{
                            borderRadius: "6px",
                            width: "100%",
                            height: "40px",
                          }}
                        >
                          Request More Information
                        </Button>
                      </div>
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
