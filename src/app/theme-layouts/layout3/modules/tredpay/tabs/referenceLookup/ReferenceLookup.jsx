import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Tabs,
  Drawer,
  Descriptions,
  Empty,
  Alert,
  ConfigProvider,
  theme,
  Card,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
  MailOutlined,
  ReloadOutlined,
  UserOutlined,
  BankOutlined,
  BookOutlined,
  HomeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Search: SearchInput } = Input;

// Mock data for demonstration
const mockPaymentReferences = [
  {
    id: "TRP-2023-001245",
    studentId: "NKU/2023/12345",
    studentName: "John Mukasa",
    amount: 1250000,
    paymentType: "Tuition",
    faculty: "Business Administration",
    semester: "Semester 1",
    academicYear: "2023/2024",
    paymentDate: "2023-09-05",
    status: "Completed",
    paymentMethod: "Mobile Money",
    transactionId: "MM78945612",
    receiptNumber: "NKU-REC-23-4567",
  },
  {
    id: "TRP-2023-001246",
    studentId: "NKU/2022/10987",
    studentName: "Sarah Namukasa",
    amount: 850000,
    paymentType: "Accommodation",
    faculty: "Law",
    semester: "Semester 1",
    academicYear: "2023/2024",
    paymentDate: "2023-09-06",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    transactionId: "BT45678912",
    receiptNumber: "",
  },
  {
    id: "TRP-2023-001247",
    studentId: "NKU/2021/08765",
    studentName: "David Ochieng",
    amount: 350000,
    paymentType: "Library Fee",
    faculty: "Information Technology",
    semester: "Semester 1",
    academicYear: "2023/2024",
    paymentDate: "2023-09-04",
    status: "Completed",
    paymentMethod: "Credit Card",
    transactionId: "CC12345678",
    receiptNumber: "NKU-REC-23-4568",
  },
  {
    id: "TRP-2023-001248",
    studentId: "NKU/2022/11234",
    studentName: "Grace Atim",
    amount: 1500000,
    paymentType: "Tuition",
    faculty: "Medicine",
    semester: "Semester 1",
    academicYear: "2023/2024",
    paymentDate: "2023-09-07",
    status: "Failed",
    paymentMethod: "Mobile Money",
    transactionId: "MM12345678",
    receiptNumber: "",
  },
  {
    id: "TRP-2023-001249",
    studentId: "NKU/2023/12346",
    studentName: "Peter Okello",
    amount: 750000,
    paymentType: "Examination Fee",
    faculty: "Education",
    semester: "Semester 1",
    academicYear: "2023/2024",
    paymentDate: "2023-09-08",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    transactionId: "BT87654321",
    receiptNumber: "NKU-REC-23-4569",
  },
  {
    id: "TRP-2023-001250",
    studentId: "NKU/2021/09876",
    studentName: "Mary Nakato",
    amount: 1250000,
    paymentType: "Tuition",
    faculty: "Social Sciences",
    semester: "Semester 1",
    academicYear: "2023/2024",
    paymentDate: "2023-09-09",
    status: "Completed",
    paymentMethod: "Mobile Money",
    transactionId: "MM98765432",
    receiptNumber: "NKU-REC-23-4570",
  },
];

// Faculty options for Nkumba University
const faculties = [
  "Business Administration",
  "Law",
  "Information Technology",
  "Medicine",
  "Education",
  "Social Sciences",
  "Engineering",
  "Arts and Humanities",
];

// Payment types
const paymentTypes = [
  "Tuition",
  "Accommodation",
  "Library Fee",
  "Examination Fee",
  "Registration Fee",
  "Graduation Fee",
  "ID Card Fee",
  "Other",
];

// Payment methods
const paymentMethods = [
  "Mobile Money",
  "Bank Transfer",
  "Credit Card",
  "Cash",
  "Cheque",
];

// Academic years
const academicYears = ["2023/2024", "2022/2023", "2021/2022", "2020/2021"];

// Semesters
const semesters = ["Semester 1", "Semester 2", "Summer"];

function ReferenceLookup() {
  const [form] = Form.useForm();
  const [references, setReferences] = useState(mockPaymentReferences);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
  });

  useEffect(() => {
    // Calculate statistics
    if (searchPerformed) {
      const total = references.length;
      const completed = references.filter(
        (ref) => ref.status === "Completed"
      ).length;
      const pending = references.filter(
        (ref) => ref.status === "Pending"
      ).length;
      const failed = references.filter((ref) => ref.status === "Failed").length;

      setStats({
        total,
        completed,
        pending,
        failed,
      });
    }
  }, [references, searchPerformed]);

  const handleSearch = (values) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real application, this would be an API call to search for references
      // For now, we'll just filter the mock data
      let filteredReferences = [...mockPaymentReferences];

      if (values.referenceId) {
        filteredReferences = filteredReferences.filter((ref) =>
          ref.id.toLowerCase().includes(values.referenceId.toLowerCase())
        );
      }

      if (values.studentId) {
        filteredReferences = filteredReferences.filter((ref) =>
          ref.studentId.toLowerCase().includes(values.studentId.toLowerCase())
        );
      }

      if (values.studentName) {
        filteredReferences = filteredReferences.filter((ref) =>
          ref.studentName
            .toLowerCase()
            .includes(values.studentName.toLowerCase())
        );
      }

      if (values.paymentType) {
        filteredReferences = filteredReferences.filter(
          (ref) => ref.paymentType === values.paymentType
        );
      }

      if (values.faculty) {
        filteredReferences = filteredReferences.filter(
          (ref) => ref.faculty === values.faculty
        );
      }

      if (values.status) {
        filteredReferences = filteredReferences.filter(
          (ref) => ref.status === values.status
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const startDate = values.dateRange[0].format("YYYY-MM-DD");
        const endDate = values.dateRange[1].format("YYYY-MM-DD");

        filteredReferences = filteredReferences.filter(
          (ref) => ref.paymentDate >= startDate && ref.paymentDate <= endDate
        );
      }

      setReferences(filteredReferences);
      setSearchPerformed(true);
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    setReferences(mockPaymentReferences);
    setSearchPerformed(false);
  };

  const handleViewDetails = (record) => {
    setSelectedReference(record);
    setDetailsVisible(true);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Completed":
        return <Tag color="success">Completed</Tag>;
      case "Pending":
        return <Tag color="warning">Pending</Tag>;
      case "Failed":
        return <Tag color="error">Failed</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case "Tuition":
        return <BookOutlined />;
      case "Accommodation":
        return <HomeOutlined />;
      case "Library Fee":
        return <BookOutlined />;
      case "Examination Fee":
        return <FileTextOutlined />;
      default:
        return <BankOutlined />;
    }
  };

  const columns = [
    {
      title: "Reference ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: "Amount (UGX)",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <span style={{ fontWeight: "bold" }}>
          {amount.toLocaleString()} UGX
        </span>
      ),
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      filters: paymentTypes.map((type) => ({ text: type, value: type })),
      onFilter: (value, record) => record.paymentType === value,
      render: (type) => (
        <Space>
          {getPaymentTypeIcon(type)}
          {type}
        </Space>
      ),
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
      filters: faculties.map((faculty) => ({ text: faculty, value: faculty })),
      onFilter: (value, record) => record.faculty === value,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Completed", value: "Completed" },
        { text: "Pending", value: "Pending" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const onTabChange = (key) => {
    setActiveTabKey(key);

    if (key === "1") {
      setReferences(mockPaymentReferences);
    } else if (key === "2") {
      setReferences(
        mockPaymentReferences.filter((ref) => ref.status === "Completed")
      );
    } else if (key === "3") {
      setReferences(
        mockPaymentReferences.filter((ref) => ref.status === "Pending")
      );
    } else if (key === "4") {
      setReferences(
        mockPaymentReferences.filter((ref) => ref.status === "Failed")
      );
    }
  };

  const tabList = [
    {
      key: "1",
      tab: (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          All References
        </span>
      ),
    },
    {
      key: "2",
      tab: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          Completed
        </span>
      ),
    },
    {
      key: "3",
      tab: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Pending
        </span>
      ),
    },
    {
      key: "4",
      tab: (
        <span>
          <CloseCircleOutlined style={{ marginRight: 8 }} />
          Failed
        </span>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.compactAlgorithm],
        token: {
          colorPrimary: "#1e4620", // Nkumba University green
        },
      }}
    >
      <div className="p-24">
        {/* Header Card with Nkumba University branding */}
        <Card
          style={{
            marginBottom: 24,
            background:
              "linear-gradient(rgba(80, 104, 190, 0.9), rgba(31, 33, 168, 0.85))",
            color: "white",
          }}
          bordered={false}
        >
          <Row gutter={16} align="middle">
            <Col>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#1e4620",
                }}
              >
                NU
              </div>
            </Col>
            <Col>
              <Title level={3} style={{ color: "white", margin: 0 }}>
                Payment Reference Lookup
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                Nkumba University Payment System
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Search Form Card */}
        <Card
          title={
            <Space>
              <SearchOutlined />
              <span>Search Payment References</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Form
            form={form}
            name="reference_search"
            layout="vertical"
            onFinish={handleSearch}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="referenceId" label="Reference ID">
                  <Input
                    placeholder="Enter reference ID"
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="studentId" label="Student ID">
                  <Input
                    placeholder="Enter student ID"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="studentName" label="Student Name">
                  <Input
                    placeholder="Enter student name"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="paymentType" label="Payment Type">
                  <Select placeholder="Select payment type" allowClear>
                    {paymentTypes.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="faculty" label="Faculty">
                  <Select placeholder="Select faculty" allowClear>
                    {faculties.map((faculty) => (
                      <Option key={faculty} value={faculty}>
                        {faculty}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="status" label="Status">
                  <Select placeholder="Select status" allowClear>
                    <Option value="Completed">Completed</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Failed">Failed</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="dateRange" label="Payment Date Range">
                  <RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="academicYear" label="Academic Year">
                  <Select placeholder="Select academic year" allowClear>
                    {academicYears.map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" gutter={[16, 16]}>
              <Col>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    Search
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {searchPerformed && (
          <>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Total References"
                    value={stats.total}
                    prefix={
                      <FileTextOutlined
                        style={{ fontSize: 24, color: "#1e4620" }}
                      />
                    }
                    valueStyle={{ color: "#1e4620" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Completed Payments"
                    value={stats.completed}
                    prefix={
                      <CheckCircleOutlined
                        style={{ fontSize: 24, color: "#52c41a" }}
                      />
                    }
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Pending Payments"
                    value={stats.pending}
                    prefix={
                      <ClockCircleOutlined
                        style={{ fontSize: 24, color: "#faad14" }}
                      />
                    }
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Failed Payments"
                    value={stats.failed}
                    prefix={
                      <CloseCircleOutlined
                        style={{ fontSize: 24, color: "#ff4d4f" }}
                      />
                    }
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Results Card with Tabs */}
            <Card
              style={{ marginBottom: 24 }}
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={onTabChange}
              tabBarExtraContent={
                <Space>
                  <Button icon={<FileExcelOutlined />}>Export to Excel</Button>
                  <Button icon={<FilePdfOutlined />}>Export to PDF</Button>
                  <Button icon={<PrinterOutlined />}>Print</Button>
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={references}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
                locale={{
                  emptyText: (
                    <Empty
                      description="No payment references found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
              />
            </Card>
          </>
        )}

        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <BankOutlined style={{ marginRight: 8 }} />
              Payment Reference Details
            </div>
          }
          width={600}
          placement="right"
          onClose={() => setDetailsVisible(false)}
          open={detailsVisible}
          extra={
            <Space>
              <Button icon={<PrinterOutlined />}>Print</Button>
              <Button icon={<MailOutlined />}>Email Receipt</Button>
              <Button type="primary" icon={<DownloadOutlined />}>
                Download
              </Button>
            </Space>
          }
        >
          {selectedReference && (
            <>
              <Alert
                message={`Payment Status: ${selectedReference.status}`}
                type={
                  selectedReference.status === "Completed"
                    ? "success"
                    : selectedReference.status === "Pending"
                      ? "warning"
                      : "error"
                }
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Card
                title="Payment Information"
                style={{ marginBottom: 24 }}
                bordered={false}
              >
                <Descriptions
                  bordered
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label="Reference ID">
                    {selectedReference.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Receipt Number">
                    {selectedReference.receiptNumber || "Not issued yet"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Amount">
                    <strong>
                      {selectedReference.amount.toLocaleString()} UGX
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Date">
                    {new Date(
                      selectedReference.paymentDate
                    ).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Type">
                    {selectedReference.paymentType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Method">
                    {selectedReference.paymentMethod}
                  </Descriptions.Item>
                  <Descriptions.Item label="Transaction ID">
                    {selectedReference.transactionId}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                title="Student Information"
                style={{ marginBottom: 24 }}
                bordered={false}
              >
                <Descriptions
                  bordered
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label="Student ID">
                    {selectedReference.studentId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Student Name">
                    {selectedReference.studentName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Faculty">
                    {selectedReference.faculty}
                  </Descriptions.Item>
                  <Descriptions.Item label="Academic Year">
                    {selectedReference.academicYear}
                  </Descriptions.Item>
                  <Descriptions.Item label="Semester">
                    {selectedReference.semester}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {selectedReference.status === "Failed" && (
                <Alert
                  message="Payment Failed"
                  description="This payment attempt was unsuccessful. The student should be advised to try again or use an alternative payment method."
                  type="error"
                  showIcon
                />
              )}

              {selectedReference.status === "Pending" && (
                <Alert
                  message="Payment Pending"
                  description="This payment is still being processed. It may take up to 24 hours to complete."
                  type="warning"
                  showIcon
                />
              )}
            </>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}

export default ReferenceLookup;
