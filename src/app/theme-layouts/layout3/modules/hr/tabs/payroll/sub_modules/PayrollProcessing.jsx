import { useState } from "react";
import {
  Table,
  Card,
  Button,
  Form,
  Input,
  Select,
  Divider,
  Row,
  Col,
  Tag,
  Modal,
  Tooltip,
  Space,
  Tabs,
  Steps,
  message,
  Descriptions,
  Badge,
  Alert,
  Popconfirm,
} from "antd";
import {
  PlusCircle,
  FileText,
  Mail,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  Search,
  Printer,
  Send,
  RefreshCw,
} from "lucide-react";

const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;

export default function PayrollProcessing() {
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("October 2023");

  // Sample data for Uganda
  const payrollRecords = [
    {
      key: "1",
      month: "October 2023",
      totalEmployees: 45,
      grossAmount: 152000000,
      totalDeductions: 38000000,
      netAmount: 114000000,
      status: "Completed",
      processingDate: "2023-10-25",
    },
    {
      key: "2",
      month: "September 2023",
      totalEmployees: 43,
      grossAmount: 148500000,
      totalDeductions: 37125000,
      netAmount: 111375000,
      status: "Completed",
      processingDate: "2023-09-25",
    },
    {
      key: "3",
      month: "August 2023",
      totalEmployees: 42,
      grossAmount: 145800000,
      totalDeductions: 36450000,
      netAmount: 109350000,
      status: "Completed",
      processingDate: "2023-08-25",
    },
  ];

  const employeePayslips = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      department: "Finance",
      month: "October 2023",
      grossSalary: 3200000,
      totalDeductions: 750000,
      netSalary: 2450000,
      status: "Sent",
      sentDate: "2023-10-26",
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      department: "Human Resources",
      month: "October 2023",
      grossSalary: 3800000,
      totalDeductions: 900000,
      netSalary: 2900000,
      status: "Sent",
      sentDate: "2023-10-26",
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      department: "IT",
      month: "October 2023",
      grossSalary: 3500000,
      totalDeductions: 820000,
      netSalary: 2680000,
      status: "Sent",
      sentDate: "2023-10-26",
    },
    {
      key: "4",
      employeeId: "UG004",
      name: "Auma Grace",
      department: "Marketing",
      month: "October 2023",
      grossSalary: 3000000,
      totalDeductions: 700000,
      netSalary: 2300000,
      status: "Pending",
      sentDate: "-",
    },
  ];

  const payslipHistory = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      month: "October 2023",
      grossSalary: 3200000,
      netSalary: 2450000,
      downloadDate: "2023-10-27",
      downloadCount: 2,
    },
    {
      key: "2",
      employeeId: "UG001",
      name: "Okello David",
      month: "September 2023",
      grossSalary: 3200000,
      netSalary: 2450000,
      downloadDate: "2023-09-28",
      downloadCount: 1,
    },
    {
      key: "3",
      employeeId: "UG001",
      name: "Okello David",
      month: "August 2023",
      grossSalary: 3100000,
      netSalary: 2380000,
      downloadDate: "2023-08-27",
      downloadCount: 3,
    },
    {
      key: "4",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      month: "October 2023",
      grossSalary: 3800000,
      netSalary: 2900000,
      downloadDate: "2023-10-26",
      downloadCount: 1,
    },
    {
      key: "5",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      month: "September 2023",
      grossSalary: 3800000,
      netSalary: 2900000,
      downloadDate: "2023-09-27",
      downloadCount: 2,
    },
  ];

  const payrollColumns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Total Employees",
      dataIndex: "totalEmployees",
      key: "totalEmployees",
    },
    {
      title: "Gross Amount (UGX)",
      dataIndex: "grossAmount",
      key: "grossAmount",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Total Deductions (UGX)",
      dataIndex: "totalDeductions",
      key: "totalDeductions",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Net Amount (UGX)",
      dataIndex: "netAmount",
      key: "netAmount",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "Completed" ? "green" : "orange"}>{text}</Tag>
      ),
    },
    {
      title: "Processing Date",
      dataIndex: "processingDate",
      key: "processingDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showModal("payrollDetails", record)}
            />
          </Tooltip>
          <Tooltip title="Generate Payslips">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showModal("generatePayslips", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const payslipColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
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
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Gross Salary (UGX)",
      dataIndex: "grossSalary",
      key: "grossSalary",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Total Deductions (UGX)",
      dataIndex: "totalDeductions",
      key: "totalDeductions",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Net Salary (UGX)",
      dataIndex: "netSalary",
      key: "netSalary",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "Sent" ? "green" : "orange"}>{text}</Tag>
      ),
    },
    {
      title: "Sent Date",
      dataIndex: "sentDate",
      key: "sentDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Payslip">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showModal("viewPayslip", record)}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<Download size={16} />} />
          </Tooltip>
          {record.status !== "Sent" && (
            <Tooltip title="Send Email">
              <Button type="text" icon={<Mail size={16} />} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Gross Salary (UGX)",
      dataIndex: "grossSalary",
      key: "grossSalary",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Net Salary (UGX)",
      dataIndex: "netSalary",
      key: "netSalary",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Last Download",
      dataIndex: "downloadDate",
      key: "downloadDate",
    },
    {
      title: "Download Count",
      dataIndex: "downloadCount",
      key: "downloadCount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Payslip">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showModal("viewPayslip", record)}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<Download size={16} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);
    if (record && record.month) {
      setSelectedMonth(record.month);
    }
  };

  const handleOk = () => {
    if (modalType === "runPayroll" && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsModalVisible(false);
      setCurrentStep(0);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderModal = () => {
    switch (modalType) {
      case "runPayroll":
        return (
          <Modal
            title="Run Payroll Process"
            open={isModalVisible}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              currentStep > 0 && (
                <Button key="back" onClick={prev}>
                  Previous
                </Button>
              ),
              currentStep < 3 ? (
                <Button key="next" type="primary" onClick={next}>
                  Next
                </Button>
              ) : (
                <Button
                  key="submit"
                  type="primary"
                  icon={<CheckCircle size={16} />}
                  onClick={handleOk}
                >
                  Complete Process
                </Button>
              ),
            ]}
          >
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
              <Step title="Select Period" icon={<Calendar size={16} />} />
              <Step title="Verify Data" icon={<Search size={16} />} />
              <Step title="Process" icon={<RefreshCw size={16} />} />
              <Step title="Finalize" icon={<CheckCircle size={16} />} />
            </Steps>

            {currentStep === 0 && (
              <div>
                <Form layout="vertical">
                  <Form.Item
                    label="Payroll Period"
                    name="period"
                    rules={[
                      {
                        required: true,
                        message: "Please select the payroll period!",
                      },
                    ]}
                  >
                    <Select defaultValue="November 2023">
                      <Option value="November 2023">November 2023</Option>
                      <Option value="December 2023">December 2023</Option>
                      <Option value="January 2024">January 2024</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Payment Date"
                    name="paymentDate"
                    rules={[
                      {
                        required: true,
                        message: "Please select the payment date!",
                      },
                    ]}
                  >
                    <Input type="date" defaultValue="2023-11-25" />
                  </Form.Item>
                  <Form.Item label="Description" name="description">
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter any additional notes for this payroll run"
                    />
                  </Form.Item>
                </Form>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <Alert
                  message="Data Verification"
                  description="Please verify the following information before proceeding with payroll processing."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Total Employees">
                    46
                  </Descriptions.Item>
                  <Descriptions.Item label="Payroll Period">
                    November 2023
                  </Descriptions.Item>
                  <Descriptions.Item label="Estimated Gross">
                    UGX 155,000,000
                  </Descriptions.Item>
                  <Descriptions.Item label="Estimated Net">
                    UGX 116,250,000
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <div>
                  <h4>Warnings:</h4>
                  <ul>
                    <li>
                      <Badge status="warning" /> 2 employees have pending
                      overtime approvals
                    </li>
                    <li>
                      <Badge status="warning" /> 1 employee has a loan deduction
                      that exceeds 30% of net salary
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <Alert
                  message="Processing Payroll"
                  description="The system is calculating salaries, deductions, and net pay for all employees."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <div className="text-center p-4">
                  <div className="mb-4">
                    <RefreshCw
                      size={48}
                      className="animate-spin text-blue-500"
                    />
                  </div>
                  <h3>Processing Payroll for November 2023</h3>
                  <p>This may take a few moments. Please wait...</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <Alert
                  message="Payroll Processing Complete"
                  description="The payroll has been successfully processed. You can now review and finalize."
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Total Employees">
                    46
                  </Descriptions.Item>
                  <Descriptions.Item label="Payroll Period">
                    November 2023
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Gross">
                    UGX 155,200,000
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Deductions">
                    UGX 38,800,000
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Net">
                    UGX 116,400,000
                  </Descriptions.Item>
                  <Descriptions.Item label="Processing Date">
                    2023-11-25
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <div className="flex justify-between">
                  <div>
                    <h4>Next Steps:</h4>
                    <ul>
                      <li>Generate payslips for all employees</li>
                      <li>Distribute payslips via email</li>
                      <li>Prepare bank payment file</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        );
      case "payrollDetails":
        return (
          <Modal
            title={`Payroll Details - ${selectedMonth}`}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Close
              </Button>,
              <Button
                key="download"
                type="primary"
                icon={<Download size={16} />}
                onClick={handleOk}
              >
                Download Report
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Payroll Period">
                {selectedMonth}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">Completed</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Employees">45</Descriptions.Item>
              <Descriptions.Item label="Processing Date">
                2023-10-25
              </Descriptions.Item>
              <Descriptions.Item label="Gross Amount">
                UGX 152,000,000
              </Descriptions.Item>
              <Descriptions.Item label="Total Deductions">
                UGX 38,000,000
              </Descriptions.Item>
              <Descriptions.Item label="Net Amount">
                UGX 114,000,000
              </Descriptions.Item>
              <Descriptions.Item label="Payment Date">
                2023-10-28
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h4>Breakdown by Department</h4>
            <Table
              size="small"
              pagination={false}
              dataSource={[
                {
                  department: "Finance",
                  employees: 8,
                  grossAmount: 28000000,
                  netAmount: 21000000,
                },
                {
                  department: "Human Resources",
                  employees: 5,
                  grossAmount: 17500000,
                  netAmount: 13125000,
                },
                {
                  department: "IT",
                  employees: 12,
                  grossAmount: 42000000,
                  netAmount: 31500000,
                },
                {
                  department: "Operations",
                  employees: 15,
                  grossAmount: 45000000,
                  netAmount: 33750000,
                },
                {
                  department: "Marketing",
                  employees: 5,
                  grossAmount: 19500000,
                  netAmount: 14625000,
                },
              ]}
              columns={[
                {
                  title: "Department",
                  dataIndex: "department",
                  key: "department",
                },
                {
                  title: "Employees",
                  dataIndex: "employees",
                  key: "employees",
                },
                {
                  title: "Gross Amount (UGX)",
                  dataIndex: "grossAmount",
                  key: "grossAmount",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: "Net Amount (UGX)",
                  dataIndex: "netAmount",
                  key: "netAmount",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
              ]}
            />
          </Modal>
        );
      case "generatePayslips":
        return (
          <Modal
            title={`Generate Payslips - ${selectedMonth}`}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="generate"
                type="primary"
                icon={<FileText size={16} />}
                onClick={handleOk}
              >
                Generate All Payslips
              </Button>,
            ]}
          >
            <Alert
              message="Payslip Generation"
              description="This will generate payslips for all employees for the selected month. You can then distribute them via email or allow employees to access them through the self-service portal."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form layout="vertical">
              <Form.Item
                label="Payslip Template"
                name="template"
                initialValue="standard"
              >
                <Select>
                  <Option value="standard">Standard Template</Option>
                  <Option value="detailed">Detailed Template</Option>
                  <Option value="simple">Simple Template</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Include"
                name="include"
                initialValue={["ytd", "deductions"]}
              >
                <Select mode="multiple">
                  <Option value="ytd">Year-to-Date Figures</Option>
                  <Option value="deductions">Detailed Deductions</Option>
                  <Option value="benefits">Benefits Information</Option>
                  <Option value="leave">Leave Balance</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Distribution Method"
                name="distribution"
                initialValue="email"
              >
                <Select>
                  <Option value="email">Email to Employees</Option>
                  <Option value="portal">Self-Service Portal Only</Option>
                  <Option value="both">Both Email and Portal</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Email Message" name="message">
                <Input.TextArea
                  rows={4}
                  placeholder="Enter a message to include in the email to employees"
                  defaultValue="Please find attached your payslip for the month of October 2023. If you have any questions, please contact the HR department."
                />
              </Form.Item>
            </Form>
          </Modal>
        );
      case "viewPayslip":
        return (
          <Modal
            title="Payslip Preview"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Close
              </Button>,
              <Button
                key="download"
                icon={<Download size={16} />}
                onClick={handleOk}
              >
                Download
              </Button>,
              <Button
                key="print"
                icon={<Printer size={16} />}
                onClick={handleOk}
              >
                Print
              </Button>,
              <Button
                key="email"
                type="primary"
                icon={<Send size={16} />}
                onClick={handleOk}
              >
                Send by Email
              </Button>,
            ]}
          >
            <div className="border p-4 rounded">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">Nkumba University</h2>
                <p>Plot 123, Entebbe Road, Wakiso, Uganda</p>
                <h3 className="text-lg font-semibold mt-2">
                  PAYSLIP - OCTOBER 2023
                </h3>
              </div>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <p>
                    <strong>Employee ID:</strong> UG001
                  </p>
                  <p>
                    <strong>Name:</strong> Okello David
                  </p>
                  <p>
                    <strong>Department:</strong> Finance
                  </p>
                  <p>
                    <strong>Position:</strong> Senior Accountant
                  </p>
                  <p>
                    <strong>Bank Account:</strong> XXXX-XXXX-1234
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>Pay Period:</strong> 01/10/2023 - 31/10/2023
                  </p>
                  <p>
                    <strong>Payment Date:</strong> 28/10/2023
                  </p>
                  <p>
                    <strong>Tax ID:</strong> UTR12345678
                  </p>
                  <p>
                    <strong>NSSF Number:</strong> NSSF87654321
                  </p>
                </Col>
              </Row>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <h4 className="font-semibold">Earnings</h4>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td>Basic Salary</td>
                        <td className="text-right">2,500,000</td>
                      </tr>
                      <tr>
                        <td>Housing Allowance</td>
                        <td className="text-right">400,000</td>
                      </tr>
                      <tr>
                        <td>Transport Allowance</td>
                        <td className="text-right">200,000</td>
                      </tr>
                      <tr>
                        <td>Meal Allowance</td>
                        <td className="text-right">100,000</td>
                      </tr>
                      <tr>
                        <td>Overtime</td>
                        <td className="text-right">0</td>
                      </tr>
                      <tr className="font-semibold">
                        <td>Gross Pay</td>
                        <td className="text-right">3,200,000</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col span={12}>
                  <h4 className="font-semibold">Deductions</h4>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td>PAYE Tax</td>
                        <td className="text-right">400,000</td>
                      </tr>
                      <tr>
                        <td>NSSF (5%)</td>
                        <td className="text-right">160,000</td>
                      </tr>
                      <tr>
                        <td>NHIF</td>
                        <td className="text-right">50,000</td>
                      </tr>
                      <tr>
                        <td>Savings Scheme</td>
                        <td className="text-right">100,000</td>
                      </tr>
                      <tr>
                        <td>Union Dues</td>
                        <td className="text-right">20,000</td>
                      </tr>
                      <tr>
                        <td>Welfare Fund</td>
                        <td className="text-right">30,000</td>
                      </tr>
                      <tr className="font-semibold">
                        <td>Total Deductions</td>
                        <td className="text-right">760,000</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>

              <Divider />

              <Row>
                <Col span={24}>
                  <div className="bg-gray-100 p-2 flex justify-between">
                    <div className="font-semibold">Net Pay:</div>
                    <div className="font-semibold">UGX 2,440,000</div>
                  </div>
                </Col>
              </Row>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <h4 className="font-semibold">Year-to-Date Summary</h4>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td>Gross Earnings</td>
                        <td className="text-right">32,000,000</td>
                      </tr>
                      <tr>
                        <td>Total Tax Paid</td>
                        <td className="text-right">4,000,000</td>
                      </tr>
                      <tr>
                        <td>Total NSSF</td>
                        <td className="text-right">1,600,000</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col span={12}>
                  <h4 className="font-semibold">Leave Balance</h4>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td>Annual Leave</td>
                        <td className="text-right">15 days</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td className="text-right">10 days</td>
                      </tr>
                      <tr>
                        <td>Used Leave</td>
                        <td className="text-right">8 days</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>

              <Divider />

              <div className="text-center text-sm mt-4">
                <p>
                  This is a computer-generated payslip and does not require a
                  signature.
                </p>
                <p>For any queries, please contact the HR department.</p>
              </div>
            </div>
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <RefreshCw size={16} /> Payroll Processing
            </span>
          }
          key="1"
        >
          <Card
            title="Payroll Processing"
            extra={
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => showModal("runPayroll")}
              >
                Run New Payroll
              </Button>
            }
          >
            <Alert
              message="Next Payroll"
              description="The next payroll is scheduled for November 25, 2023. Please ensure all employee data is updated by November 20, 2023."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table
              size="small"
              columns={payrollColumns}
              dataSource={payrollRecords}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <FileText size={16} /> Payslip Generation
            </span>
          }
          key="2"
        >
          <Card
            title="Payslip Distribution"
            extra={
              <Space>
                <Popconfirm
                  title="Send all pending payslips?"
                  onConfirm={() =>
                    message.success("Payslips sent successfully!")
                  }
                >
                  <Button icon={<Mail size={16} />}>Send All Pending</Button>
                </Popconfirm>
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showModal("generatePayslips")}
                >
                  Generate Payslips
                </Button>
              </Space>
            }
          >
            <Table
              size="small"
              columns={payslipColumns}
              dataSource={employeePayslips}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={16} /> Payslip History
            </span>
          }
          key="3"
        >
          <Card title="Employee Payslip History">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Input
                  placeholder="Search by Employee ID or Name"
                  prefix={<Search size={16} />}
                />
              </Col>
              <Col span={8}>
                <Select
                  placeholder="Select Month"
                  style={{ width: "100%" }}
                  defaultValue="all"
                >
                  <Option value="all">All Months</Option>
                  <Option value="October 2023">October 2023</Option>
                  <Option value="September 2023">September 2023</Option>
                  <Option value="August 2023">August 2023</Option>
                </Select>
              </Col>
            </Row>
            <Table
              size="small"
              columns={historyColumns}
              dataSource={payslipHistory}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
      </Tabs>
      {renderModal()}
    </div>
  );
}
