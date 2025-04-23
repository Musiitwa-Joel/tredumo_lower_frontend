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
  Modal,
  Tooltip,
  Space,
  InputNumber,
  Tabs,
  Descriptions,
  Alert,
} from "antd";
import {
  PlusCircle,
  Edit,
  Save,
  Percent,
  Shield,
  Heart,
  Users,
  Briefcase,
  Building,
  BookOpen,
} from "lucide-react";

const { Option } = Select;
const { TabPane } = Tabs;

export default function TaxDeductions() {
  const [taxForm] = Form.useForm();
  const [deductionForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  // Sample data for Uganda
  const taxRecords = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      grossSalary: 3200000,
      taxableIncome: 3000000,
      payeAmount: 400000,
      taxRate: "13.33%",
      netAfterTax: 2800000,
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      grossSalary: 3800000,
      taxableIncome: 3600000,
      payeAmount: 500000,
      taxRate: "13.89%",
      netAfterTax: 3300000,
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      grossSalary: 3500000,
      taxableIncome: 3300000,
      payeAmount: 400000,
      taxRate: "12.12%",
      netAfterTax: 3100000,
    },
  ];

  const statutoryDeductions = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      nssfEmployee: 160000,
      nssfEmployer: 240000,
      nhif: 50000,
      totalStatutory: 450000,
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      nssfEmployee: 190000,
      nssfEmployer: 285000,
      nhif: 60000,
      totalStatutory: 535000,
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      nssfEmployee: 175000,
      nssfEmployer: 262500,
      nhif: 55000,
      totalStatutory: 492500,
    },
  ];

  const voluntaryDeductions = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      savingsScheme: 100000,
      union: 20000,
      welfare: 30000,
      totalVoluntary: 150000,
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      savingsScheme: 120000,
      union: 20000,
      welfare: 30000,
      totalVoluntary: 170000,
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      savingsScheme: 110000,
      union: 20000,
      welfare: 30000,
      totalVoluntary: 160000,
    },
  ];

  const employerContributions = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      insurance: 150000,
      pension: 240000,
      education: 50000,
      totalContributions: 440000,
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      insurance: 180000,
      pension: 285000,
      education: 60000,
      totalContributions: 525000,
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      insurance: 165000,
      pension: 262500,
      education: 55000,
      totalContributions: 482500,
    },
  ];

  const taxColumns = [
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
      title: "Gross Salary (UGX)",
      dataIndex: "grossSalary",
      key: "grossSalary",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Taxable Income (UGX)",
      dataIndex: "taxableIncome",
      key: "taxableIncome",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "PAYE Amount (UGX)",
      dataIndex: "payeAmount",
      key: "payeAmount",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Effective Tax Rate",
      dataIndex: "taxRate",
      key: "taxRate",
    },
    {
      title: "Net After Tax (UGX)",
      dataIndex: "netAfterTax",
      key: "netAfterTax",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showModal("tax", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const statutoryColumns = [
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
      title: "NSSF Employee (UGX)",
      dataIndex: "nssfEmployee",
      key: "nssfEmployee",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "NSSF Employer (UGX)",
      dataIndex: "nssfEmployer",
      key: "nssfEmployer",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "NHIF (UGX)",
      dataIndex: "nhif",
      key: "nhif",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Total Statutory (UGX)",
      dataIndex: "totalStatutory",
      key: "totalStatutory",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showModal("statutory", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const voluntaryColumns = [
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
      title: "Savings Scheme (UGX)",
      dataIndex: "savingsScheme",
      key: "savingsScheme",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Union Dues (UGX)",
      dataIndex: "union",
      key: "union",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Welfare Fund (UGX)",
      dataIndex: "welfare",
      key: "welfare",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Total Voluntary (UGX)",
      dataIndex: "totalVoluntary",
      key: "totalVoluntary",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showModal("voluntary", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const employerColumns = [
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
      title: "Insurance (UGX)",
      dataIndex: "insurance",
      key: "insurance",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Pension (UGX)",
      dataIndex: "pension",
      key: "pension",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Education (UGX)",
      dataIndex: "education",
      key: "education",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Total Contributions (UGX)",
      dataIndex: "totalContributions",
      key: "totalContributions",
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showModal("employer", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);

    if (record) {
      switch (type) {
        case "tax":
          taxForm.setFieldsValue(record);
          break;
        case "statutory":
        case "voluntary":
        case "employer":
          deductionForm.setFieldsValue(record);
          break;
        default:
          break;
      }
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderModal = () => {
    switch (modalType) {
      case "tax":
        return (
          <Modal
            title="Edit Tax Information"
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
            <Form form={taxForm} layout="vertical">
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
                    name="grossSalary"
                    label="Gross Salary (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the gross salary!",
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
                    name="taxableIncome"
                    label="Taxable Income (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the taxable income!",
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
                <Col span={8}>
                  <Form.Item
                    name="payeAmount"
                    label="PAYE Amount (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the PAYE amount!",
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
                <Col span={8}>
                  <Form.Item
                    name="taxRate"
                    label="Effective Tax Rate"
                    rules={[
                      {
                        required: true,
                        message: "Please input the tax rate!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="netAfterTax"
                    label="Net After Tax (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the net after tax!",
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
            </Form>
          </Modal>
        );
      case "statutory":
        return (
          <Modal
            title="Edit Statutory Deductions"
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
            <Form form={deductionForm} layout="vertical">
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
                    name="nssfEmployee"
                    label={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Shield size={16} className="mr-1" /> NSSF Employee
                        Contribution (UGX)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the NSSF employee contribution!",
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
                    name="nssfEmployer"
                    label={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Building size={16} className="mr-1" /> NSSF Employer
                        Contribution (UGX)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the NSSF employer contribution!",
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
                    name="nhif"
                    label={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Heart size={16} className="mr-1" /> NHIF Contribution
                        (UGX)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the NHIF contribution!",
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
                    name="totalStatutory"
                    label="Total Statutory Deductions (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the total statutory deductions!",
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
            </Form>
          </Modal>
        );
      case "voluntary":
        return (
          <Modal
            title="Edit Voluntary Deductions"
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
            <Form form={deductionForm} layout="vertical">
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
                <Col span={8}>
                  <Form.Item
                    name="savingsScheme"
                    label="Savings Scheme (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the savings scheme amount!",
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
                <Col span={8}>
                  <Form.Item
                    name="union"
                    label="Union Dues (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the union dues!",
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
                <Col span={8}>
                  <Form.Item
                    name="welfare"
                    label="Welfare Fund (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the welfare fund amount!",
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
                    name="totalVoluntary"
                    label="Total Voluntary Deductions (UGX)"
                    rules={[
                      {
                        required: true,
                        message: "Please input the total voluntary deductions!",
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
            </Form>
          </Modal>
        );
      case "employer":
        return (
          <Modal
            title="Edit Employer Contributions"
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
            <Form form={deductionForm} layout="vertical">
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
                <Col span={8}>
                  <Form.Item
                    name="insurance"
                    label={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Heart size={16} className="mr-1" /> Insurance (UGX)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the insurance amount!",
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
                <Col span={8}>
                  <Form.Item
                    name="pension"
                    label={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Shield size={16} className="mr-1" /> Pension (UGX)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the pension amount!",
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
                <Col span={8}>
                  <Form.Item
                    name="education"
                    label={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <BookOpen size={16} className="mr-1" /> Education (UGX)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the education amount!",
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
                    name="totalContributions"
                    label="Total Employer Contributions (UGX)"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please input the total employer contributions!",
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
            </Form>
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
              <Percent size={16} /> Tax Calculation
            </span>
          }
          key="1"
        >
          <Card title="Uganda PAYE Tax Brackets">
            <Alert
              message="Uganda Tax Information"
              description="The Pay As You Earn (PAYE) tax system in Uganda is progressive, with rates ranging from 0% to 40% depending on income levels."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Monthly Income up to UGX 235,000">
                0% (Tax Exempt)
              </Descriptions.Item>
              <Descriptions.Item label="UGX 235,001 to UGX 335,000">
                10% of the amount exceeding UGX 235,000
              </Descriptions.Item>
              <Descriptions.Item label="UGX 335,001 to UGX 410,000">
                UGX 10,000 + 20% of the amount exceeding UGX 335,000
              </Descriptions.Item>
              <Descriptions.Item label="Above UGX 410,000">
                UGX 25,000 + 30% of the amount exceeding UGX 410,000
              </Descriptions.Item>
              <Descriptions.Item label="Above UGX 10,000,000">
                Additional 10% on income exceeding UGX 10,000,000
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Divider />

          <Card
            title="Employee Tax Calculations"
            extra={
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => showModal("tax")}
              >
                Add New
              </Button>
            }
          >
            <Table
              size="small"
              columns={taxColumns}
              dataSource={taxRecords}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Shield size={16} /> Statutory Deductions
            </span>
          }
          key="2"
        >
          <Card
            title="Statutory Deductions"
            extra={
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => showModal("statutory")}
              >
                Add New
              </Button>
            }
          >
            <Alert
              message="Uganda NSSF Information"
              description="The National Social Security Fund (NSSF) requires a 5% contribution from employees and 10% from employers based on gross salary."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table
              size="small"
              columns={statutoryColumns}
              dataSource={statutoryDeductions}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Users size={16} /> Voluntary Deductions
            </span>
          }
          key="3"
        >
          <Card
            title="Voluntary Deductions"
            extra={
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => showModal("voluntary")}
              >
                Add New
              </Button>
            }
          >
            <Table
              size="small"
              columns={voluntaryColumns}
              dataSource={voluntaryDeductions}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Briefcase size={16} /> Employer Contributions
            </span>
          }
          key="4"
        >
          <Card
            title="Employer Contributions"
            extra={
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => showModal("employer")}
              >
                Add New
              </Button>
            }
          >
            <Table
              size="small"
              columns={employerColumns}
              dataSource={employerContributions}
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
