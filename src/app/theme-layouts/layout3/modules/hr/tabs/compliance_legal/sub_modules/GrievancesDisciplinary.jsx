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
  Modal,
  Form,
  Tabs,
  Progress,
  Alert,
  Steps,
  message,
  Switch,
  Upload,
} from "antd";
import {
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  Plus,
  Download,
  Filter,
  RefreshCw,
  Edit,
  Eye,
  Clock,
  Users,
  BarChart2,
  Lock,
} from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Step } = Steps;

const initialGrievances = [
  {
    id: "GRV-001",
    employeeId: "EMP-001",
    employeeName: "John Mukasa",
    department: "Computer Science",
    category: "Workplace Harassment",
    description: "Inappropriate comments during team meetings.",
    dateReported: "2023-11-15",
    status: "pending",
    priority: "high",
    assignedTo: "Dr. Sarah Namukwaya",
    confidential: true,
  },
  {
    id: "GRV-002",
    employeeId: "EMP-005",
    employeeName: "Alice Nakato",
    department: "Human Resources",
    category: "Discrimination",
    description: "Unequal treatment based on gender.",
    dateReported: "2023-11-20",
    status: "investigating",
    priority: "medium",
    assignedTo: "Dr. Robert Okello",
    confidential: true,
  },
  {
    id: "GRV-003",
    employeeId: "EMP-010",
    employeeName: "David Ochieng",
    department: "Library",
    category: "Working Conditions",
    description: "Unsafe working environment due to poor ventilation.",
    dateReported: "2023-11-25",
    status: "resolved",
    priority: "low",
    assignedTo: "Prof. Jane Akello",
    confidential: false,
    resolution: "Ventilation system repaired and improved.",
    resolutionDate: "2023-12-01",
  },
];

export default function GrievanceManagement() {
  const [grievances, setGrievances] = useState(initialGrievances);
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [form] = Form.useForm();

  // Filter grievances based on search text
  const filteredGrievances = grievances.filter(
    (grievance) =>
      grievance.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      grievance.department.toLowerCase().includes(searchText.toLowerCase()) ||
      grievance.category.toLowerCase().includes(searchText.toLowerCase()) ||
      grievance.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const pendingGrievances = grievances.filter(
    (g) => g.status === "pending" || g.status === "investigating"
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Data refreshed successfully");
    }, 1000);
  };

  const showAddGrievanceModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showViewGrievanceModal = (grievance) => {
    setSelectedGrievance(grievance);
    setIsViewModalVisible(true);
  };

  const handleAddGrievance = () => {
    form.validateFields().then((values) => {
      const newGrievance = {
        id: `GRV-${Math.floor(Math.random() * 1000)}`,
        employeeId: "EMP-001", // Current user ID would be used here
        employeeName: "Current User", // Current user name would be used here
        department: values.department,
        category: values.category,
        description: values.description,
        dateReported: new Date().toISOString().split("T")[0],
        status: "pending",
        priority: values.priority,
        assignedTo: values.assignedTo || "",
        confidential: values.confidential,
      };

      setGrievances([...grievances, newGrievance]);
      setIsModalVisible(false);
      message.success("Grievance submitted successfully");
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text, record) => (
        <div>
          <Space>
            <Text strong>{text}</Text>
            {record.confidential && (
              <Lock size={14} className="text-gray-500" />
            )}
          </Space>
          <div className="text-xs text-gray-500">ID: {record.employeeId}</div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => {
        let color = "default";

        switch (text) {
          case "Workplace Harassment":
            color = "red";
            break;
          case "Working Conditions":
            color = "orange";
            break;
          case "Discrimination":
            color = "purple";
            break;
          case "Compensation":
            color = "blue";
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Date Reported",
      dataIndex: "dateReported",
      key: "dateReported",
      render: (date) => (
        <Space>
          <Calendar size={14} />
          <span>{date}</span>
        </Space>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color = "default";

        switch (priority) {
          case "low":
            color = "success";
            break;
          case "medium":
            color = "warning";
            break;
          case "high":
            color = "error";
            break;
        }

        return (
          <Tag color={color}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;

        switch (status) {
          case "pending":
            color = "warning";
            icon = <Clock size={12} />;
            break;
          case "investigating":
            color = "processing";
            icon = <MessageSquare size={12} />;
            break;
          case "resolved":
            color = "success";
            icon = <CheckCircle size={12} />;
            break;
          case "dismissed":
            color = "default";
            icon = <XCircle size={12} />;
            break;
        }

        return (
          <Tag
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0px 4px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "4px",
              height: "auto",
            }}
            color={color}
            icon={icon}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showViewGrievanceModal(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<Edit size={16} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const disciplinaryActions = [
    {
      id: "DA-001",
      employeeName: "John Mukasa",
      employeeId: "EMP-015",
      department: "Finance",
      actionType: "Verbal Warning",
      reason: "Repeated tardiness",
      date: "2023-09-15",
      issuedBy: "Dr. Sarah Namukwaya",
      status: "active",
    },
    {
      id: "DA-002",
      employeeName: "Alice Nakato",
      employeeId: "EMP-022",
      department: "Human Resources",
      actionType: "Written Warning",
      reason: "Unauthorized absence",
      date: "2023-09-28",
      issuedBy: "Dr. Robert Okello",
      status: "active",
    },
    {
      id: "DA-003",
      employeeName: "David Ochieng",
      employeeId: "EMP-031",
      department: "Computer Science",
      actionType: "Suspension",
      reason: "Violation of university policy",
      date: "2023-10-05",
      issuedBy: "Prof. Jane Akello",
      status: "active",
    },
  ];

  const disciplinaryColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div className="text-xs text-gray-500">ID: {record.employeeId}</div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Action Type",
      dataIndex: "actionType",
      key: "actionType",
      render: (text) => {
        let color = "default";

        switch (text) {
          case "Verbal Warning":
            color = "blue";
            break;
          case "Written Warning":
            color = "orange";
            break;
          case "Suspension":
            color = "red";
            break;
          case "Termination":
            color = "magenta";
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Space>
          <Calendar size={14} />
          <span>{date}</span>
        </Space>
      ),
    },
    {
      title: "Issued By",
      dataIndex: "issuedBy",
      key: "issuedBy",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Tooltip title="View">
            <Button type="text" icon={<Eye size={16} />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<Edit size={16} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="grievance-management">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-2 text-blue-500" />
                  <span>Total Grievances</span>
                </div>
              }
              value={grievances.length}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="mt-4">
              <Title level={5}>Status Breakdown</Title>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <Text>Pending</Text>
                  <Text>
                    {grievances.filter((g) => g.status === "pending").length}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (grievances.filter((g) => g.status === "pending").length /
                      grievances.length) *
                      100
                  )}
                  size="small"
                  strokeColor="#faad14"
                />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Investigating</Text>
                  <Text>
                    {
                      grievances.filter((g) => g.status === "investigating")
                        .length
                    }
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (grievances.filter((g) => g.status === "investigating")
                      .length /
                      grievances.length) *
                      100
                  )}
                  size="small"
                  strokeColor="#1890ff"
                />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Resolved</Text>
                  <Text>
                    {grievances.filter((g) => g.status === "resolved").length}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (grievances.filter((g) => g.status === "resolved").length /
                      grievances.length) *
                      100
                  )}
                  size="small"
                  strokeColor="#52c41a"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                <div className="flex items-center">
                  <AlertTriangle size={16} className="mr-2 text-amber-500" />
                  <span>Pending Resolution</span>
                </div>
              }
              value={pendingGrievances.length}
              valueStyle={{ color: "#faad14" }}
            />
            <div className="mt-4">
              <Title level={5}>Priority Breakdown</Title>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <Text>High Priority</Text>
                  <Text>
                    {
                      pendingGrievances.filter((g) => g.priority === "high")
                        .length
                    }
                  </Text>
                </div>
                <Progress
                  percent={
                    Math.round(
                      (pendingGrievances.filter((g) => g.priority === "high")
                        .length /
                        pendingGrievances.length) *
                        100
                    ) || 0
                  }
                  size="small"
                  strokeColor="#f5222d"
                />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Medium Priority</Text>
                  <Text>
                    {
                      pendingGrievances.filter((g) => g.priority === "medium")
                        .length
                    }
                  </Text>
                </div>
                <Progress
                  percent={
                    Math.round(
                      (pendingGrievances.filter((g) => g.priority === "medium")
                        .length /
                        pendingGrievances.length) *
                        100
                    ) || 0
                  }
                  size="small"
                  strokeColor="#faad14"
                />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Low Priority</Text>
                  <Text>
                    {
                      pendingGrievances.filter((g) => g.priority === "low")
                        .length
                    }
                  </Text>
                </div>
                <Progress
                  percent={
                    Math.round(
                      (pendingGrievances.filter((g) => g.priority === "low")
                        .length /
                        pendingGrievances.length) *
                        100
                    ) || 0
                  }
                  size="small"
                  strokeColor="#52c41a"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                <div className="flex items-center">
                  <BarChart2 size={16} className="mr-2 text-green-500" />
                  <span>Resolution Rate</span>
                </div>
              }
              value={85}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
            <div className="mt-4">
              <Title level={5}>Average Resolution Time</Title>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <Text>High Priority</Text>
                  <Text>5 days</Text>
                </div>
                <Progress percent={50} size="small" strokeColor="#f5222d" />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Medium Priority</Text>
                  <Text>12 days</Text>
                </div>
                <Progress percent={60} size="small" strokeColor="#faad14" />

                <div className="flex justify-between mb-1 mt-2">
                  <Text>Low Priority</Text>
                  <Text>18 days</Text>
                </div>
                <Progress percent={90} size="small" strokeColor="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <MessageSquare size={16} /> Grievances
              </span>
            }
            key="1"
          >
            <div className="mb-4 flex justify-between flex-wrap gap-2">
              <Space>
                <Input
                  placeholder="Search grievances..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">All Categories</Option>
                  <Option value="workplace-harassment">
                    Workplace Harassment
                  </Option>
                  <Option value="working-conditions">Working Conditions</Option>
                  <Option value="discrimination">Discrimination</Option>
                  <Option value="compensation">Compensation</Option>
                </Select>
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">All Statuses</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="investigating">Investigating</Option>
                  <Option value="resolved">Resolved</Option>
                  <Option value="dismissed">Dismissed</Option>
                </Select>
                <Button icon={<Filter size={16} />}>Filter</Button>
              </Space>
              <Space>
                <Button icon={<RefreshCw size={16} />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button icon={<Download size={16} />}>Export</Button>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={showAddGrievanceModal}
                >
                  Submit Grievance
                </Button>
              </Space>
            </div>
            <Table
              size="small"
              columns={columns}
              dataSource={filteredGrievances}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <AlertTriangle size={16} /> Disciplinary Actions
              </span>
            }
            key="2"
          >
            <div className="mb-4">
              <Alert
                message="Disciplinary Process"
                description="Nkumba University follows a fair and transparent disciplinary process in accordance with Uganda's labor laws and university policies."
                type="info"
                showIcon
              />
            </div>
            <div className="mb-4">
              <Steps current={-1} className="mb-8">
                <Step
                  title="Verbal Warning"
                  description="First step for minor infractions"
                />
                <Step
                  title="Written Warning"
                  description="Formal documentation of issues"
                />
                <Step
                  title="Final Warning"
                  description="Last chance before serious action"
                />
                <Step
                  title="Disciplinary Hearing"
                  description="Formal review of the case"
                />
                <Step
                  title="Action"
                  description="Suspension or termination if warranted"
                />
              </Steps>
            </div>
            <div className="mb-4 flex justify-between flex-wrap gap-2">
              <Space>
                <Input
                  placeholder="Search disciplinary actions..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                />
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">All Action Types</Option>
                  <Option value="verbal">Verbal Warning</Option>
                  <Option value="written">Written Warning</Option>
                  <Option value="suspension">Suspension</Option>
                  <Option value="termination">Termination</Option>
                </Select>
                <Button icon={<Filter size={16} />}>Filter</Button>
              </Space>
              <Space>
                <Button icon={<RefreshCw size={16} />}>Refresh</Button>
                <Button icon={<Download size={16} />}>Export</Button>
                <Button type="primary" icon={<Plus size={16} />}>
                  New Disciplinary Action
                </Button>
              </Space>
            </div>
            <Table
              size="small"
              columns={disciplinaryColumns}
              dataSource={disciplinaryActions}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Users size={16} /> Mediation & Resolution
              </span>
            }
            key="3"
          >
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Mediation Services" bordered={false}>
                    <div className="mb-4">
                      <Paragraph>
                        Nkumba University offers confidential mediation services
                        to help resolve workplace conflicts and grievances
                        before they escalate to formal complaints.
                      </Paragraph>
                    </div>
                    <div className="mb-4">
                      <Title level={5}>Available Mediators</Title>
                      <div className="mt-2">
                        <div className="flex justify-between mb-2 pb-2 border-b">
                          <div>
                            <Text strong>Dr. Sarah Namukwaya</Text>
                            <div className="text-xs text-gray-500">
                              Human Resources Department
                            </div>
                          </div>
                          <Button size="small">Request</Button>
                        </div>
                        <div className="flex justify-between mb-2 pb-2 border-b">
                          <div>
                            <Text strong>Prof. Robert Okello</Text>
                            <div className="text-xs text-gray-500">
                              Faculty of Law
                            </div>
                          </div>
                          <Button size="small">Request</Button>
                        </div>
                        <div className="flex justify-between mb-2">
                          <div>
                            <Text strong>Dr. Jane Akello</Text>
                            <div className="text-xs text-gray-500">
                              Psychology Department
                            </div>
                          </div>
                          <Button size="small">Request</Button>
                        </div>
                      </div>
                    </div>
                    <Button type="primary">Schedule Mediation</Button>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Resolution Statistics" bordered={false}>
                    <div className="mb-4">
                      <Title level={5}>Resolution Methods</Title>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <Text>Mediation</Text>
                          <Text>45%</Text>
                        </div>
                        <Progress
                          percent={45}
                          size="small"
                          strokeColor="#1890ff"
                        />

                        <div className="flex justify-between mb-1 mt-2">
                          <Text>Direct Resolution</Text>
                          <Text>30%</Text>
                        </div>
                        <Progress
                          percent={30}
                          size="small"
                          strokeColor="#52c41a"
                        />

                        <div className="flex justify-between mb-1 mt-2">
                          <Text>Formal Process</Text>
                          <Text>25%</Text>
                        </div>
                        <Progress
                          percent={25}
                          size="small"
                          strokeColor="#faad14"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Title level={5}>Satisfaction with Resolution</Title>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <Text>Satisfied</Text>
                          <Text>78%</Text>
                        </div>
                        <Progress
                          percent={78}
                          size="small"
                          strokeColor="#52c41a"
                        />

                        <div className="flex justify-between mb-1 mt-2">
                          <Text>Neutral</Text>
                          <Text>15%</Text>
                        </div>
                        <Progress
                          percent={15}
                          size="small"
                          strokeColor="#faad14"
                        />

                        <div className="flex justify-between mb-1 mt-2">
                          <Text>Unsatisfied</Text>
                          <Text>7%</Text>
                        </div>
                        <Progress
                          percent={7}
                          size="small"
                          strokeColor="#f5222d"
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Submit Grievance"
        visible={isModalVisible}
        onOk={handleAddGrievance}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Alert
            message="Confidentiality Notice"
            description="All grievances are handled with strict confidentiality. Your privacy will be respected throughout the process."
            type="info"
            showIcon
            className="mb-4"
          />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Please select your department" },
                ]}
              >
                <Select placeholder="Select department">
                  <Option value="Computer Science">Computer Science</Option>
                  <Option value="Business Administration">
                    Business Administration
                  </Option>
                  <Option value="Education">Education</Option>
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Arts and Social Sciences">
                    Arts and Social Sciences
                  </Option>
                  <Option value="Human Resources">Human Resources</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Library">Library</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Grievance Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select category">
                  <Option value="Workplace Harassment">
                    Workplace Harassment
                  </Option>
                  <Option value="Working Conditions">Working Conditions</Option>
                  <Option value="Discrimination">Discrimination</Option>
                  <Option value="Compensation">Compensation</Option>
                  <Option value="Management Issues">Management Issues</Option>
                  <Option value="Workload">Workload</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description of Grievance"
            rules={[
              { required: true, message: "Please describe your grievance" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Provide details of your grievance"
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: "Please select priority" }]}
                initialValue="medium"
              >
                <Select>
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignedTo" label="Preferred Handler (Optional)">
                <Select placeholder="Select preferred handler">
                  <Option value="EMP-010">HR Manager</Option>
                  <Option value="EMP-001">Department Head</Option>
                  <Option value="EMP-005">Faculty Dean</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="confidential"
            label="Confidentiality"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item name="attachments" label="Supporting Documents (Optional)">
            <Upload action="/api/upload" listType="text" maxCount={3}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Grievance Details"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
          <Button key="edit" type="primary" icon={<Edit size={16} />}>
            Update Status
          </Button>,
        ]}
        width={700}
      >
        {selectedGrievance && (
          <div>
            <div className="mb-4 pb-4 border-b">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Grievance ID</Text>
                    <div>
                      <Text strong>{selectedGrievance.id}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Status</Text>
                    <div>
                      <Tag
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 6px",
                          fontSize: "12px",
                          fontWeight: 500,
                          borderRadius: "4px",
                          height: "auto",
                        }}
                        color={
                          selectedGrievance.status === "resolved"
                            ? "success"
                            : selectedGrievance.status === "investigating"
                              ? "processing"
                              : selectedGrievance.status === "pending"
                                ? "warning"
                                : "default"
                        }
                      >
                        {selectedGrievance.status.charAt(0).toUpperCase() +
                          selectedGrievance.status.slice(1)}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="mb-4 pb-4 border-b">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Employee</Text>
                    <div>
                      <Space>
                        <Text strong>{selectedGrievance.employeeName}</Text>
                        {selectedGrievance.confidential && (
                          <Lock size={14} className="text-gray-500" />
                        )}
                      </Space>
                      <div className="text-xs text-gray-500">
                        ID: {selectedGrievance.employeeId}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Department</Text>
                    <div>
                      <Tag color="blue">{selectedGrievance.department}</Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="mb-4 pb-4 border-b">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Category</Text>
                    <div>
                      <Tag
                        color={
                          selectedGrievance.category === "Workplace Harassment"
                            ? "red"
                            : selectedGrievance.category ===
                                "Working Conditions"
                              ? "orange"
                              : selectedGrievance.category === "Discrimination"
                                ? "purple"
                                : "blue"
                        }
                      >
                        {selectedGrievance.category}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Priority</Text>
                    <div>
                      <Tag
                        color={
                          selectedGrievance.priority === "high"
                            ? "error"
                            : selectedGrievance.priority === "medium"
                              ? "warning"
                              : "success"
                        }
                      >
                        {selectedGrievance.priority.charAt(0).toUpperCase() +
                          selectedGrievance.priority.slice(1)}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="mb-4 pb-4 border-b">
              <div className="mb-2">
                <Text type="secondary">Description</Text>
                <div>
                  <Paragraph>{selectedGrievance.description}</Paragraph>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Date Reported</Text>
                    <div>
                      <Space>
                        <Calendar size={14} />
                        <Text>{selectedGrievance.dateReported}</Text>
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Assigned To</Text>
                    <div>
                      <Text>
                        {selectedGrievance.assignedTo || "Not assigned yet"}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {selectedGrievance.status === "resolved" &&
              selectedGrievance.resolution && (
                <div className="mb-4 pb-4 border-t pt-4">
                  <div className="mb-2">
                    <Text type="secondary">Resolution</Text>
                    <div>
                      <Paragraph>{selectedGrievance.resolution}</Paragraph>
                    </div>
                  </div>
                  <div className="mb-2">
                    <Text type="secondary">Resolution Date</Text>
                    <div>
                      <Space>
                        <Calendar size={14} />
                        <Text>{selectedGrievance.resolutionDate}</Text>
                      </Space>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
