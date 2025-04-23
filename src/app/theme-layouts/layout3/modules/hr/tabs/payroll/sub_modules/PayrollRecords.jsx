import { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Dropdown,
  DatePicker,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
  Badge,
  Tabs,
  Select,
  Tooltip,
  Menu,
  Drawer,
  Timeline,
  Avatar,
  Progress,
} from "antd";
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  Calendar,
  FileText,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  Eye,
  Printer,
  Mail,
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import "./PayrollRecords.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function PayrollRecords() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Sample payroll data
  const payrollData = [
    {
      key: "1",
      id: "PAY-2023-05",
      period: "May 2023",
      employeeName: "Namukwaya Sarah",
      employeeId: "EMP001",
      department: "Finance",
      grossSalary: 4800000,
      deductions: 1344000,
      netSalary: 3456000,
      paymentDate: "31/05/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "2",
      id: "PAY-2023-05",
      period: "May 2023",
      employeeName: "Mukasa David",
      employeeId: "EMP002",
      department: "IT",
      grossSalary: 5500000,
      deductions: 1540000,
      netSalary: 3960000,
      paymentDate: "31/05/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "3",
      id: "PAY-2023-05",
      period: "May 2023",
      employeeName: "Nantume Grace",
      employeeId: "EMP003",
      department: "HR",
      grossSalary: 6300000,
      deductions: 1764000,
      netSalary: 4536000,
      paymentDate: "31/05/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "4",
      id: "PAY-2023-05",
      period: "May 2023",
      employeeName: "Okello John",
      employeeId: "EMP004",
      department: "Operations",
      grossSalary: 4000000,
      deductions: 1120000,
      netSalary: 2880000,
      paymentDate: "31/05/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "5",
      id: "PAY-2023-05",
      period: "May 2023",
      employeeName: "Nabukenya Patricia",
      employeeId: "EMP005",
      department: "Marketing",
      grossSalary: 4500000,
      deductions: 1260000,
      netSalary: 3240000,
      paymentDate: "31/05/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "6",
      id: "PAY-2023-04",
      period: "April 2023",
      employeeName: "Namukwaya Sarah",
      employeeId: "EMP001",
      department: "Finance",
      grossSalary: 4800000,
      deductions: 1344000,
      netSalary: 3456000,
      paymentDate: "30/04/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "7",
      id: "PAY-2023-04",
      period: "April 2023",
      employeeName: "Mukasa David",
      employeeId: "EMP002",
      department: "IT",
      grossSalary: 5500000,
      deductions: 1540000,
      netSalary: 3960000,
      paymentDate: "30/04/2023",
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "8",
      id: "PAY-2023-06",
      period: "June 2023",
      employeeName: "Namukwaya Sarah",
      employeeId: "EMP001",
      department: "Finance",
      grossSalary: 4800000,
      deductions: 1344000,
      netSalary: 3456000,
      paymentDate: "30/06/2023",
      status: "Processing",
      paymentMethod: "Bank Transfer",
    },
    {
      key: "9",
      id: "PAY-2023-06",
      period: "June 2023",
      employeeName: "Mukasa David",
      employeeId: "EMP002",
      department: "IT",
      grossSalary: 5500000,
      deductions: 1540000,
      netSalary: 3960000,
      paymentDate: "30/06/2023",
      status: "Processing",
      paymentMethod: "Bank Transfer",
    },
  ];

  // Calculate total payroll amounts
  const totalGrossSalary = payrollData.reduce(
    (sum, record) => sum + record.grossSalary,
    0
  );
  const totalNetSalary = payrollData.reduce(
    (sum, record) => sum + record.netSalary,
    0
  );
  const totalDeductions = payrollData.reduce(
    (sum, record) => sum + record.deductions,
    0
  );

  // Get unique payroll periods
  const periods = [...new Set(payrollData.map((record) => record.period))];

  const columns = [
    {
      title: "Payroll ID",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div>
          <div className="font-medium">{id}</div>
          <div className="text-xs text-gray-500">{record.period}</div>
        </div>
      ),
    },
    {
      title: "Employee",
      key: "employee",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.employeeName}</div>
          <div className="text-xs text-gray-500">
            {record.employeeId} • {record.department}
          </div>
        </div>
      ),
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      render: (amount) => (
        <div className="font-medium">UGX {amount.toLocaleString()}</div>
      ),
      sorter: (a, b) => a.grossSalary - b.grossSalary,
    },
    {
      title: "Deductions",
      dataIndex: "deductions",
      key: "deductions",
      render: (amount) => (
        <div className="text-red-500">UGX {amount.toLocaleString()}</div>
      ),
      sorter: (a, b) => a.deductions - b.deductions,
    },
    {
      title: "Net Salary",
      dataIndex: "netSalary",
      key: "netSalary",
      render: (amount) => (
        <div className="font-semibold text-green-600">
          UGX {amount.toLocaleString()}
        </div>
      ),
      sorter: (a, b) => a.netSalary - b.netSalary,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-2 text-gray-400" />
          {date}
        </div>
      ),
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        let icon = null;

        switch (status) {
          case "Paid":
            color = "green";
            icon = <CheckCircle size={10} />;
            break;
          case "Processing":
            color = "blue";
            icon = <Clock size={10} />;
            break;
          case "Failed":
            color = "red";
            icon = <XCircle size={10} />;
            break;
          case "Pending":
            color = "orange";
            icon = <AlertCircle size={10} />;
            break;
          default:
            color = "default";
            icon = <FileText size={10} />;
        }

        return (
          <Tag
            color={color}
            icon={icon}
            style={{
              borderRadius: "3px",
              padding: "0px 3px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              width: "auto",
            }}
          >
            {status}
          </Tag>
        );
      },
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Processing", value: "Processing" },
        { text: "Failed", value: "Failed" },
        { text: "Pending", value: "Pending" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="1"
                icon={<Eye size={16} />}
                onClick={() => showDrawer(record)}
              >
                View Details
              </Menu.Item>
              <Menu.Item key="2" icon={<FileText size={16} />}>
                View Payslip
              </Menu.Item>
              <Menu.Item key="3" icon={<Printer size={16} />}>
                Print Payslip
              </Menu.Item>
              <Menu.Item key="4" icon={<Mail size={16} />}>
                Email Payslip
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="5" icon={<Download size={16} />}>
                Download PDF
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreVertical size={16} />}
            className="hover:bg-gray-100 rounded-full"
          />
        </Dropdown>
      ),
    },
  ];

  const showDrawer = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Payroll Records
          </Title>
          <Text type="secondary">
            Track and manage employee salary payments
          </Text>
        </div>
        <Space>
          <Button
            icon={<BarChart4 size={16} />}
            style={{ borderRadius: "8px" }}
          >
            Payroll Reports
          </Button>
          <Button
            type="primary"
            icon={<CreditCard size={16} />}
            className="animated-border-button"
            style={{
              background: "linear-gradient(to right, #1677ff,rgb(155, 9, 217))",
              borderRadius: "8px",
            }}
          >
            Process Payroll
          </Button>
        </Space>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title={
                <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
                  Total Gross Salary
                </Text>
              }
              value={totalGrossSalary}
              prefix={<DollarSign size={20} style={{ color: "#1677ff" }} />}
              valueStyle={{ color: "#262626", fontWeight: "600" }}
              formatter={(value) => `UGX ${value.toLocaleString()}`}
            />
            <div className="mt-2">
              <Badge
                status="processing"
                text={
                  <div className="flex items-center">
                    <ArrowUpRight size={14} className="text-green-500 mr-1" />
                    <Text type="success" style={{ fontSize: "12px" }}>
                      3.2% from last month
                    </Text>
                  </div>
                }
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title={
                <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
                  Total Deductions
                </Text>
              }
              value={totalDeductions}
              prefix={<ArrowDownRight size={20} style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#262626", fontWeight: "600" }}
              formatter={(value) => `UGX ${value.toLocaleString()}`}
            />
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  PAYE Tax
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  UGX 8,540,000
                </Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  NSSF
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  UGX 4,270,000
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic
              title={
                <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
                  Total Net Salary
                </Text>
              }
              value={totalNetSalary}
              prefix={<CheckCircle size={20} style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#262626", fontWeight: "600" }}
              formatter={(value) => `UGX ${value.toLocaleString()}`}
            />
            <div className="mt-2">
              <Progress
                percent={100}
                status="success"
                size="small"
                showInfo={false}
                style={{ marginBottom: "4px" }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                All payments processed for May 2023
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <Select
              defaultValue="all"
              style={{ width: 180, marginRight: 16, borderRadius: "8px" }}
              suffixIcon={<ChevronDown size={16} />}
            >
              <Option value="all">All Periods</Option>
              {periods.map((period) => (
                <Option key={period} value={period}>
                  {period}
                </Option>
              ))}
            </Select>
            <Select
              defaultValue="all"
              style={{ width: 180, borderRadius: "8px" }}
              suffixIcon={<ChevronDown size={16} />}
            >
              <Option value="all">All Departments</Option>
              <Option value="Finance">Finance</Option>
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Operations">Operations</Option>
              <Option value="Marketing">Marketing</Option>
            </Select>
          </div>
          <Space>
            <Input
              placeholder="Search payroll records..."
              prefix={<Search size={16} className="text-gray-400" />}
              style={{ width: 250, borderRadius: "8px" }}
            />
            <Tooltip title="Advanced Filters">
              <Button
                icon={<Filter size={16} />}
                style={{ borderRadius: "8px" }}
              />
            </Tooltip>
            <Tooltip title="Download Records">
              <Button
                icon={<Download size={16} />}
                style={{ borderRadius: "8px" }}
              />
            </Tooltip>
          </Space>
        </div>

        <Tabs defaultActiveKey="all" className="mb-4">
          <TabPane tab="All Records" key="all" />
          <TabPane tab="Paid" key="paid" />
          <TabPane tab="Processing" key="processing" />
          <TabPane tab="Pending" key="pending" />
        </Tabs>

        <Table
          size="small"
          columns={columns}
          dataSource={payrollData}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
            showSizeChanger: true,
          }}
          style={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
          summary={(pageData) => {
            const pageTotalGross = pageData.reduce(
              (sum, record) => sum + record.grossSalary,
              0
            );
            const pageTotalDeductions = pageData.reduce(
              (sum, record) => sum + record.deductions,
              0
            );
            const pageTotalNet = pageData.reduce(
              (sum, record) => sum + record.netSalary,
              0
            );

            return (
              <Table.Summary fixed>
                <Table.Summary.Row
                  style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}
                >
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Text strong>Page Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text strong>UGX {pageTotalGross.toLocaleString()}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong className="text-red-500">
                      UGX {pageTotalDeductions.toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <Text strong className="text-green-600">
                      UGX {pageTotalNet.toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={5}
                    colSpan={3}
                  ></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      {selectedRecord && (
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              <span>Payroll Record Details</span>
            </div>
          }
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          width={500}
          extra={
            <Space>
              <Button icon={<Printer size={16} />}>Print</Button>
              <Button type="primary" icon={<Download size={16} />}>
                Download
              </Button>
              ;{" "}
            </Space>
          }
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Text strong>Payroll ID: {selectedRecord.id}</Text>
                <Tag
                  color={selectedRecord.status === "Paid" ? "green" : "blue"}
                >
                  {selectedRecord.status}
                </Tag>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                <Text>Period: {selectedRecord.period}</Text>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={16} className="text-blue-500" />
                <Text>Payment Date: {selectedRecord.paymentDate}</Text>
              </div>
            </div>

            <Divider orientation="left">Employee Information</Divider>

            <div className="flex items-center gap-3">
              <Avatar size={64} src="/placeholder.svg?height=64&width=64" />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {selectedRecord.employeeName}
                </Title>
                <Text type="secondary">{selectedRecord.employeeId}</Text>
                <div className="mt-1">
                  <Tag color="blue">{selectedRecord.department}</Tag>
                </div>
              </div>
            </div>

            <Divider orientation="left">Salary Breakdown</Divider>

            <Card bordered={false} className="bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Basic Salary</Text>
                  <Text strong>
                    UGX {(selectedRecord.grossSalary * 0.7).toLocaleString()}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Housing Allowance</Text>
                  <Text strong>
                    UGX {(selectedRecord.grossSalary * 0.15).toLocaleString()}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Transport Allowance</Text>
                  <Text strong>
                    UGX {(selectedRecord.grossSalary * 0.1).toLocaleString()}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Other Allowances</Text>
                  <Text strong>
                    UGX {(selectedRecord.grossSalary * 0.05).toLocaleString()}
                  </Text>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div className="flex justify-between">
                  <Text strong>Gross Salary</Text>
                  <Text strong>
                    UGX {selectedRecord.grossSalary.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>

            <Card bordered={false} className="bg-red-50">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>PAYE Tax</Text>
                  <Text className="text-red-500">
                    UGX {(selectedRecord.deductions * 0.6).toLocaleString()}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>NSSF Contribution</Text>
                  <Text className="text-red-500">
                    UGX {(selectedRecord.deductions * 0.3).toLocaleString()}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Health Insurance</Text>
                  <Text className="text-red-500">
                    UGX {(selectedRecord.deductions * 0.1).toLocaleString()}
                  </Text>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div className="flex justify-between">
                  <Text strong>Total Deductions</Text>
                  <Text strong className="text-red-500">
                    UGX {selectedRecord.deductions.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>

            <Card bordered={false} className="bg-green-50">
              <div className="flex justify-between items-center">
                <Text strong>Net Salary</Text>
                <Title
                  level={4}
                  style={{ margin: 0 }}
                  className="text-green-600"
                >
                  UGX {selectedRecord.netSalary.toLocaleString()}
                </Title>
              </div>
              <div className="mt-2">
                <Text type="secondary">
                  Paid via {selectedRecord.paymentMethod}
                </Text>
              </div>
            </Card>

            <Divider orientation="left">Payment History</Divider>

            <Timeline>
              <Timeline.Item color="green">
                <div>
                  <Text strong>Payment Processed</Text>
                  <div className="text-xs text-gray-500">
                    31/05/2023 10:15 AM
                  </div>
                  <div className="mt-1">
                    <Text type="secondary">
                      Salary payment of UGX{" "}
                      {selectedRecord.netSalary.toLocaleString()} processed
                      successfully.
                    </Text>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div>
                  <Text strong>Payroll Approved</Text>
                  <div className="text-xs text-gray-500">
                    30/05/2023 02:45 PM
                  </div>
                  <div className="mt-1">
                    <Text type="secondary">
                      Payroll approved by Finance Manager.
                    </Text>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div>
                  <Text strong>Payroll Generated</Text>
                  <div className="text-xs text-gray-500">
                    29/05/2023 11:30 AM
                  </div>
                  <div className="mt-1">
                    <Text type="secondary">
                      Monthly payroll for May 2023 generated.
                    </Text>
                  </div>
                </div>
              </Timeline.Item>
            </Timeline>
          </div>
        </Drawer>
      )}
    </div>
  );
}
