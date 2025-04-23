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
  Typography,
  Steps,
  Dropdown,
  Menu,
  Badge,
  Avatar,
  Statistic,
  Alert,
  Radio,
  Switch,
  Descriptions,
  message,
  Drawer,
  List,
  Timeline,
} from "antd";
import {
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Award,
  DollarSign,
  Home,
  Coffee,
  Car,
  Briefcase,
  FileText,
  Settings,
  Users,
  Percent,
  ChevronDown,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Layers,
  Sliders,
  Info,
  Eye,
  Copy,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

export default function SalaryManagement() {
  const [activeTab, setActiveTab] = useState("1");
  const [viewMode, setViewMode] = useState("table");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const [configStep, setConfigStep] = useState(0);
  const [salaryStructureForm] = Form.useForm();
  const [allowanceForm] = Form.useForm();
  const [salaryConfigForm] = Form.useForm();
  const [salaryGradeForm] = Form.useForm();
  const [salaryComponentForm] = Form.useForm();

  // Sample data for Uganda
  const salaryStructures = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      position: "Senior Accountant",
      department: "Finance",
      basicSalary: 2500000,
      grossSalary: 3200000,
      netSalary: 2800000,
      payGrade: "M3",
      status: "Active",
      lastUpdated: "2023-10-15",
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      position: "HR Manager",
      department: "Human Resources",
      basicSalary: 3000000,
      grossSalary: 3800000,
      netSalary: 3300000,
      payGrade: "M2",
      status: "Active",
      lastUpdated: "2023-10-12",
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      position: "Software Developer",
      department: "IT",
      basicSalary: 2800000,
      grossSalary: 3500000,
      netSalary: 3100000,
      payGrade: "M3",
      status: "Active",
      lastUpdated: "2023-10-10",
    },
    {
      key: "4",
      employeeId: "UG004",
      name: "Achieng Mary",
      position: "Marketing Specialist",
      department: "Marketing",
      basicSalary: 2300000,
      grossSalary: 2900000,
      netSalary: 2500000,
      payGrade: "M1",
      status: "Active",
      lastUpdated: "2023-10-08",
    },
    {
      key: "5",
      employeeId: "UG005",
      name: "Opio James",
      position: "Operations Manager",
      department: "Operations",
      basicSalary: 3200000,
      grossSalary: 4000000,
      netSalary: 3500000,
      payGrade: "M2",
      status: "Active",
      lastUpdated: "2023-10-05",
    },
  ];

  const salaryGrades = [
    {
      key: "1",
      gradeCode: "E1",
      gradeName: "Entry Level",
      minSalary: 1000000,
      maxSalary: 1500000,
      description: "Entry level positions with 0-1 years experience",
      department: "All",
    },
    {
      key: "2",
      gradeCode: "E2",
      gradeName: "Junior",
      minSalary: 1500001,
      maxSalary: 2000000,
      description: "Junior positions with 1-2 years experience",
      department: "All",
    },
    {
      key: "3",
      gradeCode: "M1",
      gradeName: "Mid Level",
      minSalary: 2000001,
      maxSalary: 2500000,
      description: "Mid level positions with 2-4 years experience",
      department: "All",
    },
    {
      key: "4",
      gradeCode: "M2",
      gradeName: "Senior",
      minSalary: 2500001,
      maxSalary: 3500000,
      description: "Senior positions with 4-7 years experience",
      department: "All",
    },
    {
      key: "5",
      gradeCode: "M3",
      gradeName: "Manager",
      minSalary: 3500001,
      maxSalary: 4500000,
      description: "Management positions with 7+ years experience",
      department: "All",
    },
    {
      key: "6",
      gradeCode: "D1",
      gradeName: "Director",
      minSalary: 4500001,
      maxSalary: 7000000,
      description: "Director level positions with 10+ years experience",
      department: "All",
    },
  ];

  const salaryComponents = [
    {
      key: "1",
      componentCode: "BASIC",
      componentName: "Basic Salary",
      type: "Earning",
      taxable: true,
      percentage: 70,
      description: "Base salary component",
      calculationType: "Percentage of Gross",
    },
    {
      key: "2",
      componentCode: "HRA",
      componentName: "Housing Allowance",
      type: "Earning",
      taxable: true,
      percentage: 15,
      description: "Housing allowance for employees",
      calculationType: "Percentage of Basic",
    },
    {
      key: "3",
      componentCode: "TA",
      componentName: "Transport Allowance",
      type: "Earning",
      taxable: true,
      percentage: 10,
      description: "Transport allowance for employees",
      calculationType: "Percentage of Basic",
    },
    {
      key: "4",
      componentCode: "MA",
      componentName: "Meal Allowance",
      type: "Earning",
      taxable: true,
      percentage: 5,
      description: "Meal allowance for employees",
      calculationType: "Percentage of Basic",
    },
    {
      key: "5",
      componentCode: "PAYE",
      componentName: "PAYE Tax",
      type: "Deduction",
      taxable: false,
      percentage: null,
      description: "Pay As You Earn tax deduction",
      calculationType: "Tax Slab",
    },
    {
      key: "6",
      componentCode: "NSSF",
      componentName: "NSSF Contribution",
      type: "Deduction",
      taxable: false,
      percentage: 5,
      description: "National Social Security Fund contribution",
      calculationType: "Percentage of Gross",
    },
  ];

  const allowances = [
    {
      key: "1",
      employeeId: "UG001",
      name: "Okello David",
      housingAllowance: 400000,
      transportAllowance: 200000,
      mealAllowance: 100000,
      specialAllowance: 0,
    },
    {
      key: "2",
      employeeId: "UG002",
      name: "Namukwaya Sarah",
      housingAllowance: 500000,
      transportAllowance: 200000,
      mealAllowance: 100000,
      specialAllowance: 0,
    },
    {
      key: "3",
      employeeId: "UG003",
      name: "Mugisha Peter",
      housingAllowance: 400000,
      transportAllowance: 200000,
      mealAllowance: 100000,
      specialAllowance: 0,
    },
  ];

  const taxSlabs = [
    {
      key: "1",
      fromAmount: 0,
      toAmount: 235000,
      percentage: 0,
      description: "Not taxable",
    },
    {
      key: "2",
      fromAmount: 235001,
      toAmount: 335000,
      percentage: 10,
      description: "10% of the amount exceeding UGX 235,000",
    },
    {
      key: "3",
      fromAmount: 335001,
      toAmount: 410000,
      percentage: 20,
      description: "UGX 10,000 plus 20% of the amount exceeding UGX 335,000",
    },
    {
      key: "4",
      fromAmount: 410001,
      toAmount: 10000000,
      percentage: 30,
      description: "UGX 25,000 plus 30% of the amount exceeding UGX 410,000",
    },
    {
      key: "5",
      fromAmount: 10000001,
      toAmount: null,
      percentage: 40,
      description:
        "UGX 2,912,500 plus 40% of the amount exceeding UGX 10,000,000",
    },
  ];

  const salaryColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            style={{
              backgroundColor: getAvatarColor(record.name),
              marginRight: 8,
            }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      filters: [
        { text: "Finance", value: "Finance" },
        { text: "Human Resources", value: "Human Resources" },
        { text: "IT", value: "IT" },
        { text: "Marketing", value: "Marketing" },
        { text: "Operations", value: "Operations" },
      ],
      onFilter: (value, record) => record.department === value,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Basic Salary (UGX)",
      dataIndex: "basicSalary",
      key: "basicSalary",
      sorter: (a, b) => a.basicSalary - b.basicSalary,
      render: (text) => (
        <span className="font-medium">
          {new Intl.NumberFormat("en-UG").format(text)}
        </span>
      ),
    },
    {
      title: "Gross Salary (UGX)",
      dataIndex: "grossSalary",
      key: "grossSalary",
      sorter: (a, b) => a.grossSalary - b.grossSalary,
      render: (text) => (
        <span className="font-medium">
          {new Intl.NumberFormat("en-UG").format(text)}
        </span>
      ),
    },
    {
      title: "Net Salary (UGX)",
      dataIndex: "netSalary",
      key: "netSalary",
      sorter: (a, b) => a.netSalary - b.netSalary,
      render: (text) => (
        <span className="font-semibold text-green-600">
          {new Intl.NumberFormat("en-UG").format(text)}
        </span>
      ),
    },
    {
      title: "Pay Grade",
      dataIndex: "payGrade",
      key: "payGrade",
      filters: [
        { text: "E1 - Entry Level", value: "E1" },
        { text: "E2 - Junior", value: "E2" },
        { text: "M1 - Mid Level", value: "M1" },
        { text: "M2 - Senior", value: "M2" },
        { text: "M3 - Manager", value: "M3" },
        { text: "D1 - Director", value: "D1" },
      ],
      onFilter: (value, record) => record.payGrade === value,
      render: (text) => {
        let color = "default";
        switch (text) {
          case "E1":
          case "E2":
            color = "blue";
            break;
          case "M1":
          case "M2":
            color = "purple";
            break;
          case "M3":
            color = "orange";
            break;
          case "D1":
            color = "red";
            break;
          default:
            color = "default";
        }
        return (
          <Tag
            color={color}
            style={{ fontSize: "10px", padding: "0px 6px", height: "auto" }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-UG");
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showEmployeeDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<FileText size={14} />}
                  onClick={() => message.success("Salary slip generated")}
                >
                  Generate Salary Slip
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<Copy size={14} />}
                  onClick={() => message.success("Salary structure copied")}
                >
                  Copy Salary Structure
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="3"
                  icon={<Trash2 size={14} />}
                  danger
                  onClick={() =>
                    Modal.confirm({
                      title: "Are you sure you want to delete this record?",
                      icon: <AlertCircle size={16} />,
                      content:
                        "This action cannot be undone. All salary data for this employee will be permanently removed.",
                      okText: "Delete",
                      okType: "danger",
                      cancelText: "Cancel",
                      onOk() {
                        message.success("Record deleted successfully");
                      },
                    })
                  }
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const salaryGradeColumns = [
    {
      title: "Grade Code",
      dataIndex: "gradeCode",
      key: "gradeCode",
      sorter: (a, b) => a.gradeCode.localeCompare(b.gradeCode),
    },
    {
      title: "Grade Name",
      dataIndex: "gradeName",
      key: "gradeName",
      sorter: (a, b) => a.gradeName.localeCompare(b.gradeName),
    },
    {
      title: "Min Salary (UGX)",
      dataIndex: "minSalary",
      key: "minSalary",
      sorter: (a, b) => a.minSalary - b.minSalary,
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Max Salary (UGX)",
      dataIndex: "maxSalary",
      key: "maxSalary",
      sorter: (a, b) => a.maxSalary - b.maxSalary,
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "All", value: "All" },
        { text: "Finance", value: "Finance" },
        { text: "Human Resources", value: "Human Resources" },
        { text: "IT", value: "IT" },
        { text: "Marketing", value: "Marketing" },
        { text: "Operations", value: "Operations" },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => {
                salaryGradeForm.setFieldsValue(record);
                setConfigDrawerVisible(true);
                setConfigStep(1);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              onClick={() =>
                Modal.confirm({
                  title: "Are you sure you want to delete this grade?",
                  icon: <AlertCircle size={16} />,
                  content:
                    "This action cannot be undone. All salary grade data will be permanently removed.",
                  okText: "Delete",
                  okType: "danger",
                  cancelText: "Cancel",
                  onOk() {
                    message.success("Grade deleted successfully");
                  },
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const salaryComponentColumns = [
    {
      title: "Component Code",
      dataIndex: "componentCode",
      key: "componentCode",
      sorter: (a, b) => a.componentCode.localeCompare(b.componentCode),
    },
    {
      title: "Component Name",
      dataIndex: "componentName",
      key: "componentName",
      sorter: (a, b) => a.componentName.localeCompare(b.componentName),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Earning", value: "Earning" },
        { text: "Deduction", value: "Deduction" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) => (
        <Tag color={text === "Earning" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Taxable",
      dataIndex: "taxable",
      key: "taxable",
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.taxable === value,
      render: (text) =>
        text ? (
          <CheckCircle size={16} color="green" />
        ) : (
          <XCircle size={16} color="red" />
        ),
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      sorter: (a, b) => (a.percentage || 0) - (b.percentage || 0),
      render: (text) => (text ? `${text}%` : "N/A"),
    },
    {
      title: "Calculation Type",
      dataIndex: "calculationType",
      key: "calculationType",
      filters: [
        { text: "Percentage of Gross", value: "Percentage of Gross" },
        { text: "Percentage of Basic", value: "Percentage of Basic" },
        { text: "Fixed Amount", value: "Fixed Amount" },
        { text: "Tax Slab", value: "Tax Slab" },
      ],
      onFilter: (value, record) => record.calculationType === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => {
                salaryComponentForm.setFieldsValue(record);
                setConfigDrawerVisible(true);
                setConfigStep(2);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              onClick={() =>
                Modal.confirm({
                  title: "Are you sure you want to delete this component?",
                  icon: <AlertCircle size={16} />,
                  content:
                    "This action cannot be undone. This salary component will be permanently removed.",
                  okText: "Delete",
                  okType: "danger",
                  cancelText: "Cancel",
                  onOk() {
                    message.success("Component deleted successfully");
                  },
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const taxSlabColumns = [
    {
      title: "From Amount (UGX)",
      dataIndex: "fromAmount",
      key: "fromAmount",
      sorter: (a, b) => a.fromAmount - b.fromAmount,
      render: (text) => new Intl.NumberFormat("en-UG").format(text),
    },
    {
      title: "To Amount (UGX)",
      dataIndex: "toAmount",
      key: "toAmount",
      sorter: (a, b) => {
        if (a.toAmount === null) return 1;
        if (b.toAmount === null) return -1;
        return a.toAmount - b.toAmount;
      },
      render: (text) =>
        text ? new Intl.NumberFormat("en-UG").format(text) : "Above",
    },
    {
      title: "Tax Rate",
      dataIndex: "percentage",
      key: "percentage",
      sorter: (a, b) => a.percentage - b.percentage,
      render: (text) => `${text}%`,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button type="text" icon={<Edit size={16} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setDrawerVisible(true);
  };

  const showEditModal = (employee) => {
    salaryStructureForm.setFieldsValue(employee);
    Modal.confirm({
      title: "Edit Salary Structure",
      width: 800,
      icon: null,
      content: (
        <Form
          form={salaryStructureForm}
          layout="vertical"
          initialValues={{ payGrade: "M3" }}
          className="pt-4"
        >
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
                name="position"
                label="Position"
                rules={[
                  {
                    required: true,
                    message: "Please input the position!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  {
                    required: true,
                    message: "Please select the department!",
                  },
                ]}
              >
                <Select>
                  <Option value="Finance">Finance</Option>
                  <Option value="Human Resources">Human Resources</Option>
                  <Option value="IT">IT</Option>
                  <Option value="Operations">Operations</Option>
                  <Option value="Marketing">Marketing</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="basicSalary"
                label="Basic Salary (UGX)"
                rules={[
                  {
                    required: true,
                    message: "Please input the basic salary!",
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
            <Col span={8}>
              <Form.Item
                name="netSalary"
                label="Net Salary (UGX)"
                rules={[
                  {
                    required: true,
                    message: "Please input the net salary!",
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
                name="payGrade"
                label="Pay Grade"
                rules={[
                  {
                    required: true,
                    message: "Please select the pay grade!",
                  },
                ]}
              >
                <Select>
                  <Option value="E1">E1 - Entry Level</Option>
                  <Option value="E2">E2 - Junior</Option>
                  <Option value="M1">M1 - Mid Level</Option>
                  <Option value="M2">M2 - Senior</Option>
                  <Option value="M3">M3 - Manager</Option>
                  <Option value="D1">D1 - Director</Option>
                </Select>
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
                  <Option value="Inactive">Inactive</Option>
                  <Option value="On Leave">On Leave</Option>
                  <Option value="Terminated">Terminated</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
      okText: "Save Changes",
      cancelText: "Cancel",
      onOk() {
        message.success("Salary structure updated successfully");
      },
    });
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#712fd1",
      "#f50057",
      "#087f23",
      "#1565c0",
    ];
    const firstChar = name.charAt(0).toLowerCase();
    const charCode = firstChar.charCodeAt(0) - 97;
    return colors[charCode % colors.length];
  };

  const handleConfigDrawerClose = () => {
    setConfigDrawerVisible(false);
    setTimeout(() => {
      setConfigStep(0);
    }, 300);
  };

  const renderConfigSteps = () => {
    return (
      <Steps
        current={configStep}
        onChange={setConfigStep}
        direction="horizontal"
        items={[
          {
            title: "Salary Configuration",
            icon: <Settings size={16} />,
          },
          {
            title: "Salary Grades",
            icon: <Layers size={16} />,
          },
          {
            title: "Salary Components",
            icon: <Sliders size={16} />,
          },
          {
            title: "Tax Configuration",
            icon: <Percent size={16} />,
          },
        ]}
      />
    );
  };

  const renderConfigContent = () => {
    switch (configStep) {
      case 0:
        return (
          <div className="mt-6">
            <Alert
              message="Salary Configuration"
              description="Configure the global salary settings for your organization. These settings will apply to all employees unless overridden at the individual level."
              type="info"
              showIcon
              icon={<Info size={16} />}
              className="mb-6"
            />

            <Form
              form={salaryConfigForm}
              layout="vertical"
              initialValues={{
                salaryCalculationMethod: "gross",
                payrollCycle: "monthly",
                currencyCode: "UGX",
                workingDaysPerMonth: 22,
                workingHoursPerDay: 8,
                overtimeMultiplier: 1.5,
                weekendOvertimeMultiplier: 2.0,
                holidayOvertimeMultiplier: 2.5,
                roundingSalary: "nearest",
                roundingPrecision: 100,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="salaryCalculationMethod"
                    label="Salary Calculation Method"
                    rules={[
                      {
                        required: true,
                        message: "Please select calculation method!",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="gross">Gross to Net</Radio>
                      <Radio value="net">Net to Gross</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="payrollCycle"
                    label="Payroll Cycle"
                    rules={[
                      {
                        required: true,
                        message: "Please select payroll cycle!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="monthly">Monthly</Option>
                      <Option value="biweekly">Bi-Weekly</Option>
                      <Option value="weekly">Weekly</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="currencyCode"
                    label="Currency"
                    rules={[
                      {
                        required: true,
                        message: "Please select currency!",
                      },
                    ]}
                  >
                    <Select disabled>
                      <Option value="UGX">Ugandan Shilling (UGX)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="prorateSalary"
                    label="Prorate Salary for New Joiners/Exits"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Working Hours & Overtime</Divider>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="workingDaysPerMonth"
                    label="Working Days Per Month"
                    rules={[
                      {
                        required: true,
                        message: "Please input working days!",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={31} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="workingHoursPerDay"
                    label="Working Hours Per Day"
                    rules={[
                      {
                        required: true,
                        message: "Please input working hours!",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={24} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="overtimeEligible"
                    label="Overtime Eligible"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="overtimeMultiplier"
                    label="Weekday Overtime Multiplier"
                  >
                    <InputNumber
                      min={1}
                      max={5}
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="weekendOvertimeMultiplier"
                    label="Weekend Overtime Multiplier"
                  >
                    <InputNumber
                      min={1}
                      max={5}
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="holidayOvertimeMultiplier"
                    label="Holiday Overtime Multiplier"
                  >
                    <InputNumber
                      min={1}
                      max={5}
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Rounding Settings</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="roundingSalary"
                    label="Rounding Method"
                    rules={[
                      {
                        required: true,
                        message: "Please select rounding method!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="nearest">Round to Nearest</Option>
                      <Option value="up">Round Up</Option>
                      <Option value="down">Round Down</Option>
                      <Option value="none">No Rounding</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="roundingPrecision"
                    label="Rounding Precision (UGX)"
                  >
                    <Select>
                      <Option value={1}>1 (Exact Amount)</Option>
                      <Option value={10}>10</Option>
                      <Option value={100}>100</Option>
                      <Option value={1000}>1,000</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" icon={<Save size={16} />}>
                  Save Configuration
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      case 1:
        return (
          <div className="mt-6">
            <Alert
              message="Salary Grades Configuration"
              description="Define salary grades to standardize compensation across your organization. Each grade represents a salary range for different levels of employees."
              type="info"
              showIcon
              icon={<Info size={16} />}
              className="mb-6"
            />

            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>Salary Grades</Title>
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => {
                  salaryGradeForm.resetFields();
                  Modal.confirm({
                    title: "Add New Salary Grade",
                    width: 700,
                    icon: null,
                    content: (
                      <Form
                        form={salaryGradeForm}
                        layout="vertical"
                        className="pt-4"
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="gradeCode"
                              label="Grade Code"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input grade code!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g. E1, M2, D1" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="gradeName"
                              label="Grade Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input grade name!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g. Entry Level, Manager" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="minSalary"
                              label="Minimum Salary (UGX)"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input minimum salary!",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/UGX\s?|(,*)/g, "")
                                }
                                placeholder="e.g. 1,000,000"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="maxSalary"
                              label="Maximum Salary (UGX)"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input maximum salary!",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/UGX\s?|(,*)/g, "")
                                }
                                placeholder="e.g. 1,500,000"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="department"
                              label="Department"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select department!",
                                },
                              ]}
                              initialValue="All"
                            >
                              <Select>
                                <Option value="All">All Departments</Option>
                                <Option value="Finance">Finance</Option>
                                <Option value="Human Resources">
                                  Human Resources
                                </Option>
                                <Option value="IT">IT</Option>
                                <Option value="Operations">Operations</Option>
                                <Option value="Marketing">Marketing</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="description"
                              label="Description"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input description!",
                                },
                              ]}
                            >
                              <Input.TextArea rows={1} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    ),
                    okText: "Add Grade",
                    cancelText: "Cancel",
                    onOk() {
                      message.success("Salary grade added successfully");
                    },
                  });
                }}
              >
                Add New Grade
              </Button>
            </div>

            <Table
              columns={salaryGradeColumns}
              dataSource={salaryGrades}
              pagination={false}
              size="small"
              bordered
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
            />
          </div>
        );
      case 2:
        return (
          <div className="mt-6">
            <Alert
              message="Salary Components Configuration"
              description="Define the components that make up an employee's salary. Components can be earnings (like basic salary, allowances) or deductions (like tax, insurance)."
              type="info"
              showIcon
              icon={<Info size={16} />}
              className="mb-6"
            />

            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>Salary Components</Title>
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => {
                  salaryComponentForm.resetFields();
                  Modal.confirm({
                    title: "Add New Salary Component",
                    width: 700,
                    icon: null,
                    content: (
                      <Form
                        form={salaryComponentForm}
                        layout="vertical"
                        className="pt-4"
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="componentCode"
                              label="Component Code"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input component code!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g. BASIC, HRA, PAYE" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="componentName"
                              label="Component Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input component name!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g. Basic Salary, Housing Allowance" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="type"
                              label="Component Type"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select component type!",
                                },
                              ]}
                            >
                              <Radio.Group>
                                <Radio value="Earning">Earning</Radio>
                                <Radio value="Deduction">Deduction</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="taxable"
                              label="Taxable"
                              valuePropName="checked"
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="calculationType"
                              label="Calculation Type"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select calculation type!",
                                },
                              ]}
                            >
                              <Select>
                                <Option value="Percentage of Gross">
                                  Percentage of Gross
                                </Option>
                                <Option value="Percentage of Basic">
                                  Percentage of Basic
                                </Option>
                                <Option value="Fixed Amount">
                                  Fixed Amount
                                </Option>
                                <Option value="Tax Slab">Tax Slab</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="percentage"
                              label="Percentage/Amount"
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace("%", "")}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={24}>
                            <Form.Item
                              name="description"
                              label="Description"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input description!",
                                },
                              ]}
                            >
                              <Input.TextArea rows={2} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    ),
                    okText: "Add Component",
                    cancelText: "Cancel",
                    onOk() {
                      message.success("Salary component added successfully");
                    },
                  });
                }}
              >
                Add New Component
              </Button>
            </div>

            <Table
              columns={salaryComponentColumns}
              dataSource={salaryComponents}
              pagination={false}
              size="small"
              bordered
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
            />
          </div>
        );
      case 3:
        return (
          <div className="mt-6">
            <Alert
              message="Tax Configuration"
              description="Configure the tax slabs and rates for PAYE (Pay As You Earn) calculation. These settings will be used to automatically calculate tax deductions for employees."
              type="info"
              showIcon
              icon={<Info size={16} />}
              className="mb-6"
            />

            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>PAYE Tax Slabs</Title>
              <Button
                type="primary"
                icon={<PlusCircle size={16} />}
                onClick={() => {
                  Modal.confirm({
                    title: "Add New Tax Slab",
                    width: 700,
                    icon: null,
                    content: (
                      <Form layout="vertical" className="pt-4">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="fromAmount"
                              label="From Amount (UGX)"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input from amount!",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/UGX\s?|(,*)/g, "")
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="toAmount" label="To Amount (UGX)">
                              <InputNumber
                                style={{ width: "100%" }}
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/UGX\s?|(,*)/g, "")
                                }
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Leave empty for highest slab
                              </div>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="percentage"
                              label="Tax Rate (%)"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input tax rate!",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace("%", "")}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="description"
                              label="Description"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input description!",
                                },
                              ]}
                            >
                              <Input.TextArea rows={1} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    ),
                    okText: "Add Tax Slab",
                    cancelText: "Cancel",
                    onOk() {
                      message.success("Tax slab added successfully");
                    },
                  });
                }}
              >
                Add New Tax Slab
              </Button>
            </div>

            <Table
              columns={taxSlabColumns}
              dataSource={taxSlabs}
              pagination={false}
              size="small"
              bordered
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
            />

            <Divider />

            <div className="mb-4">
              <Title level={5}>Other Tax Settings</Title>
            </div>

            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nssfEmployeeRate"
                    label="NSSF Employee Contribution Rate"
                    initialValue={5}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nssfEmployerRate"
                    label="NSSF Employer Contribution Rate"
                    initialValue={10}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="taxYear"
                    label="Current Tax Year"
                    initialValue="2023-2024"
                  >
                    <Select>
                      <Option value="2023-2024">2023-2024</Option>
                      <Option value="2022-2023">2022-2023</Option>
                      <Option value="2021-2022">2021-2022</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="taxFilingDate"
                    label="Monthly Tax Filing Due Date"
                    initialValue={15}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={1}
                      max={31}
                      formatter={(value) => `${value}th of next month`}
                      parser={(value) => value.replace("th of next month", "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" icon={<Save size={16} />}>
                  Save Tax Settings
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="salary-management">
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={true}
              className="h-full"
              style={{ borderStyle: "dotted", borderColor: "#3f8600" }}
            >
              <Statistic
                title={
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1 text-blue-500" />
                    <span>Total Salary Budget</span>
                  </div>
                }
                value={18400000}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix=""
                suffix="UGX"
                formatter={(value) =>
                  `${new Intl.NumberFormat("en-UG").format(value)}`
                }
              />
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <TrendingUp size={14} className="mr-1 text-green-500" />
                <span>5.2% increase from last month</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={true}
              className="h-full"
              style={{ borderStyle: "dotted", borderColor: "#1890ff" }}
            >
              <Statistic
                title={
                  <div className="flex items-center">
                    <Users size={16} className="mr-1 text-purple-500" />
                    <span>Total Employees</span>
                  </div>
                }
                value={5}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <span>Across 5 departments</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={true}
              className="h-full"
              style={{ borderStyle: "dotted", borderColor: "#cf1322" }}
            >
              <Statistic
                title={
                  <div className="flex items-center">
                    <Percent size={16} className="mr-1 text-red-500" />
                    <span>Avg. PAYE Tax</span>
                  </div>
                }
                value={12.5}
                precision={1}
                valueStyle={{ color: "#cf1322" }}
                suffix="%"
              />
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <TrendingDown size={14} className="mr-1 text-green-500" />
                <span>1.2% decrease from last month</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              bordered={true}
              className="h-full"
              style={{ borderStyle: "dotted", borderColor: "#722ed1" }}
            >
              <Statistic
                title={
                  <div className="flex items-center">
                    <Award size={16} className="mr-1 text-yellow-500" />
                    <span>Avg. Salary</span>
                  </div>
                }
                value={3280000}
                precision={0}
                valueStyle={{ color: "#722ed1" }}
                formatter={(value) =>
                  `${new Intl.NumberFormat("en-UG").format(value)}`
                }
                suffix="UGX"
              />
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <TrendingUp size={14} className="mr-1 text-green-500" />
                <span>3.8% increase from last month</span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={4} className="mb-0">
            Salary & Earnings Management
          </Title>
          <Text type="secondary">
            Manage employee salaries, allowances, and earnings
          </Text>
        </div>
        <Space>
          <Button
            icon={<Settings size={16} />}
            onClick={() => setConfigDrawerVisible(true)}
          >
            Configure
          </Button>
          <Button
            type="primary"
            icon={<PlusCircle size={16} />}
            onClick={() => showEditModal({})}
          >
            Add Employee Salary
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <DollarSign size={16} /> Employee Salaries
            </span>
          }
          key="1"
        >
          <Card>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <Radio.Group
                  style={{}}
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="table">
                    <Tooltip title="Table view">
                      <FileText size={14} className="mr-1 mt-2" />
                    </Tooltip>
                    {/* Table View */}
                  </Radio.Button>
                  <Radio.Button value="card">
                    <Tooltip title="Card view">
                      <Layers size={14} className="mr-1" />
                    </Tooltip>
                    {/* Card View */}
                  </Radio.Button>
                </Radio.Group>
              </div>
              <Space>
                <Input
                  placeholder="Search employees..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                />
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="1">Export to Excel</Menu.Item>
                      <Menu.Item key="2">Export to PDF</Menu.Item>
                      <Menu.Item key="3">Print Salary Sheet</Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button icon={<Download size={16} />}>
                    Export <ChevronDown size={14} />
                  </Button>
                </Dropdown>
                <Button icon={<Filter size={16} />}>Filter</Button>
              </Space>
            </div>

            {viewMode === "table" ? (
              <Table
                columns={salaryColumns}
                dataSource={salaryStructures}
                pagination={{ pageSize: 10 }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "bg-gray-50" : ""
                }
                size="small"
                bordered
                summary={(pageData) => {
                  let totalBasicSalary = 0;
                  let totalGrossSalary = 0;
                  let totalNetSalary = 0;

                  pageData.forEach(
                    ({ basicSalary, grossSalary, netSalary }) => {
                      totalBasicSalary += basicSalary;
                      totalGrossSalary += grossSalary;
                      totalNetSalary += netSalary;
                    }
                  );

                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row className="bg-blue-50 font-medium">
                        <Table.Summary.Cell index={0} colSpan={4}>
                          Total
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4}>
                          {new Intl.NumberFormat("en-UG").format(
                            totalBasicSalary
                          )}{" "}
                          UGX
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={5}>
                          {new Intl.NumberFormat("en-UG").format(
                            totalGrossSalary
                          )}{" "}
                          UGX
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={6}>
                          {new Intl.NumberFormat("en-UG").format(
                            totalNetSalary
                          )}{" "}
                          UGX
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                          index={7}
                          colSpan={2}
                        ></Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  );
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salaryStructures.map((employee) => (
                  <Card
                    key={employee.key}
                    hoverable
                    className="employee-card"
                    actions={[
                      <Tooltip title="View Details" key="view">
                        <Eye
                          size={16}
                          onClick={() => showEmployeeDetails(employee)}
                        />
                      </Tooltip>,
                      <Tooltip title="Edit" key="edit">
                        <Edit
                          size={16}
                          onClick={() => showEditModal(employee)}
                        />
                      </Tooltip>,
                      <Tooltip title="More Actions" key="more">
                        <MoreHorizontal size={16} />
                      </Tooltip>,
                    ]}
                  >
                    <div className="flex items-center mb-4">
                      <Avatar
                        size={64}
                        style={{
                          backgroundColor: getAvatarColor(employee.name),
                        }}
                      >
                        {employee.name.charAt(0)}
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-lg font-medium">
                          {employee.name}
                        </div>
                        <div className="text-gray-500">{employee.position}</div>
                        <Tag color="blue">{employee.department}</Tag>
                      </div>
                    </div>
                    <Descriptions column={1} size="small" bordered>
                      <Descriptions.Item label="Employee ID">
                        {employee.employeeId}
                      </Descriptions.Item>
                      <Descriptions.Item label="Basic Salary">
                        {new Intl.NumberFormat("en-UG").format(
                          employee.basicSalary
                        )}{" "}
                        UGX
                      </Descriptions.Item>
                      <Descriptions.Item label="Gross Salary">
                        {new Intl.NumberFormat("en-UG").format(
                          employee.grossSalary
                        )}{" "}
                        UGX
                      </Descriptions.Item>
                      <Descriptions.Item label="Net Salary">
                        <span className="text-green-600 font-medium">
                          {new Intl.NumberFormat("en-UG").format(
                            employee.netSalary
                          )}{" "}
                          UGX
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="Pay Grade">
                        <Tag color="purple">{employee.payGrade}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Award size={16} /> Allowances & Bonuses
            </span>
          }
          key="2"
        >
          <Card title="Allowances" className="mb-4">
            <Table
              columns={[
                {
                  title: "Employee ID",
                  dataIndex: "employeeId",
                  key: "employeeId",
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  render: (text, record) => (
                    <div className="flex items-center">
                      <Avatar
                        style={{
                          backgroundColor: getAvatarColor(record.name),
                          marginRight: 8,
                        }}
                      >
                        {record.name.charAt(0)}
                      </Avatar>
                      <span>{text}</span>
                    </div>
                  ),
                },
                {
                  title: (
                    <span>
                      <Home size={14} className="mr-1" /> Housing (UGX)
                    </span>
                  ),
                  dataIndex: "housingAllowance",
                  key: "housingAllowance",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: (
                    <span>
                      <Car size={14} className="mr-1" /> Transport (UGX)
                    </span>
                  ),
                  dataIndex: "transportAllowance",
                  key: "transportAllowance",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: (
                    <span>
                      <Coffee size={14} className="mr-1" /> Meal (UGX)
                    </span>
                  ),
                  dataIndex: "mealAllowance",
                  key: "mealAllowance",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: (
                    <span>
                      <Briefcase size={14} className="mr-1" /> Special (UGX)
                    </span>
                  ),
                  dataIndex: "specialAllowance",
                  key: "specialAllowance",
                  render: (text) => new Intl.NumberFormat("en-UG").format(text),
                },
                {
                  title: "Total Allowances (UGX)",
                  key: "totalAllowances",
                  render: (_, record) => {
                    const total =
                      record.housingAllowance +
                      record.transportAllowance +
                      record.mealAllowance +
                      (record.specialAllowance || 0);
                    return (
                      <span className="font-medium">
                        {new Intl.NumberFormat("en-UG").format(total)}
                      </span>
                    );
                  },
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <Space size="small">
                      <Button
                        type="text"
                        icon={<Edit size={16} />}
                        onClick={() => {
                          allowanceForm.setFieldsValue(record);
                          Modal.confirm({
                            title: "Edit Allowances",
                            width: 700,
                            icon: null,
                            content: (
                              <Form
                                form={allowanceForm}
                                layout="vertical"
                                className="pt-4"
                              >
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      name="employeeId"
                                      label="Employee ID"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input the employee ID!",
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
                                          message:
                                            "Please input the employee name!",
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
                                      name="housingAllowance"
                                      label={
                                        <span>
                                          <Home size={16} className="mr-1" />{" "}
                                          Housing Allowance (UGX)
                                        </span>
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input the housing allowance!",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={(value) =>
                                          `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value.replace(/UGX\s?|(,*)/g, "")
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="transportAllowance"
                                      label={
                                        <span>
                                          <Car size={16} className="mr-1" />{" "}
                                          Transport Allowance (UGX)
                                        </span>
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input the transport allowance!",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={(value) =>
                                          `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value.replace(/UGX\s?|(,*)/g, "")
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      name="mealAllowance"
                                      label={
                                        <span>
                                          <Coffee size={16} className="mr-1" />{" "}
                                          Meal Allowance (UGX)
                                        </span>
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input the meal allowance!",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={(value) =>
                                          `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value.replace(/UGX\s?|(,*)/g, "")
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="specialAllowance"
                                      label={
                                        <span>
                                          <Briefcase
                                            size={16}
                                            className="mr-1"
                                          />{" "}
                                          Special Allowance (UGX)
                                        </span>
                                      }
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={(value) =>
                                          `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value.replace(/UGX\s?|(,*)/g, "")
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Form>
                            ),
                            okText: "Save Changes",
                            cancelText: "Cancel",
                            onOk() {
                              message.success(
                                "Allowances updated successfully"
                              );
                            },
                          });
                        }}
                      />
                    </Space>
                  ),
                },
              ]}
              dataSource={allowances}
              pagination={false}
              size="small"
              bordered
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
            />
          </Card>
        </TabPane>
      </Tabs>

      <Drawer
        title={
          <div className="flex items-center">
            <Avatar
              size={32}
              style={{
                backgroundColor: selectedEmployee
                  ? getAvatarColor(selectedEmployee.name)
                  : "#1890ff",
                marginRight: 8,
              }}
            >
              {selectedEmployee ? selectedEmployee.name.charAt(0) : ""}
            </Avatar>
            <span>
              {selectedEmployee ? selectedEmployee.name : ""} - Salary Details
            </span>
          </div>
        }
        width={600}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedEmployee && (
          <>
            <Descriptions
              title="Employee Information"
              bordered
              column={1}
              size="small"
              className="mb-6"
            >
              <Descriptions.Item label="Employee ID">
                {selectedEmployee.employeeId}
              </Descriptions.Item>
              <Descriptions.Item label="Position">
                {selectedEmployee.position}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                <Tag color="blue">{selectedEmployee.department}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Pay Grade">
                <Tag color="purple">{selectedEmployee.payGrade}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge status="success" text="Active" />
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Salary Breakdown</Divider>

            <Card className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Basic Salary"
                    value={selectedEmployee.basicSalary}
                    precision={0}
                    formatter={(value) =>
                      `${new Intl.NumberFormat("en-UG").format(value)} UGX`
                    }
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Gross Salary"
                    value={selectedEmployee.grossSalary}
                    precision={0}
                    formatter={(value) =>
                      `${new Intl.NumberFormat("en-UG").format(value)} UGX`
                    }
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Net Salary"
                    value={selectedEmployee.netSalary}
                    precision={0}
                    valueStyle={{ color: "#3f8600" }}
                    formatter={(value) =>
                      `${new Intl.NumberFormat("en-UG").format(value)} UGX`
                    }
                  />
                </Col>
              </Row>
            </Card>

            <Divider orientation="left">Earnings</Divider>

            <List
              size="small"
              bordered
              className="mb-6"
              dataSource={[
                {
                  title: "Basic Salary",
                  value: selectedEmployee.basicSalary,
                  icon: <DollarSign size={16} className="text-blue-500" />,
                },
                {
                  title: "Housing Allowance",
                  value: 400000,
                  icon: <Home size={16} className="text-green-500" />,
                },
                {
                  title: "Transport Allowance",
                  value: 200000,
                  icon: <Car size={16} className="text-orange-500" />,
                },
                {
                  title: "Meal Allowance",
                  value: 100000,
                  icon: <Coffee size={16} className="text-red-500" />,
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  actions={[
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-UG").format(item.value)} UGX
                    </span>,
                  ]}
                >
                  <List.Item.Meta avatar={item.icon} title={item.title} />
                </List.Item>
              )}
            />

            <Divider orientation="left">Deductions</Divider>

            <List
              size="small"
              bordered
              className="mb-6"
              dataSource={[
                {
                  title: "PAYE Tax",
                  value: 300000,
                  icon: <Percent size={16} className="text-red-500" />,
                },
                {
                  title: "NSSF Contribution",
                  value: 100000,
                  icon: <Briefcase size={16} className="text-purple-500" />,
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  actions={[
                    <span className="font-medium text-red-500">
                      -{new Intl.NumberFormat("en-UG").format(item.value)} UGX
                    </span>,
                  ]}
                >
                  <List.Item.Meta avatar={item.icon} title={item.title} />
                </List.Item>
              )}
            />

            <Divider orientation="left">Payment History</Divider>

            <Timeline className="mb-6">
              <Timeline.Item color="green">
                <p>October 2023 Salary Paid</p>
                <p className="text-xs text-gray-500">
                  {new Intl.NumberFormat("en-UG").format(
                    selectedEmployee.netSalary
                  )}{" "}
                  UGX - 28 Oct 2023
                </p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p>September 2023 Salary Paid</p>
                <p className="text-xs text-gray-500">
                  {new Intl.NumberFormat("en-UG").format(
                    selectedEmployee.netSalary - 50000
                  )}{" "}
                  UGX - 28 Sep 2023
                </p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p>August 2023 Salary Paid</p>
                <p className="text-xs text-gray-500">
                  {new Intl.NumberFormat("en-UG").format(
                    selectedEmployee.netSalary - 50000
                  )}{" "}
                  UGX - 28 Aug 2023
                </p>
              </Timeline.Item>
            </Timeline>

            <div className="flex justify-end">
              <Space>
                <Button icon={<FileText size={16} />}>Generate Payslip</Button>
                <Button type="primary" icon={<Edit size={16} />}>
                  Edit Salary
                </Button>
              </Space>
            </div>
          </>
        )}
      </Drawer>

      <Drawer
        title={
          <div className="flex items-center">
            <Settings size={20} className="mr-2" />
            <span>Salary Configuration</span>
          </div>
        }
        width={800}
        placement="right"
        onClose={handleConfigDrawerClose}
        open={configDrawerVisible}
      >
        {renderConfigSteps()}
        {renderConfigContent()}
      </Drawer>
    </div>
  );
}
