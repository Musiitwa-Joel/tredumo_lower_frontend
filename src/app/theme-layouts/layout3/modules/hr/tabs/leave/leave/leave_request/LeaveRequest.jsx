import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Button,
  Typography,
  Tooltip,
  Badge,
  Dropdown,
  Modal,
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Select,
  Input,
  DatePicker,
  Divider,
  List,
  Avatar,
  Timeline,
  theme,
} from "antd";
import { MenuProps } from "antd";
import {
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  FileCheck,
  AlertCircle,
  Calendar as CalendarIcon,
  Users,
  Briefcase,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Download,
  Printer,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Dayjs } from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { useToken } = theme;

// Mock data for demonstration
const leaveData = [
  {
    key: "1",
    employee: "Musiitwa Joel",
    department: "Engineering",
    type: "Annual Leave",
    startDate: "2024-03-01",
    endDate: "2024-03-03",
    duration: "3 days",
    status: "Approved",
    documents: true,
    avatar: "https://i.pravatar.cc/150?img=1",
    approver: "Sarah Wilson",
    submittedAt: "2024-02-25",
    reason: "Family vacation",
    history: [
      { action: "Submitted", date: "2024-02-25", by: "John Doe" },
      { action: "Reviewed", date: "2024-02-26", by: "Team Lead" },
      { action: "Approved", date: "2024-02-27", by: "Sarah Wilson" },
    ],
  },
  {
    key: "2",
    employee: "Lubega Tasha Desire",
    department: "Marketing",
    type: "Sick Leave",
    startDate: "2024-03-05",
    endDate: "2024-03-06",
    duration: "2 days",
    status: "Pending",
    documents: true,
    avatar: "https://i.pravatar.cc/150?img=2",
    approver: "Mike Thompson",
    submittedAt: "2024-03-04",
    reason: "Medical appointment",
    history: [
      { action: "Submitted", date: "2024-03-04", by: "Jane Smith" },
      { action: "Under Review", date: "2024-03-04", by: "System" },
    ],
  },
  {
    key: "3",
    employee: "Akampereza Darlington",
    department: "Sales",
    type: "Emergency Leave",
    startDate: "2024-03-07",
    endDate: "2024-03-07",
    duration: "1 day",
    status: "Rejected",
    documents: false,
    avatar: "https://i.pravatar.cc/150?img=3",
    approver: "Linda Parker",
    submittedAt: "2024-03-06",
    reason: "Personal emergency",
    history: [
      { action: "Submitted", date: "2024-03-06", by: "Mike Johnson" },
      { action: "Reviewed", date: "2024-03-06", by: "Team Lead" },
      { action: "Rejected", date: "2024-03-06", by: "Linda Parker" },
    ],
  },
  {
    key: "4",
    employee: "Mulinde Hakim",
    department: "HR",
    type: "Annual Leave",
    startDate: "2024-03-10",
    endDate: "2024-03-14",
    duration: "5 days",
    status: "Pending",
    documents: true,
    avatar: "https://i.pravatar.cc/150?img=4",
    approver: "Sarah Wilson",
    submittedAt: "2024-03-03",
    reason: "Summer vacation",
    history: [
      { action: "Submitted", date: "2024-03-03", by: "Emily Davis" },
      { action: "Under Review", date: "2024-03-03", by: "System" },
    ],
  },
];

// Department leave statistics
const departmentStats = [
  { department: "Engineering", approved: 15, pending: 3, rejected: 2 },
  { department: "Marketing", approved: 8, pending: 2, rejected: 1 },
  { department: "Sales", approved: 12, pending: 4, rejected: 3 },
  { department: "HR", approved: 6, pending: 1, rejected: 0 },
];

function App() {
  const { token } = useToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] =
    useState < [Dayjs | null, Dayjs | null] > [null, null];
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const getStatusIcon = useCallback(
    (status) => {
      switch (status) {
        case "Approved":
          return (
            <CheckCircle size={16} style={{ color: token.colorSuccess }} />
          );
        case "Rejected":
          return <XCircle size={16} style={{ color: token.colorError }} />;
        default:
          return <Clock size={16} style={{ color: token.colorWarning }} />;
      }
    },
    [token]
  );

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "warning";
    }
  }, []);

  const handleAction = useCallback((action, record) => {
    message.success(`${action} leave request for ${record.employee}`);
    setIsModalVisible(false);
  }, []);

  const handleExport = useCallback(() => {
    message.success("Exporting leave data...");
  }, []);

  const handlePrint = useCallback(() => {
    message.success("Preparing print view...");
  }, []);

  const handleRefresh = useCallback(() => {
    message.success("Refreshing data...");
  }, []);

  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

  const actionItems = useCallback(
    (record) => [
      {
        key: "1",
        label: "View Details",
        icon: <FileCheck size={16} />,
        onClick: () => {
          setSelectedLeave(record);
          setIsModalVisible(true);
        },
      },
      {
        key: "2",
        label: "Approve",
        icon: <CheckCircle size={16} />,
        onClick: () => handleAction("Approved", record),
      },
      {
        key: "3",
        label: "Reject",
        icon: <XCircle size={16} />,
        onClick: () => handleAction("Rejected", record),
      },
    ],
    [handleAction]
  );

  const filteredData = useMemo(() => {
    return leaveData.filter((item) => {
      const matchesSearch =
        item.employee.toLowerCase().includes(searchText.toLowerCase()) ||
        item.department.toLowerCase().includes(searchText.toLowerCase());
      const matchesType =
        filterType === "all" ||
        item.type.toLowerCase().includes(filterType.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" ||
        item.department.toLowerCase() === selectedDepartment.toLowerCase();
      return matchesSearch && matchesType && matchesDepartment;
    });
  }, [searchText, filterType, selectedDepartment]);

  const columns = useMemo(
    () => [
      {
        title: "Employee",
        dataIndex: "employee",
        key: "employee",
        ellipsis: true,
        width: "20%",
        render: (text, record) => (
          <Space>
            <Avatar src={record.avatar} size="small" />
            <Space direction="vertical" size={0}>
              <Text strong>{text}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.department}
              </Text>
            </Space>
          </Space>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (text) => (
          <Tag color="blue" style={{ padding: "0px 4px" }}>
            {text}
          </Tag>
        ),
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        render: (text, record) => (
          <Tooltip title={`${record.startDate} to ${record.endDate}`}>
            <Space direction="vertical" size={0}>
              <Text>{text}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.startDate}
              </Text>
            </Space>
          </Tooltip>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Badge
            status={getStatusColor(status)}
            text={
              <Space>
                <span style={{ marginLeft: "4px" }}>{status}</span>
              </Space>
            }
          />
        ),
      },
      {
        title: "Documents",
        key: "documents",
        dataIndex: "documents",
        render: (hasDocuments) => (
          <Tooltip title={hasDocuments ? "Documents Attached" : "No Documents"}>
            <Badge
              status={hasDocuments ? "success" : "default"}
              text={hasDocuments ? "Attached" : "None"}
            />
          </Tooltip>
        ),
      },
      {
        title: "Approver",
        dataIndex: "approver",
        key: "approver",
        render: (text) => (
          <Text style={{ color: token.colorTextSecondary }}>{text}</Text>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (record) => (
          <Space>
            <Tooltip title="View Details">
              <Button
                size="small"
                type="text"
                icon={<FileText size={16} />}
                onClick={() => {
                  setSelectedLeave(record);
                  setIsModalVisible(true);
                }}
                style={{ color: token.colorPrimary }}
              />
            </Tooltip>
            <Dropdown menu={{ items: actionItems(record) }} trigger={["click"]}>
              <Button
                size="small"
                type="text"
                icon={<MoreVertical size={16} />}
              />
            </Dropdown>
          </Space>
        ),
      },
    ],
    [token, getStatusIcon, getStatusColor, actionItems]
  );

  const totalLeaves = filteredData.length;
  const pendingLeaves = filteredData.filter(
    (item) => item.status === "Pending"
  ).length;
  const approvedLeaves = filteredData.filter(
    (item) => item.status === "Approved"
  ).length;
  const rejectedLeaves = filteredData.filter(
    (item) => item.status === "Rejected"
  ).length;

  const cardStyle = {
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    borderRadius: token.borderRadiusLG,
  };

  const headerStyle = {
    backgroundColor: token.colorBgContainer,
    padding: "16px 24px",
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
  };

  return (
    <div
      style={{
        padding: "0px",
        backgroundColor: token.colorBgLayout,
        minHeight: "100vh",
      }}
    >
      {/* Dashboard Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: "4px" }}>
        <Col span={24}>
          <Card style={cardStyle}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Space align="center">
                <Title
                  level={4}
                  style={{ margin: 0, color: token.colorTextHeading }}
                >
                  Leave Management Dashboard
                </Title>
                <Tag color="blue">{pendingLeaves} Pending Approvals</Tag>
              </Space>
              <Space>
                <Tooltip title="Refresh Data">
                  <Button
                    size="small"
                    icon={<RefreshCw size={12} />}
                    onClick={handleRefresh}
                    style={{ borderColor: token.colorBorder }}
                  />
                </Tooltip>
                <Tooltip title="Export Data">
                  <Button
                    size="small"
                    icon={<Download size={12} />}
                    onClick={handleExport}
                    style={{ borderColor: token.colorBorder }}
                  />
                </Tooltip>
                <Tooltip title="Print">
                  <Button
                    size="small"
                    icon={<Printer size={12} />}
                    onClick={handlePrint}
                    style={{ borderColor: token.colorBorder }}
                  />
                </Tooltip>
                <Tooltip title="Settings">
                  <Button
                    size="small"
                    icon={<Settings size={12} />}
                    style={{ borderColor: token.colorBorder }}
                  />
                </Tooltip>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={[4, 4]} style={{ marginBottom: "4px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle}>
            <Statistic
              title={
                <Space>
                  <Users size={16} /> Total Leaves
                </Space>
              }
              value={totalLeaves}
              prefix={
                <Tag color="blue">{((totalLeaves / 50) * 100).toFixed(1)}%</Tag>
              }
            />
            <Progress
              percent={totalLeaves * 2}
              showInfo={false}
              strokeColor={token.colorPrimary}
              style={{ marginTop: "16px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle}>
            <Statistic
              title={
                <Space>
                  <Clock size={16} /> Pending
                </Space>
              }
              value={pendingLeaves}
              valueStyle={{ color: token.colorWarning }}
              prefix={
                <Tag color="warning">
                  {((pendingLeaves / totalLeaves) * 100).toFixed(1)}%
                </Tag>
              }
            />
            <Progress
              percent={pendingLeaves * 2}
              showInfo={false}
              strokeColor={token.colorWarning}
              style={{ marginTop: "16px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle}>
            <Statistic
              title={
                <Space>
                  <CheckCircle size={16} /> Approved
                </Space>
              }
              value={approvedLeaves}
              valueStyle={{ color: token.colorSuccess }}
              prefix={
                <Tag color="success">
                  {((approvedLeaves / totalLeaves) * 100).toFixed(1)}%
                </Tag>
              }
            />
            <Progress
              percent={approvedLeaves * 2}
              showInfo={false}
              strokeColor={token.colorSuccess}
              style={{ marginTop: "16px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle}>
            <Statistic
              title={
                <Space>
                  <XCircle size={16} /> Rejected
                </Space>
              }
              value={rejectedLeaves}
              valueStyle={{ color: token.colorError }}
              prefix={
                <Tag color="error">
                  {((rejectedLeaves / totalLeaves) * 100).toFixed(1)}%
                </Tag>
              }
            />
            <Progress
              percent={rejectedLeaves * 2}
              showInfo={false}
              strokeColor={token.colorError}
              style={{ marginTop: "16px" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row gutter={[16, 16]} style={{ marginBottom: "8px" }}>
        <Col xs={24} md={8}>
          <Input
            size="small"
            placeholder="Search by employee or department"
            prefix={
              <Search size={16} style={{ color: token.colorTextSecondary }} />
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: token.borderRadiusLG }}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            size="small"
            style={{ width: "100%" }}
            placeholder="Filter by type"
            value={filterType}
            onChange={setFilterType}
            suffixIcon={<ChevronDown size={16} />}
            options={[
              { value: "all", label: "All Types" },
              { value: "annual", label: "Annual Leave" },
              { value: "sick", label: "Sick Leave" },
              { value: "emergency", label: "Emergency Leave" },
            ]}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            size="small"
            style={{ width: "100%" }}
            placeholder="Filter by department"
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            suffixIcon={<ChevronDown size={16} />}
            options={[
              { value: "all", label: "All Departments" },
              { value: "engineering", label: "Engineering" },
              { value: "marketing", label: "Marketing" },
              { value: "sales", label: "Sales" },
              { value: "hr", label: "HR" },
            ]}
          />
        </Col>
        <Col xs={24} md={4}>
          <RangePicker
            size="small"
            style={{ width: "100%" }}
            onChange={handleDateRangeChange}
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[4, 4]}>
        <Col xs={24} xl={24}>
          <Card style={cardStyle}>
            <Table
              columns={columns}
              dataSource={filteredData}
              size="small"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} items`,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Leave Details Modal */}
      <Modal
        title={
          <Space style={{ color: token.colorTextHeading }}>
            <FileText size={20} />
            Leave Request Details
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        style={{ top: 20 }}
        footer={[
          <Button
            size="small"
            key="back"
            onClick={() => setIsModalVisible(false)}
          >
            Close
          </Button>,
          <Button
            size="small"
            key="approve"
            type="primary"
            icon={<CheckCircle size={12} />}
            onClick={() => handleAction("Approved", selectedLeave)}
          >
            Approve
          </Button>,
          <Button
            size="small"
            key="reject"
            danger
            icon={<XCircle size={12} />}
            onClick={() => handleAction("Rejected", selectedLeave)}
          >
            Reject
          </Button>,
        ]}
      >
        {selectedLeave && (
          <div style={{ maxHeight: "60vh", overflow: "auto", padding: "24px" }}>
            <Row gutter={[16, 24]}>
              <Col span={24}>
                <Space align="start">
                  <Avatar src={selectedLeave.avatar} size={64} />
                  <Space direction="vertical" size={0}>
                    <Title
                      level={5}
                      style={{ margin: 0, color: token.colorTextHeading }}
                    >
                      {selectedLeave.employee}
                    </Title>
                    <Text type="secondary">{selectedLeave.department}</Text>
                    <Badge
                      status={getStatusColor(selectedLeave.status)}
                      text={selectedLeave.status}
                    />
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Divider orientation="left" style={{ margin: "24px 0" }}>
                  Leave Details
                </Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Leave Type: </Text>
                    <Tag
                      icon={<CalendarIcon size={14} />}
                      color="blue"
                      style={{ marginLeft: "8px" }}
                    >
                      {selectedLeave.type}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Duration: </Text>
                    <Text style={{ marginLeft: "8px" }}>
                      {selectedLeave.duration}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Start Date: </Text>
                    <Text style={{ marginLeft: "8px" }}>
                      {selectedLeave.startDate}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>End Date: </Text>
                    <Text style={{ marginLeft: "8px" }}>
                      {selectedLeave.endDate}
                    </Text>
                  </Col>
                  <Col span={24}>
                    <Text strong>Reason: </Text>
                    <Paragraph style={{ marginTop: "8px" }}>
                      {selectedLeave.reason}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Text strong>Documents: </Text>
                    <Badge
                      status={selectedLeave.documents ? "success" : "default"}
                      text={selectedLeave.documents ? "Attached" : "None"}
                      style={{ marginLeft: "8px" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Text strong>Submitted: </Text>
                    <Text style={{ marginLeft: "8px" }}>
                      {selectedLeave.submittedAt}
                    </Text>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Divider orientation="left" style={{ margin: "24px 0" }}>
                  Request Timeline
                </Divider>
                <Timeline
                  items={selectedLeave.history.map((item) => ({
                    children: (
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ color: token.colorTextHeading }}>
                          {item.action}
                        </Text>
                        <Text type="secondary">{item.date}</Text>
                        <Text type="secondary">by {item.by}</Text>
                      </Space>
                    ),
                    color:
                      item.action === "Approved"
                        ? token.colorSuccess
                        : item.action === "Rejected"
                          ? token.colorError
                          : token.colorPrimary,
                  }))}
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
