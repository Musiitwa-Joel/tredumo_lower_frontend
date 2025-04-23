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
  InputNumber,
  Tabs,
  Steps,
  message,
  Descriptions,
  Alert,
  Popconfirm,
  Progress,
} from "antd";
import {
  PlusCircle,
  Edit,
  Save,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  ArrowRight,
  Coins,
} from "lucide-react";
import { Money } from "@mui/icons-material";

const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;

export default function LoansAdvances() {
  const [loanForm] = Form.useForm();
  const [advanceForm] = Form.useForm();
  const [settlementForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [currentStep, setCurrentStep] = useState(0);

  // Sample data for Uganda
  const loanRecords = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      loanType: "Personal",
      loanAmount: 5000000,
      interestRate: "10%",
      totalRepayable: 5500000,
      monthlyDeduction: 458333,
      startDate: "2023-05-15",
      endDate: "2024-05-14",
      remainingAmount: 3208333,
      status: "Active",
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      loanType: "Education",
      loanAmount: 3000000,
      interestRate: "5%",
      totalRepayable: 3150000,
      monthlyDeduction: 262500,
      startDate: "2023-07-01",
      endDate: "2024-06-30",
      remainingAmount: 2362500,
      status: "Active",
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      loanType: "Housing",
      loanAmount: 10000000,
      interestRate: "12%",
      totalRepayable: 11200000,
      monthlyDeduction: 466667,
      startDate: "2023-01-01",
      endDate: "2025-01-01",
      remainingAmount: 7933333,
      status: "Active",
    },
    {
      key: "4",
      employeeId: "UG004",
      name: "Auma Grace",
      loanType: "Personal",
      loanAmount: 2000000,
      interestRate: "10%",
      totalRepayable: 2200000,
      monthlyDeduction: 183333,
      startDate: "2022-11-01",
      endDate: "2023-10-31",
      remainingAmount: 0,
      status: "Completed",
    },
  ];

  const advanceRecords = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      advanceAmount: 800000,
      requestDate: "2023-10-05",
      approvalDate: "2023-10-07",
      recoveryDate: "2023-10-31",
      reason: "Medical Emergency",
      status: "Approved",
    },
    {
      key: "2",
      employeeId: "UG005",
      name: "Opio James",
      advanceAmount: 500000,
      requestDate: "2023-10-10",
      approvalDate: "-",
      recoveryDate: "-",
      reason: "Family Emergency",
      status: "Pending",
    },
    {
      key: "3",
      employeeId: "UG006",
      name: "Nakato Mary",
      advanceAmount: 300000,
      requestDate: "2023-10-08",
      approvalDate: "2023-10-09",
      recoveryDate: "2023-10-31",
      reason: "Education Fees",
      status: "Approved",
    },
    {
      key: "4",
      employeeId: "UG007",
      name: "Kato John",
      advanceAmount: 600000,
      requestDate: "2023-10-03",
      approvalDate: "2023-10-04",
      recoveryDate: "2023-10-31",
      reason: "House Rent",
      status: "Approved",
    },
  ];

  const settlementRecords = [
    {
      key: "1",
      employeeId: "UG008",
      name: "Nantongo Alice",
      terminationDate: "2023-09-30",
      yearsOfService: 5.2,
      finalSalary: 2800000,
      gratuity: 4368000,
      outstandingLeave: 10,
      leaveEncashment: 933333,
      outstandingLoans: 1500000,
      netSettlement: 3801333,
      status: "Processed",
    },
    {
      key: "2",
      employeeId: "UG009",
      name: "Ssekandi Robert",
      terminationDate: "2023-10-15",
      yearsOfService: 3.5,
      finalSalary: 3200000,
      gratuity: 3360000,
      outstandingLeave: 5,
      leaveEncashment: 533333,
      outstandingLoans: 0,
      netSettlement: 3893333,
      status: "Pending",
    },
    {
      key: "3",
      employeeId: "UG010",
      name: "Nabukenya Jane",
      terminationDate: "2023-08-31",
      yearsOfService: 7.8,
      finalSalary: 4500000,
      gratuity: 10530000,
      outstandingLeave: 15,
      leaveEncashment: 2250000,
      outstandingLoans: 3000000,
      netSettlement: 9780000,
      status: "Processed",
    },
  ];

  const loanColumns = [
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
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
    },
    {
      title: "Loan Amount (UGX)",
      dataIndex: "loanAmount",
      key: "loanAmount",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Monthly Deduction (UGX)",
      dataIndex: "monthlyDeduction",
      key: "monthlyDeduction",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Remaining Amount (UGX)",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Progress",
      dataIndex: "remainingAmount",
      key: "progress",
      render: (text, record) => {
        const progress = Math.round(
          ((record.totalRepayable - record.remainingAmount) /
            record.totalRepayable) *
            100
        );
        return <Progress percent={progress} size="small" />;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "Active" ? "blue" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showModal("viewLoan", record)}
            />
          </Tooltip>
          {record.status === "Active" && (
            <>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<Edit size={16} />}
                  onClick={() => showModal("editLoan", record)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to close this loan?"
                onConfirm={() => message.success("Loan closed successfully")}
              >
                <Tooltip title="Close Loan">
                  <Button type="text" danger icon={<XCircle size={16} />} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const advanceColumns = [
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
      title: "Advance Amount (UGX)",
      dataIndex: "advanceAmount",
      key: "advanceAmount",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
    },
    {
      title: "Approval Date",
      dataIndex: "approvalDate",
      key: "approvalDate",
    },
    {
      title: "Recovery Date",
      dataIndex: "recoveryDate",
      key: "recoveryDate",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "Approved"
              ? "green"
              : text === "Pending"
                ? "orange"
                : "red"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Pending" && (
            <>
              <Popconfirm
                title="Approve this advance request?"
                onConfirm={() =>
                  message.success("Advance approved successfully")
                }
              >
                <Tooltip title="Approve">
                  <Button
                    type="text"
                    icon={<CheckCircle size={16} className="text-green-500" />}
                  />
                </Tooltip>
              </Popconfirm>
              <Popconfirm
                title="Reject this advance request?"
                onConfirm={() => message.error("Advance rejected")}
              >
                <Tooltip title="Reject">
                  <Button type="text" danger icon={<XCircle size={16} />} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showModal("viewAdvance", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const settlementColumns = [
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
      title: "Termination Date",
      dataIndex: "terminationDate",
      key: "terminationDate",
    },
    {
      title: "Years of Service",
      dataIndex: "yearsOfService",
      key: "yearsOfService",
    },
    {
      title: "Gratuity (UGX)",
      dataIndex: "gratuity",
      key: "gratuity",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Leave Encashment (UGX)",
      dataIndex: "leaveEncashment",
      key: "leaveEncashment",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Outstanding Loans (UGX)",
      dataIndex: "outstandingLoans",
      key: "outstandingLoans",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Net Settlement (UGX)",
      dataIndex: "netSettlement",
      key: "netSettlement",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "Processed" ? "green" : "orange"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showModal("viewSettlement", record)}
            />
          </Tooltip>
          {record.status === "Pending" && (
            <>
              <Tooltip title="Process">
                <Button
                  type="text"
                  icon={<CheckCircle size={16} />}
                  onClick={() => showModal("processSettlement", record)}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<Edit size={16} />}
                  onClick={() => showModal("editSettlement", record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const showModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);

    if (record) {
      switch (type) {
        case "editLoan":
        case "viewLoan":
          loanForm.setFieldsValue(record);
          break;
        case "editAdvance":
        case "viewAdvance":
          advanceForm.setFieldsValue(record);
          break;
        case "editSettlement":
        case "viewSettlement":
        case "processSettlement":
          settlementForm.setFieldsValue(record);
          break;
        default:
          break;
      }
    }
  };

  const handleOk = () => {
    if (modalType === "newLoan" && currentStep < 3) {
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
      case "newLoan":
        return (
          <Modal
            title="New Loan Application"
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
                  Submit Application
                </Button>
              ),
            ]}
          >
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
              <Step title="Employee Details" icon={<FileText size={16} />} />
              <Step title="Loan Details" icon={<DollarSign size={16} />} />
              <Step title="Repayment Plan" icon={<Calendar size={16} />} />
              <Step title="Review & Submit" icon={<CheckCircle size={16} />} />
            </Steps>

            {currentStep === 0 && (
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Employee ID"
                      name="employeeId"
                      rules={[
                        {
                          required: true,
                          message: "Please select an employee!",
                        },
                      ]}
                    >
                      <Select placeholder="Select Employee ID">
                        <Option value="UG001">UG001 - Okello David</Option>
                        <Option value="UG002">UG002 - Namukwaya Sarah</Option>
                        <Option value="UG003">UG003 - Mugisha Peter</Option>
                        <Option value="UG005">UG005 - Opio James</Option>
                        <Option value="UG006">UG006 - Nakato Mary</Option>
                        <Option value="UG007">UG007 - Kato John</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Department" name="department">
                      <Input disabled defaultValue="Finance" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Position" name="position">
                      <Input disabled defaultValue="Senior Accountant" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Current Salary (UGX)" name="salary">
                      <InputNumber
                        style={{ width: "100%" }}
                        disabled
                        defaultValue={3200000}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Employment Date" name="employmentDate">
                      <Input type="date" disabled defaultValue="2018-05-15" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Years of Service" name="yearsOfService">
                      <Input disabled defaultValue="5.4 years" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="Existing Loans" name="existingLoans">
                      <Input.TextArea
                        rows={4}
                        defaultValue="Personal Loan: UGX 3,208,333 remaining (Monthly deduction: UGX 458,333)"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}

            {currentStep === 1 && (
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Loan Type"
                      name="loanType"
                      rules={[
                        {
                          required: true,
                          message: "Please select a loan type!",
                        },
                      ]}
                    >
                      <Select placeholder="Select Loan Type">
                        <Option value="Personal">Personal Loan</Option>
                        <Option value="Education">Education Loan</Option>
                        <Option value="Housing">Housing Loan</Option>
                        <Option value="Emergency">Emergency Loan</Option>
                        <Option value="Vehicle">Vehicle Loan</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Loan Amount (UGX)"
                      name="loanAmount"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the loan amount!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Interest Rate (%)"
                      name="interestRate"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the interest rate!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        max={20}
                        defaultValue={10}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Loan Term (Months)"
                      name="loanTerm"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the loan term!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        max={60}
                        defaultValue={12}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Purpose of Loan"
                      name="purpose"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the purpose of the loan!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Describe the purpose of the loan"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Alert
                  message="Maximum Loan Eligibility"
                  description="Based on the employee's salary and existing loans, the maximum loan amount eligible is UGX 6,400,000 (2x monthly salary)."
                  type="info"
                  showIcon
                />
              </Form>
            )}

            {currentStep === 2 && (
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Start Date"
                      name="startDate"
                      rules={[
                        {
                          required: true,
                          message: "Please select a start date!",
                        },
                      ]}
                    >
                      <Input type="date" defaultValue="2023-11-01" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="End Date" name="endDate">
                      <Input type="date" disabled defaultValue="2024-10-31" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Monthly Deduction (UGX)"
                      name="monthlyDeduction"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        disabled
                        defaultValue={458333}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Total Repayable (UGX)"
                      name="totalRepayable"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        disabled
                        defaultValue={5500000}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Alert
                      message="Deduction Impact"
                      description="The monthly deduction will be 14.3% of the employee's gross salary. The recommended maximum is 33%."
                      type="info"
                      showIcon
                    />
                  </Col>
                </Row>
                <Divider />
                <h4>Repayment Schedule Preview</h4>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={[
                    {
                      month: "Nov 2023",
                      principal: 375000,
                      interest: 83333,
                      total: 458333,
                      balance: 5125000,
                    },
                    {
                      month: "Dec 2023",
                      principal: 378125,
                      interest: 80208,
                      total: 458333,
                      balance: 4746875,
                    },
                    {
                      month: "Jan 2024",
                      principal: 381276,
                      interest: 77057,
                      total: 458333,
                      balance: 4365599,
                    },
                  ]}
                  columns={[
                    {
                      title: "Month",
                      dataIndex: "month",
                      key: "month",
                    },
                    {
                      title: "Principal (UGX)",
                      dataIndex: "principal",
                      key: "principal",
                      render: (text) =>
                        new Intl.NumberFormat("en-UG").format(text),
                    },
                    {
                      title: "Interest (UGX)",
                      dataIndex: "interest",
                      key: "interest",
                      render: (text) =>
                        new Intl.NumberFormat("en-UG").format(text),
                    },
                    {
                      title: "Total (UGX)",
                      dataIndex: "total",
                      key: "total",
                      render: (text) =>
                        new Intl.NumberFormat("en-UG").format(text),
                    },
                    {
                      title: "Balance (UGX)",
                      dataIndex: "balance",
                      key: "balance",
                      render: (text) =>
                        new Intl.NumberFormat("en-UG").format(text),
                    },
                  ]}
                />
              </Form>
            )}

            {currentStep === 3 && (
              <div>
                <Alert
                  message="Loan Application Summary"
                  description="Please review the loan details before submitting the application."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Employee">
                    Okello David (UG001)
                  </Descriptions.Item>
                  <Descriptions.Item label="Department">
                    Finance
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Type">
                    Personal Loan
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Amount">
                    UGX 5,000,000
                  </Descriptions.Item>
                  <Descriptions.Item label="Interest Rate">
                    10%
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Term">
                    12 months
                  </Descriptions.Item>
                  <Descriptions.Item label="Monthly Deduction">
                    UGX 458,333
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Repayable">
                    UGX 5,500,000
                  </Descriptions.Item>
                  <Descriptions.Item label="Start Date">
                    2023-11-01
                  </Descriptions.Item>
                  <Descriptions.Item label="End Date">
                    2024-10-31
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <div>
                  <h4>Approval Workflow:</h4>
                  <Steps size="small" current={0}>
                    <Step title="Application" description="Submitted" />
                    <Step title="HR Approval" description="Pending" />
                    <Step title="Finance Approval" description="Pending" />
                    <Step title="Disbursement" description="Pending" />
                  </Steps>
                </div>
              </div>
            )}
          </Modal>
        );
      case "viewLoan":
        return (
          <Modal
            title="Loan Details"
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
                icon={<FileText size={16} />}
                onClick={handleOk}
              >
                Download Statement
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Employee">
                Okello David (UG001)
              </Descriptions.Item>
              <Descriptions.Item label="Department">Finance</Descriptions.Item>
              <Descriptions.Item label="Loan Type">
                Personal Loan
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="blue">Active</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Loan Amount">
                UGX 5,000,000
              </Descriptions.Item>
              <Descriptions.Item label="Interest Rate">10%</Descriptions.Item>
              <Descriptions.Item label="Total Repayable">
                UGX 5,500,000
              </Descriptions.Item>
              <Descriptions.Item label="Monthly Deduction">
                UGX 458,333
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                2023-05-15
              </Descriptions.Item>
              <Descriptions.Item label="End Date">2024-05-14</Descriptions.Item>
              <Descriptions.Item label="Remaining Amount">
                UGX 3,208,333
              </Descriptions.Item>
              <Descriptions.Item label="Repayment Progress">
                <Progress percent={42} size="small" />
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h4>Recent Repayments</h4>
            <Table
              size="small"
              pagination={false}
              dataSource={[
                {
                  month: "Oct 2023",
                  deductionDate: "2023-10-31",
                  amount: 458333,
                  principal: 375000,
                  interest: 83333,
                  balance: 3208333,
                },
                {
                  month: "Sep 2023",
                  deductionDate: "2023-09-30",
                  amount: 458333,
                  principal: 371875,
                  interest: 86458,
                  balance: 3583333,
                },
                {
                  month: "Aug 2023",
                  deductionDate: "2023-08-31",
                  amount: 458333,
                  principal: 368776,
                  interest: 89557,
                  balance: 3955208,
                },
              ]}
              columns={[
                {
                  title: "Month",
                  dataIndex: "month",
                  key: "month",
                },
                {
                  title: "Deduction Date",
                  dataIndex: "deductionDate",
                  key: "deductionDate",
                },
                {
                  title: "Amount (UGX)",
                  dataIndex: "amount",
                  key: "amount",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: "Principal (UGX)",
                  dataIndex: "principal",
                  key: "principal",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: "Interest (UGX)",
                  dataIndex: "interest",
                  key: "interest",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: "Balance (UGX)",
                  dataIndex: "balance",
                  key: "balance",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
              ]}
            />
          </Modal>
        );
      case "editLoan":
        return (
          <Modal
            title="Edit Loan"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon={<Save size={16} />}
                onClick={handleOk}
              >
                Save Changes
              </Button>,
            ]}
          >
            <Form form={loanForm} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                    rules={[
                      {
                        required: true,
                        message: "Please input the employee ID!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Employee Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the employee name!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="loanType"
                    label="Loan Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select the loan type!",
                      },
                    ]}
                  >
                    <Select disabled>
                      <Option value="Personal">Personal Loan</Option>
                      <Option value="Education">Education Loan</Option>
                      <Option value="Housing">Housing Loan</Option>
                      <Option value="Emergency">Emergency Loan</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="loanAmount"
                    label="Loan Amount (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the loan amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      disabled
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="monthlyDeduction"
                    label="Monthly Deduction (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the monthly deduction!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="remainingAmount"
                    label="Remaining Amount (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the remaining amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select the end date!",
                      },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Please select the status!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="Active">Active</Option>
                      <Option value="On Hold">On Hold</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Adjustment Reason"
                    name="adjustmentReason"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a reason for adjustment!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Provide a reason for adjusting the loan terms"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        );
      case "newAdvance":
        return (
          <Modal
            title="New Salary Advance Request"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon={<CheckCircle size={16} />}
                onClick={handleOk}
              >
                Submit Request
              </Button>,
            ]}
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Employee ID"
                    name="employeeId"
                    rules={[
                      {
                        required: true,
                        message: "Please select an employee!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Employee ID">
                      <Option value="UG001">UG001 - Okello David</Option>
                      <Option value="UG002">UG002 - Namukwaya Sarah</Option>
                      <Option value="UG003">UG003 - Mugisha Peter</Option>
                      <Option value="UG005">UG005 - Opio James</Option>
                      <Option value="UG006">UG006 - Nakato Mary</Option>
                      <Option value="UG007">UG007 - Kato John</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Department" name="department">
                    <Input disabled defaultValue="Finance" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Current Salary (UGX)" name="salary">
                    <InputNumber
                      style={{ width: "100%" }}
                      disabled
                      defaultValue={3200000}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Maximum Advance (UGX)" name="maxAdvance">
                    <InputNumber
                      style={{ width: "100%" }}
                      disabled
                      defaultValue={1600000}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Advance Amount (UGX)"
                    name="advanceAmount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the advance amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={10000}
                      max={1600000}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Request Date"
                    name="requestDate"
                    rules={[
                      {
                        required: true,
                        message: "Please select the request date!",
                      },
                    ]}
                  >
                    <Input type="date" defaultValue="2023-11-01" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Recovery Month"
                    name="recoveryMonth"
                    rules={[
                      {
                        required: true,
                        message: "Please select the recovery month!",
                      },
                    ]}
                  >
                    <Select defaultValue="November 2023">
                      <Option value="November 2023">November 2023</Option>
                      <Option value="December 2023">December 2023</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Recovery Date" name="recoveryDate">
                    <Input type="date" disabled defaultValue="2023-11-30" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Reason for Advance"
                    name="reason"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a reason for the advance!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Provide a reason for requesting the salary advance"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Alert
                message="Note"
                description="Salary advances are limited to 50% of monthly salary and must be recovered in the next payroll cycle."
                type="info"
                showIcon
              />
            </Form>
          </Modal>
        );
      case "viewAdvance":
        return (
          <Modal
            title="Advance Request Details"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Close
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Employee">
                Okello David (UG001)
              </Descriptions.Item>
              <Descriptions.Item label="Department">Finance</Descriptions.Item>
              <Descriptions.Item label="Advance Amount">
                UGX 800,000
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">Approved</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Request Date">
                2023-10-05
              </Descriptions.Item>
              <Descriptions.Item label="Approval Date">
                2023-10-07
              </Descriptions.Item>
              <Descriptions.Item label="Recovery Date">
                2023-10-31
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                Medical Emergency
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h4>Approval History</h4>
            <Steps size="small" current={2} direction="vertical">
              <Step
                title="Request Submitted"
                description="By: Okello David on 2023-10-05"
                icon={<FileText size={16} />}
              />
              <Step
                title="HR Approval"
                description="By: Namukwaya Sarah on 2023-10-06"
                icon={<CheckCircle size={16} />}
              />
              <Step
                title="Finance Approval"
                description="By: Mugisha Peter on 2023-10-07"
                icon={<CheckCircle size={16} />}
              />
              <Step
                title="Disbursement"
                description="Processed on 2023-10-08"
                icon={<CreditCard size={16} />}
              />
            </Steps>
          </Modal>
        );
      case "newSettlement":
        return (
          <Modal
            title="New Final Settlement"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon={<CheckCircle size={16} />}
                onClick={handleOk}
              >
                Calculate Settlement
              </Button>,
            ]}
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Employee ID"
                    name="employeeId"
                    rules={[
                      {
                        required: true,
                        message: "Please select an employee!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Employee ID">
                      <Option value="UG001">UG001 - Okello David</Option>
                      <Option value="UG002">UG002 - Namukwaya Sarah</Option>
                      <Option value="UG003">UG003 - Mugisha Peter</Option>
                      <Option value="UG005">UG005 - Opio James</Option>
                      <Option value="UG006">UG006 - Nakato Mary</Option>
                      <Option value="UG007">UG007 - Kato John</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Department" name="department">
                    <Input disabled defaultValue="Finance" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Termination Date"
                    name="terminationDate"
                    rules={[
                      {
                        required: true,
                        message: "Please select the termination date!",
                      },
                    ]}
                  >
                    <Input type="date" defaultValue="2023-11-30" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Reason for Termination"
                    name="terminationReason"
                    rules={[
                      {
                        required: true,
                        message: "Please select the termination reason!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Reason">
                      <Option value="Resignation">Resignation</Option>
                      <Option value="Retirement">Retirement</Option>
                      <Option value="End of Contract">End of Contract</Option>
                      <Option value="Redundancy">Redundancy</Option>
                      <Option value="Dismissal">Dismissal</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Employment Date" name="employmentDate">
                    <Input type="date" disabled defaultValue="2018-05-15" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Years of Service" name="yearsOfService">
                    <Input disabled defaultValue="5.4 years" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Final Salary (UGX)" name="finalSalary">
                    <InputNumber
                      style={{ width: "100%" }}
                      disabled
                      defaultValue={3200000}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Outstanding Leave Days"
                    name="outstandingLeave"
                    rules={[
                      {
                        required: true,
                        message: "Please enter outstanding leave days!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} max={30} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Alert
                    message="Outstanding Loans"
                    description="Personal Loan: UGX 3,208,333 remaining (Monthly deduction: UGX 458,333)"
                    type="warning"
                    showIcon
                  />
                </Col>
              </Row>
              <Row gutter={16} className="mt-4">
                <Col span={24}>
                  <Form.Item label="Additional Notes" name="notes">
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter any additional notes regarding the final settlement"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        );
      case "processSettlement":
        return (
          <Modal
            title="Process Final Settlement"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon={<CheckCircle size={16} />}
                onClick={handleOk}
              >
                Confirm &amp; Process
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Employee">
                Okello David (UG001)
              </Descriptions.Item>
              <Descriptions.Item label="Department">Finance</Descriptions.Item>
              <Descriptions.Item label="Termination Date">
                2023-11-30
              </Descriptions.Item>
              <Descriptions.Item label="Reason for Termination">
                Resignation
              </Descriptions.Item>
              <Descriptions.Item label="Years of Service">
                5.4 years
              </Descriptions.Item>
              <Descriptions.Item label="Final Salary">
                UGX 3,200,000
              </Descriptions.Item>
              <Descriptions.Item label="Gratuity">
                UGX 4,368,000
              </Descriptions.Item>
              <Descriptions.Item label="Leave Encashment">
                UGX 933,333
              </Descriptions.Item>
              <Descriptions.Item label="Outstanding Loans">
                UGX 1,500,000
              </Descriptions.Item>
              <Descriptions.Item label="Net Settlement">
                UGX 3,801,333
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Alert
              message="Confirmation"
              description="Are you sure you want to process this final settlement? This action cannot be undone."
              type="warning"
              showIcon
            />
          </Modal>
        );
      case "editSettlement":
        return (
          <Modal
            title="Edit Final Settlement"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon={<Save size={16} />}
                onClick={handleOk}
              >
                Save Changes
              </Button>,
            ]}
          >
            <Form form={settlementForm} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                    rules={[
                      {
                        required: true,
                        message: "Please input the employee ID!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Employee Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the employee name!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="terminationDate"
                    label="Termination Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select the termination date!",
                      },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="yearsOfService"
                    label="Years of Service"
                    rules={[
                      {
                        required: true,
                        message: "Please input the years of service!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      max={50}
                      step={0.1}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="finalSalary"
                    label="Final Salary (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the final salary!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gratuity"
                    label="Gratuity (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the gratuity amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="leaveEncashment"
                    label="Leave Encashment (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the leave encashment amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="outstandingLoans"
                    label="Outstanding Loans (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the outstanding loans amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="netSettlement"
                    label="Net Settlement (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the net settlement amount!",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Please select the status!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="Pending">Pending</Option>
                      <Option value="Processed">Processed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Adjustment Reason"
                    name="adjustmentReason"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a reason for adjustment!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Provide a reason for adjusting the settlement terms"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Coins size={16} className="mr-2" />
              Loans
            </span>
          }
          key="1"
        >
          <Card
            title="Loans"
            extra={[
              <Space key="loan-buttons">
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showModal("newLoan")}
                >
                  New Loan
                </Button>
              </Space>,
            ]}
          >
            <Table
              size="small"
              columns={loanColumns}
              dataSource={loanRecords}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <ArrowRight size={16} className="mr-2" />
              Advances
            </span>
          }
          key="2"
        >
          <Card
            title="Salary Advances"
            extra={[
              <Space key="advance-buttons">
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showModal("newAdvance")}
                >
                  New Advance
                </Button>
              </Space>,
            ]}
          >
            <Table
              size="small"
              columns={advanceColumns}
              dataSource={advanceRecords}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={16} className="mr-2" />
              Final Settlement
            </span>
          }
          key="3"
        >
          <Card
            title="Final Settlements"
            extra={[
              <Space key="settlement-buttons">
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showModal("newSettlement")}
                >
                  New Settlement
                </Button>
              </Space>,
            ]}
          >
            <Table
              size="small"
              columns={settlementColumns}
              dataSource={settlementRecords}
            />
          </Card>
        </TabPane>
      </Tabs>

      {renderModal()}
    </>
  );
}
