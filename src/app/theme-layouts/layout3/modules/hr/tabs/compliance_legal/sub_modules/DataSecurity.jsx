"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  DatePicker,
  Form,
  Tabs,
  Badge,
  Progress,
  Alert,
  List,
  Timeline,
  message,
  Modal,
  Divider,
  Drawer,
  Descriptions,
  Popconfirm,
  Avatar,
  Breadcrumb,
} from "antd";
import {
  Lock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  Plus,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Activity,
  Key,
  Database,
  UserPlus,
  Users,
  FileCheck,
  Settings,
  HelpCircle,
  BarChart2,
  Clock,
  Info,
} from "lucide-react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function DataSecurity() {
  // State management
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [accessModalVisible, setAccessModalVisible] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [form] = Form.useForm();
  const [accessForm] = Form.useForm();
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  // Mock data - now contained within the component
  const securityLogs = [
    {
      id: "LOG-001",
      action: "Login",
      performedBy: "John Doe (HR Director)",
      timestamp: "2023-09-15T08:30:00",
      module: "HR System",
      ipAddress: "192.168.1.45",
      severity: "info",
      details: "Successful login from campus network",
      browser: "Chrome 116.0.5845.110",
      device: "Windows 10",
      location: "Kampala, Uganda",
    },
    {
      id: "LOG-002",
      action: "File Access",
      performedBy: "Sarah Mukasa (Payroll Manager)",
      timestamp: "2023-09-15T09:15:00",
      module: "Payroll Records",
      ipAddress: "192.168.1.62",
      severity: "info",
      details: "Accessed September payroll file",
      browser: "Firefox 117.0",
      device: "Ubuntu 22.04",
      location: "Entebbe, Uganda",
    },
    {
      id: "LOG-003",
      action: "Data Export",
      performedBy: "Robert Kigongo (IT Admin)",
      timestamp: "2023-09-15T10:45:00",
      module: "Employee Database",
      ipAddress: "192.168.1.30",
      severity: "warning",
      details: "Exported employee contact information",
      browser: "Edge 116.0.1938.69",
      device: "Windows 11",
      location: "Kampala, Uganda",
    },
    {
      id: "LOG-004",
      action: "Failed Login",
      performedBy: "Unknown User",
      timestamp: "2023-09-15T11:20:00",
      module: "HR System",
      ipAddress: "45.227.135.89",
      severity: "critical",
      details: "Multiple failed login attempts",
      browser: "Unknown",
      device: "Unknown",
      location: "Lagos, Nigeria",
    },
    {
      id: "LOG-005",
      action: "Password Reset",
      performedBy: "System",
      timestamp: "2023-09-15T11:35:00",
      module: "User Management",
      ipAddress: "192.168.1.1",
      severity: "info",
      details: "Password reset for user ID: EMP-2345",
      browser: "N/A",
      device: "Server",
      location: "Kampala, Uganda",
    },
    {
      id: "LOG-006",
      action: "Policy Update",
      performedBy: "Grace Nambi (Compliance Officer)",
      timestamp: "2023-09-15T13:10:00",
      module: "Policy Management",
      ipAddress: "192.168.1.75",
      severity: "info",
      details: "Updated Data Retention Policy",
      browser: "Chrome 116.0.5845.110",
      device: "MacOS 13.5.1",
      location: "Kampala, Uganda",
    },
    {
      id: "LOG-007",
      action: "User Creation",
      performedBy: "Robert Kigongo (IT Admin)",
      timestamp: "2023-09-15T14:25:00",
      module: "User Management",
      ipAddress: "192.168.1.30",
      severity: "info",
      details: "Created new user account for Jane Akello",
      browser: "Edge 116.0.1938.69",
      device: "Windows 11",
      location: "Kampala, Uganda",
    },
    {
      id: "LOG-008",
      action: "Failed API Access",
      performedBy: "Integration Service",
      timestamp: "2023-09-15T15:40:00",
      module: "API Gateway",
      ipAddress: "192.168.5.10",
      severity: "warning",
      details: "Invalid API key used for payroll integration",
      browser: "N/A",
      device: "Server",
      location: "Kampala, Uganda",
    },
  ];

  const accessRoles = [
    {
      id: "ROLE-001",
      name: "HR Administrator",
      description: "Full access to HR records and compliance documents",
      permissions: [
        "View All Records",
        "Edit Records",
        "Delete Records",
        "Manage Policies",
      ],
      assignedTo: 5,
      lastReviewed: "2023-08-15",
      reviewedBy: "Grace Nambi",
    },
    {
      id: "ROLE-002",
      name: "Department Head",
      description:
        "Access to department staff records and limited compliance documents",
      permissions: [
        "View Department Records",
        "Edit Department Records",
        "View Policies",
      ],
      assignedTo: 12,
      lastReviewed: "2023-07-22",
      reviewedBy: "Robert Kigongo",
    },
    {
      id: "ROLE-003",
      name: "Staff Member",
      description: "Access to own records and public policies",
      permissions: ["View Own Records", "View Public Policies"],
      assignedTo: 156,
      lastReviewed: "2023-06-30",
      reviewedBy: "John Doe",
    },
    {
      id: "ROLE-004",
      name: "Compliance Officer",
      description: "Access to all compliance documents and audit logs",
      permissions: [
        "View All Records",
        "View Audit Logs",
        "Manage Policies",
        "Generate Reports",
      ],
      assignedTo: 3,
      lastReviewed: "2023-08-10",
      reviewedBy: "Grace Nambi",
    },
    {
      id: "ROLE-005",
      name: "Payroll Manager",
      description: "Access to payroll records and financial data",
      permissions: [
        "View Payroll Records",
        "Edit Payroll Records",
        "Generate Payroll Reports",
      ],
      assignedTo: 2,
      lastReviewed: "2023-07-15",
      reviewedBy: "John Doe",
    },
  ];

  const securityPolicies = [
    {
      id: "SP-001",
      title: "Data Protection Policy",
      description:
        "Policy for protecting personal data in compliance with Uganda's Data Protection and Privacy Act",
      lastUpdated: "2023-05-20",
      status: "active",
      version: "2.1",
      approvedBy: "Board of Directors",
      reviewCycle: "Annual",
      nextReview: "2024-05-20",
      content: `
# Nkumba University Data Protection Policy

## 1. Introduction
This policy outlines how Nkumba University collects, uses, stores, and protects personal data in compliance with Uganda's Data Protection and Privacy Act.

## 2. Scope
This policy applies to all personal data processed by Nkumba University, including employee data, student data, and data of other stakeholders.

## 3. Data Collection Principles
- Personal data shall be collected for specified, explicit, and legitimate purposes
- Only necessary data shall be collected
- Data shall be accurate and kept up to date
- Data subjects shall be informed of data collection

## 4. Data Processing
- Processing shall be lawful, fair, and transparent
- Processing shall be limited to the purposes for which the data was collected
- Data shall be processed in a manner that ensures appropriate security

## 5. Data Subject Rights
- Right to access personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restriction of processing
- Right to data portability
- Right to object to processing

## 6. Data Security
- Technical measures to protect data
- Organizational measures to protect data
- Breach notification procedures

## 7. Data Retention
- Data shall be kept for no longer than necessary
- Retention periods for different categories of data
- Secure disposal of data

## 8. Compliance
- Regular audits and assessments
- Training for staff
- Appointment of Data Protection Officer

## 9. Review
This policy shall be reviewed annually or when significant changes in law or operations occur.
      `,
    },
    {
      id: "SP-002",
      title: "Access Control Policy",
      description: "Policy for managing access to HR systems and employee data",
      lastUpdated: "2023-06-15",
      status: "active",
      version: "1.5",
      approvedBy: "IT Steering Committee",
      reviewCycle: "Bi-annual",
      nextReview: "2023-12-15",
      content: "Detailed policy content here...",
    },
    {
      id: "SP-003",
      title: "Data Retention Policy",
      description: "Policy for retaining and disposing of employee data",
      lastUpdated: "2023-04-10",
      status: "active",
      version: "2.0",
      approvedBy: "Legal Department",
      reviewCycle: "Annual",
      nextReview: "2024-04-10",
      content: "Detailed policy content here...",
    },
    {
      id: "SP-004",
      title: "Security Incident Response Plan",
      description:
        "Procedures for responding to data breaches and security incidents",
      lastUpdated: "2023-07-05",
      status: "active",
      version: "3.2",
      approvedBy: "Crisis Management Team",
      reviewCycle: "Annual",
      nextReview: "2024-07-05",
      content: "Detailed policy content here...",
    },
    {
      id: "SP-005",
      title: "Employee Privacy Notice",
      description:
        "Information provided to employees about how their personal data is processed",
      lastUpdated: "2023-03-18",
      status: "active",
      version: "1.3",
      approvedBy: "HR Director",
      reviewCycle: "Annual",
      nextReview: "2024-03-18",
      content: "Detailed policy content here...",
    },
  ];

  const dataCategories = [
    {
      id: "CAT-001",
      name: "Employee Personal Information",
      description:
        "Contact details, emergency contacts, and demographic information",
      retentionPeriod: "7 years after employment ends",
      sensitivity: "High",
      location: "HR Database",
      encryptionStatus: "Encrypted",
      accessLevel: "HR Administrators only",
    },
    {
      id: "CAT-002",
      name: "Employment Records",
      description: "Contracts, position history, and performance evaluations",
      retentionPeriod: "10 years after employment ends",
      sensitivity: "Medium",
      location: "HR Database, Document Management System",
      encryptionStatus: "Encrypted",
      accessLevel: "HR Administrators, Department Heads",
    },
    {
      id: "CAT-003",
      name: "Payroll Records",
      description: "Salary history, tax withholdings, and benefits",
      retentionPeriod: "7 years",
      sensitivity: "High",
      location: "Payroll System",
      encryptionStatus: "Encrypted",
      accessLevel: "HR Administrators, Payroll Managers",
    },
    {
      id: "CAT-004",
      name: "Grievance and Disciplinary Records",
      description: "Complaints, investigations, and resolutions",
      retentionPeriod: "5 years after resolution",
      sensitivity: "High",
      location: "HR Database, Document Management System",
      encryptionStatus: "Encrypted",
      accessLevel: "HR Administrators, Legal Department",
    },
  ];

  // Filter security logs based on search text and filters
  const getFilteredLogs = () => {
    return securityLogs.filter((log) => {
      // Text search
      const textMatch =
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchText.toLowerCase()) ||
        log.module.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details.toLowerCase().includes(searchText.toLowerCase());

      // Severity filter
      const severityMatch =
        filterSeverity === "all" || log.severity === filterSeverity;

      // Action filter
      const actionMatch =
        filterAction === "all" ||
        log.action.toLowerCase().includes(filterAction.toLowerCase());

      // Date range filter
      let dateMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const logDate = new Date(log.timestamp);
        const startDate = dateRange[0].startOf("day").toDate();
        const endDate = dateRange[1].endOf("day").toDate();
        dateMatch = logDate >= startDate && logDate <= endDate;
      }

      return textMatch && severityMatch && actionMatch && dateMatch;
    });
  };

  // Event handlers
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Data refreshed successfully");
    }, 1000);
  };

  const showPolicyModal = (policy = null) => {
    if (policy) {
      setSelectedPolicy(policy);
      form.setFieldsValue({
        title: policy.title,
        description: policy.description,
        reviewCycle: policy.reviewCycle,
        content: policy.content,
      });
    } else {
      setSelectedPolicy(null);
      form.resetFields();
    }
    setPolicyModalVisible(true);
  };

  const showAccessRequestModal = () => {
    accessForm.resetFields();
    setAccessModalVisible(true);
  };

  const handleAddPolicy = () => {
    form.validateFields().then((values) => {
      if (selectedPolicy) {
        message.success("Security policy updated successfully");
      } else {
        message.success("Security policy added successfully");
      }
      setPolicyModalVisible(false);
    });
  };

  const handleAccessRequest = () => {
    accessForm.validateFields().then((values) => {
      message.success("Access request submitted successfully");
      setAccessModalVisible(false);
    });
  };

  const showLogDetails = (log) => {
    setSelectedLog(log);
    setDetailsDrawerVisible(true);
  };

  // Table columns
  const logColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Performed By",
      dataIndex: "performedBy",
      key: "performedBy",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => {
        const date = new Date(timestamp);
        return (
          <Space>
            <Calendar size={14} />
            <span>{date.toLocaleString()}</span>
          </Space>
        );
      },
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => {
        let color = "default";
        let icon = null;

        switch (severity) {
          case "info":
            color = "success";
            icon = <CheckCircle size={14} />;
            break;
          case "warning":
            color = "warning";
            icon = <AlertTriangle size={14} />;
            break;
          case "critical":
            color = "error";
            icon = <XCircle size={14} />;
            break;
        }

        return (
          <Tag color={color} icon={icon}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showLogDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="data-security">
      {/* Page header */}
      <div className="mb-6">
        <Breadcrumb className="mb-2">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Compliance & Legal</Breadcrumb.Item>
          <Breadcrumb.Item>Data Security</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex justify-between items-center">
          <Title level={3} className="mb-0">
            Data Security Management
          </Title>
          <Space>
            <Button icon={<HelpCircle size={16} />}>Help</Button>
            <Button type="primary" icon={<Settings size={16} />}>
              Settings
            </Button>
          </Space>
        </div>
        <Text type="secondary">
          Manage data security compliance and privacy controls for Nkumba
          University
        </Text>
      </div>

      {/* Dashboard cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
            bodyStyle={{ height: "100%" }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Shield size={16} className="mr-2 text-green-500" />
                  <span>Security Compliance</span>
                </div>
              }
              value={95}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
            <div className="mt-4">
              <Progress
                percent={95}
                status="active"
                strokeColor={{
                  "0%": "#52c41a",
                  "100%": "#87d068",
                }}
              />
              <div className="mt-2 text-xs text-gray-500">
                <CheckCircle size={14} className="inline mr-1 text-green-500" />
                <span>All critical security controls are in place</span>
              </div>
              <div className="mt-4">
                <Text type="secondary">Last audit: August 15, 2023</Text>
                <br />
                <Text type="secondary">Next audit: November 15, 2023</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
            bodyStyle={{ height: "100%" }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <AlertTriangle size={16} className="mr-2 text-amber-500" />
                  <span>Security Incidents</span>
                </div>
              }
              value={0}
              valueStyle={{ color: "#52c41a" }}
              suffix={<Text type="secondary">this month</Text>}
            />
            <div className="mt-4">
              <Title level={5}>Incident History</Title>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <Text>Critical</Text>
                  <Text>0</Text>
                </div>
                <Progress percent={0} size="small" strokeColor="#f5222d" />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Warning</Text>
                  <Text>2</Text>
                </div>
                <Progress percent={20} size="small" strokeColor="#faad14" />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Info</Text>
                  <Text>8</Text>
                </div>
                <Progress percent={80} size="small" strokeColor="#1890ff" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
            bodyStyle={{ height: "100%" }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Lock size={16} className="mr-2 text-blue-500" />
                  <span>Data Protection</span>
                </div>
              }
              value="Compliant"
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="mt-4">
              <Title level={5}>Uganda Data Protection Act</Title>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <Text>Data Collection</Text>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between mb-1">
                  <Text>Data Storage</Text>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between mb-1">
                  <Text>Data Processing</Text>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between mb-1">
                  <Text>Data Sharing</Text>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main content */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow duration-300"
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ padding: "0 16px", marginBottom: 0 }}
          className="data-security-tabs"
        >
          <TabPane
            tab={
              <span className="flex items-center">
                <Activity size={16} className="mr-2" /> Security Logs
              </span>
            }
            key="1"
          >
            <div className="p-4">
              <div className="mb-4 flex justify-between flex-wrap gap-2">
                <Space wrap>
                  <Input
                    placeholder="Search logs..."
                    prefix={<Search size={16} />}
                    style={{ width: 250 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Select
                    defaultValue="all"
                    style={{ width: 150 }}
                    onChange={(value) => setFilterAction(value)}
                  >
                    <Option value="all">All Actions</Option>
                    <Option value="login">Login</Option>
                    <Option value="file">File Access</Option>
                    <Option value="export">Data Export</Option>
                    <Option value="failed">Failed Login</Option>
                  </Select>
                  <Select
                    defaultValue="all"
                    style={{ width: 150 }}
                    onChange={(value) => setFilterSeverity(value)}
                  >
                    <Option value="all">All Severities</Option>
                    <Option value="info">Info</Option>
                    <Option value="warning">Warning</Option>
                    <Option value="critical">Critical</Option>
                  </Select>
                  <RangePicker
                    style={{ width: 250 }}
                    onChange={(dates) => setDateRange(dates)}
                  />
                  <Button icon={<Filter size={16} />}>Filter</Button>
                </Space>
                <Space wrap>
                  <Button
                    icon={<RefreshCw size={16} />}
                    onClick={handleRefresh}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                  <Button icon={<Download size={16} />} type="primary">
                    Export
                  </Button>
                </Space>
              </div>
              <Table
                columns={logColumns}
                dataSource={getFilteredLogs()}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 5,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                className="security-logs-table"
                bordered
                size="middle"
              />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className="flex items-center">
                <Key size={16} className="mr-2" /> Access Control
              </span>
            }
            key="2"
          >
            <div className="p-4">
              <div className="mb-4">
                <Alert
                  message="Role-Based Access Control"
                  description="Nkumba University implements role-based access control to ensure that employees only have access to the data they need to perform their job functions."
                  type="info"
                  showIcon
                  icon={<Info size={16} />}
                  className="mb-4"
                />
              </div>
              <div className="mb-4 flex justify-between flex-wrap gap-2">
                <Space wrap>
                  <Input
                    placeholder="Search roles..."
                    prefix={<Search size={16} />}
                    style={{ width: 250 }}
                  />
                  <Button icon={<Filter size={16} />}>Filter</Button>
                </Space>
                <Space wrap>
                  <Button
                    icon={<RefreshCw size={16} />}
                    onClick={handleRefresh}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                  <Button type="primary" icon={<UserPlus size={16} />}>
                    Add Role
                  </Button>
                  <Button
                    icon={<Key size={16} />}
                    onClick={showAccessRequestModal}
                  >
                    Request Access
                  </Button>
                </Space>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={accessRoles}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button key="view" type="link">
                        View
                      </Button>,
                      <Button key="edit" type="link">
                        Edit
                      </Button>,
                      <Popconfirm
                        title="Are you sure you want to delete this role?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() =>
                          message.success(`Role ${item.name} deleted`)
                        }
                        key={`popconfirm-${item.id}`}
                      >
                        <Button key="delete" type="link" danger>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                    className="hover:bg-gray-50 transition-colors duration-200 p-2 rounded"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<Users size={24} />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      title={
                        <div className="flex items-center">
                          <Text strong>{item.name}</Text>
                          <Badge
                            count={item.assignedTo}
                            className="ml-2"
                            style={{ backgroundColor: "#1890ff" }}
                          />
                        </div>
                      }
                      description={
                        <div>
                          <div>{item.description}</div>
                          <div className="mt-2">
                            {item.permissions.map((permission, index) => (
                              <Tag
                                key={index}
                                color="blue"
                                className="mb-1 mr-1"
                              >
                                {permission}
                              </Tag>
                            ))}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            <Space>
                              <Clock size={14} />
                              <Text type="secondary">
                                Last reviewed: {item.lastReviewed} by{" "}
                                {item.reviewedBy}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className="flex items-center">
                <FileText size={16} className="mr-2" /> Security Policies
              </span>
            }
            key="3"
          >
            <div className="p-4">
              <div className="mb-4 flex justify-between flex-wrap gap-2">
                <Space wrap>
                  <Input
                    placeholder="Search policies..."
                    prefix={<Search size={16} />}
                    style={{ width: 250 }}
                  />
                  <Button icon={<Filter size={16} />}>Filter</Button>
                </Space>
                <Space wrap>
                  <Button
                    icon={<RefreshCw size={16} />}
                    onClick={handleRefresh}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => showPolicyModal()}
                  >
                    Add Policy
                  </Button>
                </Space>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={securityPolicies}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        onClick={() => showPolicyModal(item)}
                      >
                        View
                      </Button>,
                      <Button
                        key="edit"
                        type="link"
                        onClick={() => showPolicyModal(item)}
                      >
                        Edit
                      </Button>,
                      <Button key="download" type="link">
                        Download
                      </Button>,
                    ]}
                    className="hover:bg-gray-50 transition-colors duration-200 p-2 rounded"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<FileCheck size={24} />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      title={
                        <div className="flex items-center">
                          <Text strong>{item.title}</Text>
                          <Tag color="success" className="ml-2">
                            Active
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>{item.description}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            <Space>
                              <Calendar size={14} />
                              <Text type="secondary">
                                Last updated: {item.lastUpdated}
                              </Text>
                              <Divider type="vertical" />
                              <Text type="secondary">
                                Version: {item.version}
                              </Text>
                              <Divider type="vertical" />
                              <Text type="secondary">
                                Next review: {item.nextReview}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className="flex items-center">
                <Database size={16} className="mr-2" /> Data Management
              </span>
            }
            key="4"
          >
            <div className="p-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>Data Retention Schedule</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="mb-4">
                      <Timeline>
                        {dataCategories.map((category) => (
                          <Timeline.Item
                            key={category.id}
                            color="green"
                            dot={<Database size={16} />}
                          >
                            <div>
                              <Text strong>{category.name}</Text>
                              <div className="text-xs text-gray-500">
                                Retention Period: {category.retentionPeriod}
                              </div>
                            </div>
                            <div className="mt-1">
                              <Text type="secondary">
                                {category.description}
                              </Text>
                            </div>
                            <div className="mt-1">
                              <Tag color="blue">
                                Sensitivity: {category.sensitivity}
                              </Tag>
                              <Tag color="green">Encrypted</Tag>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <Shield size={16} className="mr-2" />
                        <span>Data Security Measures</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <div>
                          <div>
                            <Text strong>Regular Security Audits</Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              Quarterly security audits by internal IT team
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <div>
                          <div>
                            <Text strong>Employee Training Programs</Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              Mandatory annual data security training for all
                              staff
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <div>
                          <div>
                            <Text strong>Data Encryption</Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              All sensitive data encrypted at rest and in
                              transit
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <div>
                          <div>
                            <Text strong>Access Controls</Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              Role-based access control with multi-factor
                              authentication
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <div>
                          <div>
                            <Text strong>Backup and Recovery</Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              Daily backups with monthly recovery testing
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        type="primary"
                        icon={<BarChart2 size={16} />}
                        block
                      >
                        Generate Security Report
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modals and Drawers */}
      <Modal
        title={selectedPolicy ? "Edit Security Policy" : "Add Security Policy"}
        open={policyModalVisible}
        onOk={handleAddPolicy}
        onCancel={() => setPolicyModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setPolicyModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddPolicy}>
            {selectedPolicy ? "Update Policy" : "Add Policy"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Policy Title"
                rules={[
                  { required: true, message: "Please enter policy title" },
                ]}
              >
                <Input placeholder="Enter policy title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reviewCycle"
                label="Review Cycle"
                rules={[
                  { required: true, message: "Please select review cycle" },
                ]}
              >
                <Select placeholder="Select review cycle">
                  <Option value="quarterly">Quarterly</Option>
                  <Option value="biannual">Bi-annual</Option>
                  <Option value="annual">Annual</Option>
                  <Option value="biennial">Biennial</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter policy description" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Policy Content"
            rules={[{ required: true, message: "Please enter policy content" }]}
          >
            <Input.TextArea rows={10} placeholder="Enter policy content" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Request Access"
        open={accessModalVisible}
        onOk={handleAccessRequest}
        onCancel={() => setAccessModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAccessModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAccessRequest}>
            Submit Request
          </Button>,
        ]}
      >
        <Form form={accessForm} layout="vertical">
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              {accessRoles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason for Access"
            rules={[{ required: true, message: "Please enter reason" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter reason for access request"
            />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Access Duration"
            rules={[{ required: true, message: "Please select duration" }]}
          >
            <Select placeholder="Select duration">
              <Option value="temporary">Temporary (1 week)</Option>
              <Option value="short">Short-term (1 month)</Option>
              <Option value="long">Long-term (6 months)</Option>
              <Option value="permanent">Permanent</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Security Log Details"
        placement="right"
        onClose={() => setDetailsDrawerVisible(false)}
        open={detailsDrawerVisible}
        width={600}
        extra={
          <Space>
            <Button onClick={() => setDetailsDrawerVisible(false)}>
              Close
            </Button>
            <Button type="primary" icon={<Download size={16} />}>
              Export
            </Button>
          </Space>
        }
      >
        {selectedLog && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Log ID">
                {selectedLog.id}
              </Descriptions.Item>
              <Descriptions.Item label="Action">
                <Tag color="blue">{selectedLog.action}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Performed By">
                {selectedLog.performedBy}
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp">
                {new Date(selectedLog.timestamp).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Module">
                {selectedLog.module}
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {selectedLog.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag
                  color={
                    selectedLog.severity === "info"
                      ? "success"
                      : selectedLog.severity === "warning"
                        ? "warning"
                        : "error"
                  }
                >
                  {selectedLog.severity.charAt(0).toUpperCase() +
                    selectedLog.severity.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Browser">
                {selectedLog.browser}
              </Descriptions.Item>
              <Descriptions.Item label="Device">
                {selectedLog.device}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedLog.location}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Details</Divider>
            <Paragraph>{selectedLog.details}</Paragraph>

            <Divider orientation="left">Related Logs</Divider>
            <List
              size="small"
              bordered
              dataSource={securityLogs
                .filter(
                  (log) =>
                    log.id !== selectedLog.id &&
                    (log.performedBy === selectedLog.performedBy ||
                      log.ipAddress === selectedLog.ipAddress)
                )
                .slice(0, 3)}
              renderItem={(item) => (
                <List.Item>
                  <div>
                    <div>
                      <Tag color="blue">{item.action}</Tag> {item.details}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "No related logs found" }}
            />
          </>
        )}
      </Drawer>
    </div>
  );
}
