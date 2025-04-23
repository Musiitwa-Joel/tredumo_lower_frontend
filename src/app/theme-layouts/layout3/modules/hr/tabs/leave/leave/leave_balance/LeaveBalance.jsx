import React from "react";
import { useState } from "react";
import {
  Layout,
  Tabs,
  Card,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Row,
  Col,
  Statistic,
  DatePicker,
  message,
  Drawer,
  List,
  Avatar,
  Divider,
  Progress,
} from "antd";
import {
  FileText,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  BarChart,
  Clock,
  User,
} from "lucide-react";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Mock data
const leaveTypes = [
  {
    id: 1,
    name: "Annual Leave",
    defaultDays: 20,
    carryForward: true,
    color: "green",
  },
  {
    id: 2,
    name: "Sick Leave",
    defaultDays: 10,
    carryForward: false,
    color: "red",
  },
  {
    id: 3,
    name: "Personal Leave",
    defaultDays: 5,
    carryForward: false,
    color: "blue",
  },
  {
    id: 4,
    name: "Maternity Leave",
    defaultDays: 90,
    carryForward: false,
    color: "purple",
  },
  {
    id: 5,
    name: "Paternity Leave",
    defaultDays: 14,
    carryForward: false,
    color: "cyan",
  },
];

const leaveRequests = [
  {
    id: 1,
    employee: "John Doe",
    type: "Annual Leave",
    startDate: "2024-05-01",
    endDate: "2024-05-05",
    status: "Pending",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
  },
  {
    id: 2,
    employee: "Jane Smith",
    type: "Sick Leave",
    startDate: "2024-05-10",
    endDate: "2024-05-11",
    status: "Approved",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
  },
  {
    id: 3,
    employee: "Mike Johnson",
    type: "Personal Leave",
    startDate: "2024-05-15",
    endDate: "2024-05-15",
    status: "Rejected",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
  },
  {
    id: 4,
    employee: "Emily Brown",
    type: "Maternity Leave",
    startDate: "2024-06-01",
    endDate: "2024-08-30",
    status: "Pending",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
  },
  {
    id: 5,
    employee: "David Lee",
    type: "Annual Leave",
    startDate: "2024-07-01",
    endDate: "2024-07-10",
    status: "Pending",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
  },
];

const employees = [
  { id: 1, name: "John Doe", department: "IT", totalLeave: 30, usedLeave: 10 },
  { id: 2, name: "Jane Smith", department: "HR", totalLeave: 28, usedLeave: 5 },
  {
    id: 3,
    name: "Mike Johnson",
    department: "Finance",
    totalLeave: 25,
    usedLeave: 8,
  },
  {
    id: 4,
    name: "Emily Brown",
    department: "Marketing",
    totalLeave: 27,
    usedLeave: 12,
  },
  {
    id: 5,
    name: "David Lee",
    department: "Operations",
    totalLeave: 26,
    usedLeave: 7,
  },
];

const CompactAdminLeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState < any > null;
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("New leave type:", values);
      message.success("New leave type added successfully");
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showDrawer = (employee) => {
    setSelectedEmployee(employee);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const leaveTypeColumns = [
    {
      title: "Leave Type",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Tag color={record.color}>{text}</Tag>,
    },
    {
      title: "Default Days",
      dataIndex: "defaultDays",
      key: "defaultDays",
    },
    {
      title: "Carry Forward",
      dataIndex: "carryForward",
      key: "carryForward",
      render: (carryForward) =>
        carryForward ? (
          <CheckCircle size={16} color="green" />
        ) : (
          <XCircle size={16} color="red" />
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button size="small" icon={<Edit size={12} />} />
          </Tooltip>
          <Popconfirm title="Are you sure to delete this leave type?">
            <Button size="small" icon={<Trash2 size={12} />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const leaveRequestColumns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} />
          {text}
        </Space>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Date Range",
      key: "dateRange",
      render: (record) => `${record.startDate} to ${record.endDate}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Approved"
            ? "green"
            : status === "Rejected"
              ? "red"
              : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button size="small" type="primary" icon={<CheckCircle size={14} />}>
            Approve
          </Button>
          <Button danger size="small" icon={<XCircle size={14} />}>
            Reject
          </Button>
          <Button size="small" icon={<FileText size={14} />}>
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const employeeColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Total Leave",
      dataIndex: "totalLeave",
      key: "totalLeave",
    },
    {
      title: "Used Leave",
      dataIndex: "usedLeave",
      key: "usedLeave",
    },
    {
      title: "Remaining Leave",
      key: "remainingLeave",
      render: (record) => (
        <Progress
          percent={
            ((record.totalLeave - record.usedLeave) / record.totalLeave) * 100
          }
          format={(percent) => `${record.totalLeave - record.usedLeave} days`}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button size="small" onClick={() => showDrawer(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", padding: "0px" }}>
      <Content>
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span>
                  <TrendingUp size={16} /> Dashboard
                </span>
              }
              key="1"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Total Employees"
                      value={employees.length}
                      prefix={<User size={20} />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Pending Requests"
                      value={
                        leaveRequests.filter((r) => r.status === "Pending")
                          .length
                      }
                      prefix={<Clock size={20} />}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Approved Leaves"
                      value={
                        leaveRequests.filter((r) => r.status === "Approved")
                          .length
                      }
                      prefix={<CheckCircle size={20} />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Rejected Leaves"
                      value={
                        leaveRequests.filter((r) => r.status === "Rejected")
                          .length
                      }
                      prefix={<XCircle size={20} />}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                  </Card>
                </Col>
              </Row>
              <Divider />
              <Title level={4}>Recent Leave Requests</Title>
              <Table
                size="small"
                columns={leaveRequestColumns}
                dataSource={leaveRequests}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Settings size={16} /> Leave Types
                </span>
              }
              key="2"
            >
              <Space style={{ marginBottom: 16 }}>
                <Button
                  size="small"
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={showModal}
                >
                  Add New Leave Type
                </Button>
                <Button size="small" icon={<Download size={16} />}>
                  Export Types
                </Button>
              </Space>
              <Table
                size="small"
                columns={leaveTypeColumns}
                dataSource={leaveTypes}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <User size={16} /> Employees
                </span>
              }
              key="3"
            >
              <Table
                size="small"
                columns={employeeColumns}
                dataSource={employees}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileText size={16} /> Leave Policy
                </span>
              }
              key="4"
            >
              <Form layout="vertical">
                <Form.Item name="policyContent" label="Leave Policy Content">
                  <Input.TextArea
                    rows={10}
                    placeholder="Enter your company's leave policy here..."
                  />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      size="small"
                      type="primary"
                      icon={<FileText size={12} />}
                    >
                      Save Policy
                    </Button>
                    <Button size="small" icon={<Download size={12} />}>
                      Export Policy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <BarChart size={16} /> Leave Trends
                </span>
              }
              key="5"
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <RangePicker style={{ width: "100%" }} />
                <Button
                  size="small"
                  icon={<BarChart size={12} />}
                  type="primary"
                >
                  Generate Report
                </Button>
              </Space>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Leave Distribution">
                    <div
                      style={{
                        height: 300,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f0f2f5",
                      }}
                    >
                      <Text type="secondary">
                        Leave distribution chart would be displayed here
                      </Text>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Monthly Leave Trends">
                    <div
                      style={{
                        height: 300,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f0f2f5",
                      }}
                    >
                      <Text type="secondary">
                        Monthly leave trends chart would be displayed here
                      </Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title="Add New Leave Type"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Leave Type Name"
              rules={[
                {
                  required: true,
                  message: "Please input the leave type name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="defaultDays"
              label="Default Days"
              rules={[
                {
                  required: true,
                  message: "Please input the default number of days!",
                },
              ]}
            >
              <InputNumber min={1} max={365} />
            </Form.Item>
            <Form.Item
              name="carryForward"
              label="Carry Forward"
              rules={[
                {
                  required: true,
                  message: "Please select if carry forward is allowed!",
                },
              ]}
            >
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="color"
              label="Color"
              rules={[{ required: true, message: "Please select a color!" }]}
            >
              <Select>
                <Option value="green">Green</Option>
                <Option value="red">Red</Option>
                <Option value="blue">Blue</Option>
                <Option value="orange">Orange</Option>
                <Option value="purple">Purple</Option>
                <Option value="cyan">Cyan</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Drawer
          title="Employee Leave Details"
          placement="right"
          closable={false}
          onClose={closeDrawer}
          visible={isDrawerVisible}
          width={400}
        >
          {selectedEmployee && (
            <div>
              <Avatar size={64} icon={<User />} />
              <Title level={4}>{selectedEmployee.name}</Title>
              <Paragraph>Department: {selectedEmployee.department}</Paragraph>
              <Divider />
              <Statistic
                title="Total Leave Balance"
                value={selectedEmployee.totalLeave - selectedEmployee.usedLeave}
                suffix="/ 30 days"
              />
              <Progress
                percent={
                  ((selectedEmployee.totalLeave - selectedEmployee.usedLeave) /
                    selectedEmployee.totalLeave) *
                  100
                }
                status="active"
              />
              <Divider />
              <List
                size="small"
                header={<div>Leave History</div>}
                bordered
                dataSource={[
                  {
                    type: "Annual Leave",
                    date: "2024-03-15 to 2024-03-20",
                    status: "Approved",
                  },
                  {
                    type: "Sick Leave",
                    date: "2024-02-10",
                    status: "Approved",
                  },
                  {
                    type: "Personal Leave",
                    date: "2024-01-05",
                    status: "Rejected",
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.type} description={item.date} />
                    <Tag color={item.status === "Approved" ? "green" : "red"}>
                      {item.status}
                    </Tag>
                  </List.Item>
                )}
              />
            </div>
          )}
        </Drawer>
      </Content>
    </Layout>
  );
};

export default CompactAdminLeaveManagement;
