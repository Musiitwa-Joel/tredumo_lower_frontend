import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  List,
  Avatar,
  Select,
  DatePicker,
  Input,
  Statistic,
  Tooltip,
  Modal,
  Form,
  Popconfirm,
  message,
  Badge,
  Empty,
  Spin,
} from "antd";
import {
  Bell,
  Users,
  AlertTriangle,
  Settings,
  Send,
  Filter,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  BellOff,
  UserCheck,
  Clock,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Calendar,
  Info,
  Mail,
  MessageSquare,
} from "lucide-react";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Search } = Input;

function App() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState < any > null;
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState < any > null;
  const [form] = Form.useForm();

  const cardStyle = {
    marginBottom: "0px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  const notificationStats = [
    {
      title: "Total Notifications",
      value: 1234,
      icon: <Bell size={20} />,
      color: "#1890ff",
      trend: "+12%",
    },
    {
      title: "Active Recipients",
      value: 892,
      icon: <Users size={20} />,
      color: "#52c41a",
      trend: "+5%",
    },
    {
      title: "Failed Deliveries",
      value: 23,
      icon: <AlertTriangle size={20} />,
      color: "#ff4d4f",
      trend: "-2%",
    },
    {
      title: "Avg. Response Time",
      value: "2.5m",
      icon: <Clock size={20} />,
      color: "#722ed1",
      trend: "-8%",
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Data refreshed successfully");
    }, 1000);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // Implement search logic here
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    // Implement status filter logic here
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    // Implement type filter logic here
  };

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
    // Implement date filter logic here
  };

  const handleCreateNotification = (values) => {
    console.log("Form values:", values);
    message
      .loading("Sending notification...", 1.5)
      .then(() => message.success("Notification sent successfully"));
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleDeleteNotification = (record) => {
    message.success("Notification deleted successfully");
    // Implement delete logic here
  };

  const notificationsColumns = [
    {
      title: "Notification",
      dataIndex: "notification",
      key: "notification",
      render: (text, record) => (
        <Space>
          <Badge
            status={
              record.status === "Sent"
                ? "success"
                : record.status === "Failed"
                  ? "error"
                  : "processing"
            }
          >
            <Avatar
              style={{
                backgroundColor:
                  record.type === "system"
                    ? "#1890ff"
                    : record.type === "alert"
                      ? "#ff4d4f"
                      : "#52c41a",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {record.type === "system" ? (
                <Bell size={14} />
              ) : record.type === "alert" ? (
                <AlertTriangle size={14} />
              ) : (
                <UserCheck size={14} />
              )}
            </Avatar>
          </Badge>
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: "14px" }}>
              {text}
            </Text>
            <Space size={8}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.timestamp}
              </Text>
              {record.priority === "high" && (
                <Tag color="red">High Priority</Tag>
              )}
            </Space>
          </Space>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "system" ? "blue" : type === "alert" ? "error" : "success"
          }
          style={{ borderRadius: "4px" }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Recipients",
      dataIndex: "recipients",
      key: "recipients",
      render: (count, record) => (
        <Space>
          <Avatar.Group maxCount={3} size="small">
            {Array(count > 3 ? 3 : count)
              .fill(null)
              .map((_, index) => (
                <Avatar key={index} style={{ backgroundColor: "#1890ff" }}>
                  <Users size={12} />
                </Avatar>
              ))}
          </Avatar.Group>
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          Sent: { icon: <CheckCircle size={14} />, color: "success" },
          Failed: { icon: <XCircle size={14} />, color: "error" },
          Scheduled: { icon: <Calendar size={14} />, color: "processing" },
          Draft: { icon: <Edit size={14} />, color: "default" },
        };
        return (
          <Tag
            icon={statusConfig[status].icon}
            color={statusConfig[status].color}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "4px",
              padding: "1px 4px",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => {
                setSelectedNotification(record);
                setIsViewModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              disabled={record.status === "Sent"}
            />
          </Tooltip>
          <Popconfirm
            title="Delete notification"
            description="Are you sure you want to delete this notification?"
            onConfirm={() => handleDeleteNotification(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const notificationsData = [
    {
      key: "1",
      notification: "System Maintenance Alert",
      type: "system",
      recipients: 1200,
      status: "Sent",
      timestamp: "2024-02-20 14:30",
      priority: "high",
      message:
        "System maintenance scheduled for tonight at 22:00 UTC. Expected downtime: 2 hours.",
    },
    {
      key: "2",
      notification: "New Policy Update",
      type: "alert",
      recipients: 892,
      status: "Scheduled",
      timestamp: "2024-02-21 09:00",
      priority: "high",
      message:
        "Important updates to company policies. Please review the attached documents.",
    },
    {
      key: "3",
      notification: "Holiday Schedule",
      type: "announcement",
      recipients: 1150,
      status: "Draft",
      timestamp: "2024-02-22 10:00",
      message: "Updated holiday schedule for the upcoming quarter.",
    },
  ];

  const recipientGroups = [
    { key: "1", name: "All Employees", count: 1200, status: "active" },
    { key: "2", name: "Management", count: 50, status: "active" },
    { key: "3", name: "IT Department", count: 100, status: "active" },
    { key: "4", name: "HR Team", count: 25, status: "inactive" },
  ];

  return (
    <div
      style={{
        padding: "0px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Spin spinning={loading} tip="Loading..." size="large">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0px",
                backgroundColor: "#fff",
                padding: "16px 24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Space>
                <Settings size={28} style={{ color: "#1890ff" }} />
                <Title level={2} style={{ margin: 0 }}>
                  Notification Management
                </Title>
              </Space>
              <Space size="middle">
                <Tooltip title="Refresh data">
                  <Button
                    icon={<RefreshCcw size={16} />}
                    onClick={handleRefresh}
                  >
                    Refresh
                  </Button>
                </Tooltip>
                <Button
                  type="primary"
                  icon={<Send size={16} />}
                  onClick={() => setIsCreateModalVisible(true)}
                  style={{
                    background: "linear-gradient(to right, #1890ff, #096dd9)",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(24,144,255,0.35)",
                  }}
                >
                  Create Notification
                </Button>
              </Space>
            </div>
          </Col>

          {notificationStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                style={{
                  ...cardStyle,
                  borderLeft: `4px solid ${stat.color}`,
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Statistic
                  title={
                    <Space>
                      {React.cloneElement(stat.icon, {
                        style: { color: stat.color },
                      })}
                      <span style={{ color: "#666" }}>{stat.title}</span>
                    </Space>
                  }
                  value={stat.value}
                  valueStyle={{ color: stat.color, fontSize: "24px" }}
                  suffix={
                    <Tag
                      color={stat.trend.startsWith("+") ? "success" : "error"}
                      style={{ marginLeft: "8px", borderRadius: "4px" }}
                    >
                      {stat.trend}
                    </Tag>
                  }
                />
              </Card>
            </Col>
          ))}

          <Col span={24}>
            <Card
              title={
                <Space size="middle">
                  <MessageSquare size={20} style={{ color: "#1890ff" }} />
                  <span>Notification History</span>
                </Space>
              }
              style={cardStyle}
              extra={
                <Space size="middle" wrap>
                  <Search
                    placeholder="Search notifications"
                    style={{ width: 200 }}
                    onSearch={handleSearch}
                    allowClear
                  />
                  <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={handleStatusChange}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "sent", label: "Sent" },
                      { value: "scheduled", label: "Scheduled" },
                      { value: "draft", label: "Draft" },
                      { value: "failed", label: "Failed" },
                    ]}
                  />
                  <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={handleTypeChange}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "system", label: "System" },
                      { value: "alert", label: "Alerts" },
                      { value: "announcement", label: "Announcements" },
                    ]}
                  />
                  <RangePicker
                    style={{ width: 250 }}
                    onChange={handleDateRangeChange}
                  />
                  <Button icon={<Filter size={16} />}>Filter</Button>
                </Space>
              }
            >
              <Table
                columns={notificationsColumns}
                dataSource={notificationsData}
                size="small"
                pagination={{
                  total: 100,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} items`,
                }}
                loading={loading}
                locale={{
                  emptyText: <Empty description="No notifications found" />,
                }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <Users size={20} style={{ color: "#1890ff" }} />
                  <span>Recipient Groups</span>
                </Space>
              }
              style={cardStyle}
              extra={
                <Button type="link" icon={<Edit size={16} />}>
                  Manage Groups
                </Button>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={recipientGroups}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="text" icon={<Edit size={16} />} />,
                      <Button
                        type="text"
                        icon={
                          item.status === "active" ? (
                            <BellOff size={16} />
                          ) : (
                            <Bell size={16} />
                          )
                        }
                        onClick={() =>
                          message.success(
                            `Notifications ${
                              item.status === "active" ? "disabled" : "enabled"
                            } for ${item.name}`
                          )
                        }
                      />,
                      <Tooltip title="More actions">
                        <Button type="text" icon={<MoreVertical size={16} />} />
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge
                          status={
                            item.status === "active" ? "success" : "default"
                          }
                        >
                          <Avatar style={{ backgroundColor: "#1890ff" }}>
                            <Users size={16} />
                          </Avatar>
                        </Badge>
                      }
                      title={<Text strong>{item.name}</Text>}
                      description={
                        <Space size="middle">
                          <Text type="secondary">{item.count} members</Text>
                          <Tag
                            color={
                              item.status === "active" ? "success" : "default"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <Settings size={20} style={{ color: "#1890ff" }} />
                  <span>Quick Actions</span>
                </Space>
              }
              style={cardStyle}
            >
              <List
                size="large"
                dataSource={[
                  {
                    title: "Schedule Maintenance Alert",
                    icon: <AlertTriangle size={16} />,
                    color: "#ff4d4f",
                  },
                  {
                    title: "Send Policy Update",
                    icon: <Send size={16} />,
                    color: "#1890ff",
                  },
                  {
                    title: "Manage Templates",
                    icon: <Settings size={16} />,
                    color: "#52c41a",
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Button
                      type="text"
                      icon={React.cloneElement(item.icon, {
                        color: item.color,
                      })}
                      block
                      style={{
                        textAlign: "left",
                        height: "48px",
                        borderRadius: "8px",
                      }}
                      onClick={() => message.info(`${item.title} clicked`)}
                    >
                      <Text strong>{item.title}</Text>
                    </Button>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title={
            <Space>
              <Send size={20} style={{ color: "#1890ff" }} />
              <span>Create New Notification</span>
            </Space>
          }
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setIsCreateModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button key="schedule" type="default" icon={<Calendar size={16} />}>
              Schedule
            </Button>,
            <Button
              key="submit"
              type="primary"
              icon={<Send size={16} />}
              onClick={() => form.submit()}
            >
              Send Now
            </Button>,
          ]}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateNotification}
          >
            <Form.Item
              label="Notification Type"
              name="type"
              required
              rules={[
                { required: true, message: "Please select notification type" },
              ]}
            >
              <Select
                defaultValue="announcement"
                options={[
                  { value: "system", label: "System Alert" },
                  { value: "alert", label: "Important Alert" },
                  { value: "announcement", label: "Announcement" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Recipients"
              name="recipients"
              required
              rules={[{ required: true, message: "Please select recipients" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select recipient groups"
                defaultValue={["1"]}
                options={recipientGroups.map((group) => ({
                  value: group.key,
                  label: `${group.name} (${group.count})`,
                  disabled: group.status === "inactive",
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Subject"
              name="subject"
              required
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Message"
              name="message"
              required
              rules={[{ required: true, message: "Please enter message" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Priority" name="priority">
              <Select
                defaultValue="normal"
                options={[
                  { value: "high", label: "High" },
                  { value: "normal", label: "Normal" },
                  { value: "low", label: "Low" },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={
            <Space>
              <Info size={20} style={{ color: "#1890ff" }} />
              <span>Notification Details</span>
            </Space>
          }
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedNotification && (
            <div>
              <Paragraph>
                <Text strong>Type: </Text>
                <Tag
                  color={
                    selectedNotification.type === "system"
                      ? "blue"
                      : selectedNotification.type === "alert"
                        ? "error"
                        : "success"
                  }
                >
                  {selectedNotification.type.charAt(0).toUpperCase() +
                    selectedNotification.type.slice(1)}
                </Tag>
              </Paragraph>
              <Paragraph>
                <Text strong>Status: </Text>
                <Tag
                  color={
                    selectedNotification.status === "Sent"
                      ? "success"
                      : selectedNotification.status === "Failed"
                        ? "error"
                        : "processing"
                  }
                >
                  {selectedNotification.status}
                </Tag>
              </Paragraph>
              <Paragraph>
                <Text strong>Recipients: </Text>
                {selectedNotification.recipients}
              </Paragraph>
              <Paragraph>
                <Text strong>Timestamp: </Text>
                {selectedNotification.timestamp}
              </Paragraph>
              <Paragraph>
                <Text strong>Message: </Text>
                <br />
                {selectedNotification.message}
              </Paragraph>
            </div>
          )}
        </Modal>
      </Spin>
    </div>
  );
}

export default App;
