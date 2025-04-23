import { useState } from "react";
import {
  Card,
  Tabs,
  Table,
  Button,
  DatePicker,
  Select,
  Space,
  Statistic,
  Row,
  Col,
  Progress,
  Typography,
  Badge,
  Segmented,
} from "antd";
import {
  Download,
  Printer,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function Reports() {
  const [reportType, setReportType] = useState("payroll");
  const [dateRange, setDateRange] = useState(null);
  const [department, setDepartment] = useState("all");
  const [viewType, setViewType] = useState("table");

  // Sample data for payroll summary report
  const payrollData = [
    {
      key: "1",
      department: "Finance",
      employees: 12,
      grossSalary: 48500000,
      tax: 9700000,
      nssf: 4850000,
      netSalary: 33950000,
      change: 3.2,
    },
    {
      key: "2",
      department: "IT",
      employees: 15,
      grossSalary: 67500000,
      tax: 13500000,
      nssf: 6750000,
      netSalary: 47250000,
      change: 5.8,
    },
    {
      key: "3",
      department: "HR",
      employees: 8,
      grossSalary: 32000000,
      tax: 6400000,
      nssf: 3200000,
      netSalary: 22400000,
      change: -1.5,
    },
    {
      key: "4",
      department: "Operations",
      employees: 22,
      grossSalary: 66000000,
      tax: 13200000,
      nssf: 6600000,
      netSalary: 46200000,
      change: 2.1,
    },
    {
      key: "5",
      department: "Marketing",
      employees: 10,
      grossSalary: 40000000,
      tax: 8000000,
      nssf: 4000000,
      netSalary: 28000000,
      change: 4.3,
    },
  ];

  // Sample data for tax compliance report
  const taxData = [
    {
      key: "1",
      taxType: "PAYE",
      amount: 50800000,
      dueDate: "15/04/2023",
      status: "Paid",
      reference: "TXN-2023-04-001",
      paymentDate: "12/04/2023",
    },
    {
      key: "2",
      taxType: "NSSF",
      amount: 25400000,
      dueDate: "15/04/2023",
      status: "Paid",
      reference: "TXN-2023-04-002",
      paymentDate: "12/04/2023",
    },
    {
      key: "3",
      taxType: "Local Service Tax",
      amount: 2500000,
      dueDate: "30/04/2023",
      status: "Pending",
      reference: "-",
      paymentDate: "-",
    },
    {
      key: "4",
      taxType: "PAYE",
      amount: 51200000,
      dueDate: "15/05/2023",
      status: "Pending",
      reference: "-",
      paymentDate: "-",
    },
    {
      key: "5",
      taxType: "NSSF",
      amount: 25600000,
      dueDate: "15/05/2023",
      status: "Pending",
      reference: "-",
      paymentDate: "-",
    },
  ];

  // Columns for payroll summary report
  const payrollColumns = [
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Employees",
      dataIndex: "employees",
      key: "employees",
      align: "right",
    },
    {
      title: "Gross Salary (UGX)",
      dataIndex: "grossSalary",
      key: "grossSalary",
      align: "right",
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: "Tax (UGX)",
      dataIndex: "tax",
      key: "tax",
      align: "right",
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: "NSSF (UGX)",
      dataIndex: "nssf",
      key: "nssf",
      align: "right",
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: "Net Salary (UGX)",
      dataIndex: "netSalary",
      key: "netSalary",
      align: "right",
      render: (value, record) => (
        <div className="flex items-center justify-end">
          <Text strong style={{ marginRight: 8 }}>
            {value.toLocaleString()}
          </Text>
          {record.change > 0 ? (
            <Badge
              count={<ArrowUpRight size={12} />}
              style={{ backgroundColor: "#52c41a", marginRight: 4 }}
            />
          ) : (
            <Badge
              count={<ArrowDownRight size={12} />}
              style={{ backgroundColor: "#f5222d", marginRight: 4 }}
            />
          )}
          <Text type={record.change > 0 ? "success" : "danger"}>
            {Math.abs(record.change)}%
          </Text>
        </div>
      ),
    },
  ];

  // Columns for tax compliance report
  const taxColumns = [
    {
      title: "Tax Type",
      dataIndex: "taxType",
      key: "taxType",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Amount (UGX)",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-2 text-gray-400" />
          {text}
        </div>
      ),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) =>
        text !== "-" ? (
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 text-gray-400" />
            {text}
          </div>
        ) : (
          text
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "Paid") {
          return (
            <Badge
              status="success"
              text={
                <div className="flex items-center">
                  <CheckCircle size={14} className="mr-1 text-green-500" />
                  <Text style={{ color: "#52c41a" }}>Paid</Text>
                </div>
              }
            />
          );
        } else {
          return (
            <Badge
              status="warning"
              text={
                <div className="flex items-center">
                  <Clock size={14} className="mr-1 text-yellow-500" />
                  <Text style={{ color: "#faad14" }}>Pending</Text>
                </div>
              }
            />
          );
        }
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
  ];

  // Calculate totals for payroll summary
  const totalGrossSalary = payrollData.reduce(
    (sum, item) => sum + item.grossSalary,
    0
  );
  const totalTax = payrollData.reduce((sum, item) => sum + item.tax, 0);
  const totalNssf = payrollData.reduce((sum, item) => sum + item.nssf, 0);
  const totalNetSalary = payrollData.reduce(
    (sum, item) => sum + item.netSalary,
    0
  );
  const totalEmployees = payrollData.reduce(
    (sum, item) => sum + item.employees,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Payroll Reports
          </Title>
          <Text type="secondary">
            Comprehensive financial and payroll analytics
          </Text>
        </div>
        <Space>
          <Button icon={<Printer size={16} />} style={{ borderRadius: "8px" }}>
            Print
          </Button>
          <Button
            icon={<Download size={16} />}
            type="primary"
            style={{
              background: "linear-gradient(to right, #1677ff, #0958d9)",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Export Report
          </Button>
        </Space>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex justify-between mb-6">
          <Space size="large">
            <div>
              <Text type="secondary" className="block mb-1">
                Report Type
              </Text>
              <Select
                value={reportType}
                onChange={setReportType}
                style={{ width: 200, borderRadius: "8px" }}
                suffixIcon={<ChevronDown size={16} />}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Option value="payroll">Payroll Summary</Option>
                <Option value="tax">Tax & Compliance</Option>
                <Option value="department">Department Breakdown</Option>
                <Option value="employee">Employee Earnings</Option>
              </Select>
            </div>
            <div>
              <Text type="secondary" className="block mb-1">
                Date Range
              </Text>
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                format="DD/MM/YYYY"
                style={{ borderRadius: "8px" }}
              />
            </div>
            <div>
              <Text type="secondary" className="block mb-1">
                Department
              </Text>
              <Select
                value={department}
                onChange={setDepartment}
                style={{ width: 150, borderRadius: "8px" }}
                suffixIcon={<ChevronDown size={16} />}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Option value="all">All Departments</Option>
                <Option value="finance">Finance</Option>
                <Option value="it">IT</Option>
                <Option value="hr">HR</Option>
                <Option value="operations">Operations</Option>
                <Option value="marketing">Marketing</Option>
              </Select>
            </div>
          </Space>
          <Space>
            <Button icon={<Filter size={16} />} style={{ borderRadius: "8px" }}>
              Filters
            </Button>
            <Button
              icon={<RefreshCw size={16} />}
              style={{ borderRadius: "8px" }}
            >
              Refresh
            </Button>
          </Space>
        </div>

        <div className="mb-6">
          <Segmented
            options={[
              {
                label: (
                  <div className="flex items-center">
                    <BarChart3 size={16} className="mr-2" />
                    <span>Table View</span>
                  </div>
                ),
                value: "table",
              },
              {
                label: (
                  <div className="flex items-center">
                    <PieChart size={16} className="mr-2" />
                    <span>Chart View</span>
                  </div>
                ),
                value: "chart",
              },
            ]}
            value={viewType}
            onChange={setViewType}
          />
        </div>

        {reportType === "payroll" && (
          <>
            <Row gutter={16} className="mb-6">
              <Col span={6}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "linear-gradient(145deg, #f0f5ff, #e6f7ff)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        Total Employees
                      </Text>
                    }
                    value={totalEmployees}
                    prefix={<Users size={20} style={{ color: "#1677ff" }} />}
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                  />
                  <div className="mt-2">
                    <Badge
                      status="processing"
                      text={
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <span className="text-blue-500 font-medium">+3</span>{" "}
                          from last month
                        </Text>
                      }
                    />
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "linear-gradient(145deg, #f6ffed, #e6fffb)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        Gross Salary
                      </Text>
                    }
                    value={totalGrossSalary.toLocaleString()}
                    prefix={
                      <DollarSign size={20} style={{ color: "#52c41a" }} />
                    }
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    suffix="UGX"
                  />
                  <div className="mt-2">
                    <Badge
                      status="success"
                      text={
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <span className="text-green-500 font-medium">
                            +4.2%
                          </span>{" "}
                          from last month
                        </Text>
                      }
                    />
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "linear-gradient(145deg, #fff2e8, #fff1f0)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        Total Deductions
                      </Text>
                    }
                    value={(totalTax + totalNssf).toLocaleString()}
                    prefix={
                      <AlertTriangle size={20} style={{ color: "#fa541c" }} />
                    }
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    suffix="UGX"
                  />
                  <div className="mt-2">
                    <Badge
                      status="warning"
                      text={
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <span className="text-orange-500 font-medium">
                            +3.8%
                          </span>{" "}
                          from last month
                        </Text>
                      }
                    />
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "linear-gradient(145deg, #f9f0ff, #efdbff)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        Net Salary
                      </Text>
                    }
                    value={totalNetSalary.toLocaleString()}
                    prefix={
                      <CheckCircle size={20} style={{ color: "#722ed1" }} />
                    }
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    suffix="UGX"
                  />
                  <div className="mt-2">
                    <Badge
                      status="processing"
                      text={
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <span className="text-purple-500 font-medium">
                            +4.5%
                          </span>{" "}
                          from last month
                        </Text>
                      }
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            {viewType === "table" ? (
              <Table
                size="small"
                columns={payrollColumns}
                dataSource={payrollData}
                pagination={false}
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ backgroundColor: "#fafafa" }}>
                      <Table.Summary.Cell index={0}>
                        <Text strong>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong>{totalEmployees}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Text strong>{totalGrossSalary.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        <Text strong>{totalTax.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">
                        <Text strong>{totalNssf.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="right">
                        <Text strong>{totalNetSalary.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <BarChart3 size={48} className="text-blue-500 opacity-50" />
                </div>
                <Title level={5}>Department Salary Distribution</Title>
                <Text type="secondary">
                  Chart visualization would appear here
                </Text>
              </div>
            )}
          </>
        )}

        {reportType === "tax" && (
          <>
            <Row gutter={16} className="mb-6">
              <Col span={8}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "linear-gradient(145deg, #f0f5ff, #e6f7ff)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        Total Tax Liability
                      </Text>
                    }
                    value="154,500,000"
                    prefix={
                      <DollarSign size={20} style={{ color: "#1677ff" }} />
                    }
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    suffix="UGX"
                  />
                  <div className="mt-3">
                    <Progress
                      percent={65}
                      status="active"
                      strokeColor={{
                        "0%": "#1677ff",
                        "100%": "#0958d9",
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      <Text type="secondary">
                        65% paid for current fiscal year
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
                    background: "linear-gradient(145deg, #fff2e8, #fff1f0)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        PAYE (Current Month)
                      </Text>
                    }
                    value="51,200,000"
                    prefix={
                      <AlertTriangle size={20} style={{ color: "#fa541c" }} />
                    }
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    suffix="UGX"
                  />
                  <div className="mt-3">
                    <div className="flex items-center">
                      <Badge status="warning" />
                      <Text
                        type="warning"
                        style={{ fontSize: "13px", fontWeight: "500" }}
                      >
                        Due on 15/05/2023 (3 days remaining)
                      </Text>
                    </div>
                    <div className="mt-1">
                      <Progress
                        percent={0}
                        status="exception"
                        showInfo={false}
                        strokeColor="#fa541c"
                      />
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
                    background: "linear-gradient(145deg, #f9f0ff, #efdbff)",
                  }}
                >
                  <Statistic
                    title={
                      <Text style={{ fontSize: "14px", color: "#595959" }}>
                        NSSF (Current Month)
                      </Text>
                    }
                    value="25,600,000"
                    prefix={
                      <CheckCircle size={20} style={{ color: "#722ed1" }} />
                    }
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    suffix="UGX"
                  />
                  <div className="mt-3">
                    <div className="flex items-center">
                      <Badge status="warning" />
                      <Text
                        type="warning"
                        style={{ fontSize: "13px", fontWeight: "500" }}
                      >
                        Due on 15/05/2023 (3 days remaining)
                      </Text>
                    </div>
                    <div className="mt-1">
                      <Progress
                        percent={0}
                        status="exception"
                        showInfo={false}
                        strokeColor="#722ed1"
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Table
              size="small"
              columns={taxColumns}
              dataSource={taxData}
              pagination={false}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
              }}
            />
          </>
        )}
      </Card>
    </div>
  );
}
