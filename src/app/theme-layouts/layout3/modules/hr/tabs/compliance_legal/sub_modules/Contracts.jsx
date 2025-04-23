import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag,
  Modal,
  Tooltip,
  Space,
  Tabs,
  Typography,
  Badge,
  Dropdown,
  Statistic,
  Alert,
  Menu,
  Progress,
  Upload,
  message,
  Drawer,
  List,
  Timeline,
  Avatar,
  Popover,
  Empty,
  Divider,
  Descriptions,
  InputNumber,
  Switch,
} from "antd";
import {
  FileText,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  UploadIcon,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  MoreHorizontal,
  Calendar,
  Users,
  BookOpen,
  FileCheck,
  User,
  ArrowRight,
  Copy,
  AlertCircle,
  Bookmark,
  Mail,
  Bell,
  Printer,
  File,
  FilePlus,
  ClipboardList,
  GraduationCap,
  School,
  ShieldCheck,
} from "lucide-react";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Shared data storage - simulating a backend
let sharedContractStorage = [];
let sharedPolicyStorage = [];

export default function ContractsPolicies() {
  const [contractForm] = Form.useForm();
  const [policyForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activeTab, setActiveTab] = useState("contracts");
  const [viewMode, setViewMode] = useState("table");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);

  // Sample data for contracts
  const contracts = [
    {
      key: "1",
      contractId: "NKUN-EMP-2023-001",
      employeeName: "Dr. Joseph Musoke",
      employeeId: "NKU-STAFF-1245",
      position: "Senior Lecturer",
      department: "Faculty of Science",
      contractType: "Permanent",
      startDate: "2023-01-15",
      endDate: "2026-01-14",
      status: "Active",
      signedBy: "Prof. Frederick Ssempala",
      signingDate: "2023-01-10",
      salary: 4500000,
      documents: ["employment_contract.pdf", "confidentiality_agreement.pdf"],
      renewalReminder: true,
      notes:
        "PhD in Computer Science. Specializes in Artificial Intelligence and Machine Learning.",
    },
    {
      key: "2",
      contractId: "NKUN-EMP-2023-002",
      employeeName: "Sarah Nakigozi",
      employeeId: "NKU-STAFF-1246",
      position: "Lecturer",
      department: "Faculty of Business",
      contractType: "Fixed Term",
      startDate: "2023-02-01",
      endDate: "2024-01-31",
      status: "Active",
      signedBy: "Prof. Frederick Ssempala",
      signingDate: "2023-01-25",
      salary: 3800000,
      documents: ["employment_contract.pdf"],
      renewalReminder: true,
      notes:
        "MBA from Makerere University. Previous industry experience at Standard Chartered Bank.",
    },
    {
      key: "3",
      contractId: "NKUN-EMP-2022-045",
      employeeName: "Robert Ochieng",
      employeeId: "NKU-STAFF-1198",
      position: "Assistant Lecturer",
      department: "Faculty of Arts",
      contractType: "Fixed Term",
      startDate: "2022-09-01",
      endDate: "2023-12-31",
      status: "Expiring Soon",
      signedBy: "Dr. James Mukasa",
      signingDate: "2022-08-20",
      salary: 3200000,
      documents: ["employment_contract.pdf", "code_of_conduct.pdf"],
      renewalReminder: true,
      notes:
        "MA in Literature. Working on PhD thesis. Excellent teaching evaluations.",
    },
    {
      key: "4",
      contractId: "NKUN-EMP-2021-078",
      employeeName: "Patricia Nambi",
      employeeId: "NKU-STAFF-1067",
      position: "Head of Department",
      department: "Faculty of Education",
      contractType: "Permanent",
      startDate: "2021-08-15",
      endDate: null,
      status: "Active",
      signedBy: "Prof. Frederick Ssempala",
      signingDate: "2021-08-10",
      salary: 5200000,
      documents: [
        "employment_contract.pdf",
        "confidentiality_agreement.pdf",
        "department_head_terms.pdf",
      ],
      renewalReminder: false,
      notes:
        "PhD in Education. 10+ years of experience in educational leadership.",
    },
    {
      key: "5",
      contractId: "NKUN-VIS-2023-012",
      employeeName: "Prof. Michael Otieno",
      employeeId: "NKU-VIS-123",
      position: "Visiting Professor",
      department: "Faculty of Science",
      contractType: "Visiting",
      startDate: "2023-09-01",
      endDate: "2023-12-15",
      status: "Active",
      signedBy: "Prof. Frederick Ssempala",
      signingDate: "2023-08-25",
      salary: 6000000,
      documents: ["visiting_professor_agreement.pdf"],
      renewalReminder: false,
      notes:
        "Visiting from University of Nairobi. Expert in Environmental Sciences.",
    },
    {
      key: "6",
      contractId: "NKUN-EMP-2020-056",
      employeeName: "Grace Atim",
      employeeId: "NKU-STAFF-987",
      position: "Administrative Assistant",
      department: "Registry",
      contractType: "Permanent",
      startDate: "2020-06-01",
      endDate: null,
      status: "Active",
      signedBy: "Dr. James Mukasa",
      signingDate: "2020-05-25",
      salary: 2800000,
      documents: [
        "employment_contract.pdf",
        "staff_handbook_acknowledgment.pdf",
      ],
      renewalReminder: false,
      notes:
        "Excellent organizational skills. Handles student registration and records.",
    },
  ];

  // Sample data for university policies
  const policies = [
    {
      key: "1",
      policyId: "NKU-POL-HR-001",
      title: "Employee Code of Conduct",
      category: "Human Resources",
      effectiveDate: "2022-01-01",
      revisionDate: "2023-01-01",
      nextReviewDate: "2024-01-01",
      status: "Active",
      approvedBy: "University Council",
      approvalDate: "2021-12-15",
      documents: ["employee_code_of_conduct.pdf"],
      description:
        "Guidelines for professional conduct of all Nkumba University employees.",
      acknowledgmentRequired: true,
      acknowledgmentStats: {
        total: 250,
        acknowledged: 237,
        pending: 13,
      },
    },
    {
      key: "2",
      policyId: "NKU-POL-HR-002",
      title: "Recruitment and Selection Policy",
      category: "Human Resources",
      effectiveDate: "2022-02-15",
      revisionDate: "2023-02-15",
      nextReviewDate: "2024-02-15",
      status: "Active",
      approvedBy: "University Council",
      approvalDate: "2022-02-01",
      documents: ["recruitment_policy.pdf"],
      description:
        "Procedures for hiring and selecting qualified candidates for academic and administrative positions.",
      acknowledgmentRequired: false,
      acknowledgmentStats: null,
    },
    {
      key: "3",
      policyId: "NKU-POL-AC-001",
      title: "Academic Integrity Policy",
      category: "Academic",
      effectiveDate: "2022-03-01",
      revisionDate: null,
      nextReviewDate: "2024-03-01",
      status: "Active",
      approvedBy: "Academic Board",
      approvalDate: "2022-02-20",
      documents: ["academic_integrity_policy.pdf"],
      description:
        "Guidelines for maintaining academic integrity and preventing plagiarism among students and faculty.",
      acknowledgmentRequired: true,
      acknowledgmentStats: {
        total: 250,
        acknowledged: 205,
        pending: 45,
      },
    },
    {
      key: "4",
      policyId: "NKU-POL-HR-003",
      title: "Sexual Harassment Prevention Policy",
      category: "Human Resources",
      effectiveDate: "2022-04-01",
      revisionDate: "2023-06-01",
      nextReviewDate: "2024-06-01",
      status: "Recently Updated",
      approvedBy: "University Council",
      approvalDate: "2023-05-25",
      documents: [
        "sexual_harassment_prevention_policy.pdf",
        "reporting_procedures.pdf",
      ],
      description:
        "Policy for preventing and addressing sexual harassment within the university community.",
      acknowledgmentRequired: true,
      acknowledgmentStats: {
        total: 250,
        acknowledged: 128,
        pending: 122,
      },
    },
    {
      key: "5",
      policyId: "NKU-POL-IT-001",
      title: "Information Technology Usage Policy",
      category: "IT",
      effectiveDate: "2022-05-01",
      revisionDate: null,
      nextReviewDate: "2024-05-01",
      status: "Active",
      approvedBy: "IT Committee",
      approvalDate: "2022-04-20",
      documents: ["it_usage_policy.pdf"],
      description:
        "Guidelines for proper use of university IT resources, systems, and data.",
      acknowledgmentRequired: true,
      acknowledgmentStats: {
        total: 250,
        acknowledged: 220,
        pending: 30,
      },
    },
    {
      key: "6",
      policyId: "NKU-POL-HR-004",
      title: "Leave and Absence Policy",
      category: "Human Resources",
      effectiveDate: "2022-06-01",
      revisionDate: null,
      nextReviewDate: "2024-06-01",
      status: "Under Review",
      approvedBy: "HR Committee",
      approvalDate: "2022-05-20",
      documents: ["leave_policy.pdf"],
      description:
        "Guidelines for annual leave, sick leave, maternity/paternity leave, and other absences.",
      acknowledgmentRequired: false,
      acknowledgmentStats: null,
    },
  ];

  // Initialize shared storage
  useEffect(() => {
    if (sharedContractStorage.length === 0) {
      sharedContractStorage = [...contracts];
    }
    if (sharedPolicyStorage.length === 0) {
      sharedPolicyStorage = [...policies];
    }
  }, []);

  // Column definitions for contracts table
  const contractColumns = [
    {
      title: "Contract ID",
      dataIndex: "contractId",
      key: "contractId",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.employeeId}</div>
        </div>
      ),
      sorter: (a, b) => a.contractId.localeCompare(b.contractId),
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            style={{
              backgroundColor: getAvatarColor(record.employeeName),
              marginRight: 8,
            }}
          >
            {record.employeeName.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.position}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Faculty of Science", value: "Faculty of Science" },
        { text: "Faculty of Business", value: "Faculty of Business" },
        { text: "Faculty of Arts", value: "Faculty of Arts" },
        { text: "Faculty of Education", value: "Faculty of Education" },
        { text: "Registry", value: "Registry" },
      ],
      onFilter: (value, record) => record.department === value,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Contract Type",
      dataIndex: "contractType",
      key: "contractType",
      filters: [
        { text: "Permanent", value: "Permanent" },
        { text: "Fixed Term", value: "Fixed Term" },
        { text: "Visiting", value: "Visiting" },
      ],
      onFilter: (value, record) => record.contractType === value,
      render: (text) => {
        let color = "green";
        if (text === "Fixed Term") color = "orange";
        else if (text === "Visiting") color = "purple";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <div style={{ display: "flex" }}>
          <div>{record.startDate}</div>
          <ArrowRight
            style={{}}
            size={14}
            className="mx-1 inline-block text-gray-400 mt-4"
          />
          <div>{record.endDate || "Indefinite"}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Expiring Soon", value: "Expiring Soon" },
        { text: "Expired", value: "Expired" },
        { text: "Terminated", value: "Terminated" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "green";
        let icon = <CheckCircle size={10} />;

        if (status === "Expiring Soon") {
          color = "orange";
          icon = <Clock size={10} />;
        } else if (status === "Expired") {
          color = "red";
          icon = <XCircle size={10} />;
        } else if (status === "Terminated") {
          color = "red";
          icon = <XCircle size={10} />;
        }

        return (
          <Tag
            icon={icon}
            color={color}
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
          >
            {status}
          </Tag>
        );
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
              onClick={() => showRecordDetails("contract", record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showEditModal("contract", record)}
            />
          </Tooltip>
          <Dropdown
            overlay={renderContractActionMenu(record)}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Column definitions for policies table
  const policyColumns = [
    {
      title: "Policy",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.policyId}</div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Human Resources", value: "Human Resources" },
        { text: "Academic", value: "Academic" },
        { text: "IT", value: "IT" },
        { text: "Financial", value: "Financial" },
        { text: "Administrative", value: "Administrative" },
      ],
      onFilter: (value, record) => record.category === value,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>
            <Text type="secondary">Effective: </Text>
            {record.effectiveDate}
          </div>
          <div>
            <Text type="secondary">Review: </Text>
            {record.nextReviewDate}
            {isDateApproaching(record.nextReviewDate) && (
              <Tag color="orange" className="ml-1">
                Soon
              </Tag>
            )}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Under Review", value: "Under Review" },
        { text: "Recently Updated", value: "Recently Updated" },
        { text: "Archived", value: "Archived" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "green";
        let icon = <CheckCircle size={10} />;

        if (status === "Under Review") {
          color = "blue";
          icon = <Clock size={10} />;
        } else if (status === "Recently Updated") {
          color = "cyan";
          icon = <RefreshCw size={10} />;
        } else if (status === "Archived") {
          color = "gray";
          icon = <Archive size={10} />;
        }

        return (
          <Tag
            icon={icon}
            color={color}
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
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Acknowledgment",
      key: "acknowledgment",
      render: (_, record) =>
        record.acknowledgmentRequired ? (
          <div>
            <Progress
              percent={Math.round(
                (record.acknowledgmentStats.acknowledged /
                  record.acknowledgmentStats.total) *
                  100
              )}
              size="small"
              format={(percent) => `${percent}%`}
            />
            <div className="text-xs text-gray-500 mt-1">
              {record.acknowledgmentStats.acknowledged} of{" "}
              {record.acknowledgmentStats.total} staff
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Not Required</span>
        ),
      sorter: (a, b) => {
        if (!a.acknowledgmentRequired && !b.acknowledgmentRequired) return 0;
        if (!a.acknowledgmentRequired) return 1;
        if (!b.acknowledgmentRequired) return -1;

        const aPercent =
          (a.acknowledgmentStats.acknowledged / a.acknowledgmentStats.total) *
          100;
        const bPercent =
          (b.acknowledgmentStats.acknowledged / b.acknowledgmentStats.total) *
          100;
        return aPercent - bPercent;
      },
    },
    {
      title: "Approved By",
      dataIndex: "approvedBy",
      key: "approvedBy",
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
              onClick={() => showRecordDetails("policy", record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showEditModal("policy", record)}
            />
          </Tooltip>
          <Dropdown
            overlay={renderPolicyActionMenu(record)}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Helper to get avatar color
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

  // Helper to check if date is approaching (within 30 days)
  const isDateApproaching = (dateString) => {
    if (!dateString) return false;
    const today = moment();
    const date = moment(dateString);
    const diff = date.diff(today, "days");
    return diff >= 0 && diff <= 30;
  };

  // Function to show record details
  const showRecordDetails = (recordType, record) => {
    setSelectedRecord({ type: recordType, ...record });
    setDrawerVisible(true);
  };

  // Function to show edit modal
  const showEditModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);

    if (record) {
      switch (type) {
        case "contract":
          contractForm.setFieldsValue(record);
          break;
        case "policy":
          policyForm.setFieldsValue(record);
          break;
        default:
          break;
      }
    } else {
      // Clear form for new record
      switch (type) {
        case "contract":
          contractForm.resetFields();
          break;
        case "policy":
          policyForm.resetFields();
          break;
        default:
          break;
      }
    }
  };

  // Handle modal OK
  const handleModalOk = () => {
    if (modalType === "contract") {
      contractForm.validateFields().then((values) => {
        // In a real app, you'd save to backend here
        message.success("Contract saved successfully");
        // Update shared storage
        if (values.key) {
          // Update existing
          const index = sharedContractStorage.findIndex(
            (c) => c.key === values.key
          );
          if (index !== -1) {
            sharedContractStorage[index] = {
              ...sharedContractStorage[index],
              ...values,
            };
          }
        } else {
          // Add new
          const newKey = `new-${Date.now()}`;
          sharedContractStorage.push({
            key: newKey,
            contractId: `NKUN-EMP-${new Date().getFullYear()}-${Math.floor(
              Math.random() * 1000
            )
              .toString()
              .padStart(3, "0")}`,
            ...values,
          });
        }
        setIsModalVisible(false);
      });
    } else if (modalType === "policy") {
      policyForm.validateFields().then((values) => {
        // In a real app, you'd save to backend here
        message.success("Policy saved successfully");
        // Update shared storage
        if (values.key) {
          // Update existing
          const index = sharedPolicyStorage.findIndex(
            (p) => p.key === values.key
          );
          if (index !== -1) {
            sharedPolicyStorage[index] = {
              ...sharedPolicyStorage[index],
              ...values,
            };
          }
        } else {
          // Add new
          const newKey = `new-${Date.now()}`;
          sharedPolicyStorage.push({
            key: newKey,
            policyId: `NKU-POL-${values.category.substring(0, 2).toUpperCase()}-${Math.floor(
              Math.random() * 1000
            )
              .toString()
              .padStart(3, "0")}`,
            ...values,
          });
        }
        setIsModalVisible(false);
      });
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Function to render the context menu for contracts
  const renderContractActionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="1"
        icon={<Download size={14} />}
        onClick={() => message.info("Downloading contract...")}
      >
        Download Contract
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<Printer size={14} />}
        onClick={() => message.info("Sending to printer...")}
      >
        Print
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<Mail size={14} />}
        onClick={() => message.info("Preparing email...")}
      >
        Email to Employee
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="4"
        icon={<Bell size={14} />}
        onClick={() => {
          message.success(
            "Renewal reminder " +
              (record.renewalReminder ? "disabled" : "enabled")
          );
        }}
      >
        {record.renewalReminder
          ? "Disable Renewal Reminder"
          : "Enable Renewal Reminder"}
      </Menu.Item>
      {record.contractType !== "Permanent" && record.status === "Active" && (
        <Menu.Item
          key="5"
          icon={<FilePlus size={14} />}
          onClick={() => message.info("Preparing renewal...")}
        >
          Prepare Renewal
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="6"
        icon={<Trash2 size={14} />}
        danger
        onClick={() => {
          Modal.confirm({
            title: "Are you sure you want to delete this contract?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No, Cancel",
            onOk() {
              message.success("Contract deleted");
            },
          });
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Function to render the context menu for policies
  const renderPolicyActionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="1"
        icon={<Download size={14} />}
        onClick={() => message.info("Downloading policy...")}
      >
        Download Policy
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<Printer size={14} />}
        onClick={() => message.info("Sending to printer...")}
      >
        Print
      </Menu.Item>
      {record.acknowledgmentRequired && (
        <Menu.Item
          key="3"
          icon={<Mail size={14} />}
          onClick={() => {
            message.success(
              "Reminder sent to employees who haven't acknowledged"
            );
          }}
        >
          Send Reminder
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="4"
        icon={<ClipboardList size={14} />}
        onClick={() => message.info("Viewing acknowledgments...")}
      >
        View Acknowledgments
      </Menu.Item>
      <Menu.Item
        key="5"
        icon={<RefreshCw size={14} />}
        onClick={() => {
          Modal.confirm({
            title: "Start Policy Review Process?",
            content:
              'This will mark the policy as "Under Review" and notify relevant stakeholders.',
            onOk() {
              message.success("Policy review process initiated");
            },
          });
        }}
      >
        Initiate Review
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="6"
        icon={<Trash2 size={14} />}
        danger
        onClick={() => {
          Modal.confirm({
            title: "Are you sure you want to delete this policy?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No, Cancel",
            onOk() {
              message.success("Policy deleted");
            },
          });
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Render drawer content based on record type
  const renderDrawerContent = () => {
    if (!selectedRecord) return null;

    if (selectedRecord.type === "contract") {
      return (
        <>
          <Descriptions
            title="Contract Details"
            bordered
            column={1}
            size="small"
            className="mb-6"
          >
            <Descriptions.Item label="Contract ID">
              {selectedRecord.contractId}
            </Descriptions.Item>
            <Descriptions.Item label="Employee">
              {selectedRecord.employeeName}
            </Descriptions.Item>
            <Descriptions.Item label="Employee ID">
              {selectedRecord.employeeId}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
              {selectedRecord.position}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {selectedRecord.department}
            </Descriptions.Item>
            <Descriptions.Item label="Contract Type">
              <Tag
                color={
                  selectedRecord.contractType === "Permanent"
                    ? "green"
                    : selectedRecord.contractType === "Fixed Term"
                      ? "orange"
                      : "purple"
                }
              >
                {selectedRecord.contractType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedRecord.status === "Active"
                    ? "green"
                    : selectedRecord.status === "Expiring Soon"
                      ? "orange"
                      : "red"
                }
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {selectedRecord.startDate}
            </Descriptions.Item>
            {selectedRecord.endDate && (
              <Descriptions.Item label="End Date">
                {selectedRecord.endDate}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Signed By">
              {selectedRecord.signedBy}
            </Descriptions.Item>
            <Descriptions.Item label="Signing Date">
              {selectedRecord.signingDate}
            </Descriptions.Item>
            <Descriptions.Item label="Salary">
              UGX {selectedRecord.salary?.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Renewal Reminder">
              {selectedRecord.renewalReminder ? "Enabled" : "Disabled"}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Contract Documents</Divider>
          {selectedRecord.documents && selectedRecord.documents.length > 0 ? (
            <List
              size="small"
              bordered
              dataSource={selectedRecord.documents}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<Download size={14} />}>
                      Download
                    </Button>,
                  ]}
                >
                  <FileText size={16} className="mr-2" />
                  {item}
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No documents available" />
          )}

          <Divider orientation="left">Notes</Divider>
          <Paragraph className="mb-4">
            {selectedRecord.notes ||
              "No additional notes available for this contract."}
          </Paragraph>

          <div className="mt-6 flex justify-end">
            <Space>
              <Button icon={<Download size={16} />}>Download Contract</Button>
              <Button type="primary" icon={<Edit size={16} />}>
                Edit Contract
              </Button>
            </Space>
          </div>
        </>
      );
    } else if (selectedRecord.type === "policy") {
      return (
        <>
          <Descriptions
            title="Policy Details"
            bordered
            column={1}
            size="small"
            className="mb-6"
          >
            <Descriptions.Item label="Policy Title">
              {selectedRecord.title}
            </Descriptions.Item>
            <Descriptions.Item label="Policy ID">
              {selectedRecord.policyId}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {selectedRecord.category}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedRecord.status === "Active"
                    ? "green"
                    : selectedRecord.status === "Under Review"
                      ? "blue"
                      : selectedRecord.status === "Recently Updated"
                        ? "cyan"
                        : "gray"
                }
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Effective Date">
              {selectedRecord.effectiveDate}
            </Descriptions.Item>
            {selectedRecord.revisionDate && (
              <Descriptions.Item label="Last Revision Date">
                {selectedRecord.revisionDate}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Next Review Date">
              {selectedRecord.nextReviewDate}
            </Descriptions.Item>
            <Descriptions.Item label="Approved By">
              {selectedRecord.approvedBy}
            </Descriptions.Item>
            <Descriptions.Item label="Approval Date">
              {selectedRecord.approvalDate}
            </Descriptions.Item>
            <Descriptions.Item label="Acknowledgment Required">
              {selectedRecord.acknowledgmentRequired ? "Yes" : "No"}
            </Descriptions.Item>
          </Descriptions>

          {selectedRecord.acknowledgmentRequired && (
            <>
              <Divider orientation="left">Acknowledgment Status</Divider>
              <Card className="mb-4">
                <Progress
                  percent={Math.round(
                    (selectedRecord.acknowledgmentStats.acknowledged /
                      selectedRecord.acknowledgmentStats.total) *
                      100
                  )}
                  status="active"
                />
                <div className="flex justify-between mt-2">
                  <div>
                    <span className="text-green-500 font-medium">
                      {selectedRecord.acknowledgmentStats.acknowledged}
                    </span>{" "}
                    acknowledged
                  </div>
                  <div>
                    <span className="text-orange-500 font-medium">
                      {selectedRecord.acknowledgmentStats.pending}
                    </span>{" "}
                    pending
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      {selectedRecord.acknowledgmentStats.total}
                    </span>{" "}
                    total
                  </div>
                </div>
              </Card>
            </>
          )}

          <Divider orientation="left">Policy Documents</Divider>
          {selectedRecord.documents && selectedRecord.documents.length > 0 ? (
            <List
              size="small"
              bordered
              dataSource={selectedRecord.documents}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<Download size={14} />}>
                      Download
                    </Button>,
                  ]}
                >
                  <FileText size={16} className="mr-2" />
                  {item}
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No documents available" />
          )}

          <Divider orientation="left">Description</Divider>
          <Paragraph className="mb-4">
            {selectedRecord.description ||
              "No description available for this policy."}
          </Paragraph>

          <div className="mt-6 flex justify-end">
            <Space>
              <Button icon={<Download size={16} />}>Download Policy</Button>
              {selectedRecord.acknowledgmentRequired && (
                <Button icon={<Mail size={16} />}>Send Reminder</Button>
              )}
              <Button type="primary" icon={<Edit size={16} />}>
                Edit Policy
              </Button>
            </Space>
          </div>
        </>
      );
    }

    return <Empty description="No details available" />;
  };

  // Upload props configuration
  const uploadProps = {
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // Render modals for different types
  const renderModal = () => {
    switch (modalType) {
      case "contract":
        return (
          <Modal
            title="Employment Contract"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={800}
            footer={[
              <Button key="back" onClick={handleModalCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleModalOk}>
                Save
              </Button>,
            ]}
          >
            <Form
              form={contractForm}
              layout="vertical"
              initialValues={{
                contractType: "Fixed Term",
                status: "Active",
                startDate: moment(),
                endDate: moment().add(1, "year"),
                renewalReminder: true,
              }}
            >
              <Form.Item name="key" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="employeeName"
                    label="Employee Name"
                    rules={[
                      { required: true, message: "Please enter employee name" },
                    ]}
                  >
                    <Input placeholder="e.g. Dr. Joseph Musoke" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                    rules={[
                      { required: true, message: "Please enter employee ID" },
                    ]}
                  >
                    <Input placeholder="e.g. NKU-STAFF-1245" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="position"
                    label="Position"
                    rules={[
                      { required: true, message: "Please enter position" },
                    ]}
                  >
                    <Input placeholder="e.g. Senior Lecturer" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="department"
                    label="Department"
                    rules={[
                      { required: true, message: "Please select department" },
                    ]}
                  >
                    <Select placeholder="Select department">
                      <Option value="Faculty of Science">
                        Faculty of Science
                      </Option>
                      <Option value="Faculty of Business">
                        Faculty of Business
                      </Option>
                      <Option value="Faculty of Arts">Faculty of Arts</Option>
                      <Option value="Faculty of Education">
                        Faculty of Education
                      </Option>
                      <Option value="Registry">Registry</Option>
                      <Option value="Administration">Administration</Option>
                      <Option value="Finance">Finance</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="contractType"
                    label="Contract Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select contract type",
                      },
                    ]}
                  >
                    <Select placeholder="Select contract type">
                      <Option value="Permanent">Permanent</Option>
                      <Option value="Fixed Term">Fixed Term</Option>
                      <Option value="Visiting">Visiting</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select status" },
                    ]}
                  >
                    <Select placeholder="Select status">
                      <Option value="Active">Active</Option>
                      <Option value="Expiring Soon">Expiring Soon</Option>
                      <Option value="Expired">Expired</Option>
                      <Option value="Terminated">Terminated</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="salary"
                    label="Salary (UGX)"
                    rules={[{ required: true, message: "Please enter salary" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder="e.g. 4,500,000"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[
                      { required: true, message: "Please select start date" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="endDate"
                    label="End Date"
                    dependencies={["contractType"]}
                    rules={[
                      ({ getFieldValue }) => ({
                        required: getFieldValue("contractType") !== "Permanent",
                        message: "Please select end date",
                      }),
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      disabled={
                        contractForm.getFieldValue("contractType") ===
                        "Permanent"
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="signingDate"
                    label="Signing Date"
                    rules={[
                      { required: true, message: "Please select signing date" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="signedBy"
                    label="Signed By"
                    rules={[
                      { required: true, message: "Please enter signer name" },
                    ]}
                  >
                    <Input placeholder="e.g. Prof. Frederick Ssempala" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="renewalReminder"
                    label="Renewal Reminder"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea
                  rows={4}
                  placeholder="Any additional notes about this contract"
                />
              </Form.Item>
              <Form.Item name="documents" label="Upload Contract Documents">
                <Upload {...uploadProps} multiple>
                  <Button icon={<UploadIcon size={16} />}>
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        );
      case "policy":
        return (
          <Modal
            title="University Policy"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={800}
            footer={[
              <Button key="back" onClick={handleModalCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleModalOk}>
                Save
              </Button>,
            ]}
          >
            <Form
              form={policyForm}
              layout="vertical"
              initialValues={{
                category: "Human Resources",
                status: "Active",
                effectiveDate: moment().format("YYYY-MM-DD"),
                nextReviewDate: moment().add(2, "year").format("YYYY-MM-DD"),
                approvalDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
                approvedBy: "University Council",
                acknowledgmentRequired: true,
              }}
            >
              <Form.Item name="key" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="title"
                    label="Policy Title"
                    rules={[
                      { required: true, message: "Please enter policy title" },
                    ]}
                  >
                    <Input placeholder="e.g. Employee Code of Conduct" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                      { required: true, message: "Please select category" },
                    ]}
                  >
                    <Select placeholder="Select category">
                      <Option value="Human Resources">Human Resources</Option>
                      <Option value="Academic">Academic</Option>
                      <Option value="IT">IT</Option>
                      <Option value="Financial">Financial</Option>
                      <Option value="Administrative">Administrative</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="effectiveDate"
                    label="Effective Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select effective date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="revisionDate" label="Last Revision Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="nextReviewDate"
                    label="Next Review Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select next review date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select status" },
                    ]}
                  >
                    <Select placeholder="Select status">
                      <Option value="Active">Active</Option>
                      <Option value="Under Review">Under Review</Option>
                      <Option value="Recently Updated">Recently Updated</Option>
                      <Option value="Archived">Archived</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="approvedBy"
                    label="Approved By"
                    rules={[
                      {
                        required: true,
                        message: "Please enter approving authority",
                      },
                    ]}
                  >
                    <Input placeholder="e.g. University Council" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="approvalDate"
                    label="Approval Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select approval date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="acknowledgmentRequired"
                    label="Acknowledgment Required"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter policy description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Describe the purpose and scope of this policy"
                />
              </Form.Item>
              <Form.Item name="documents" label="Upload Policy Documents">
                <Upload {...uploadProps} multiple>
                  <Button icon={<UploadIcon size={16} />}>
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <div className="contracts-policies">
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <FileCheck size={16} className="mr-1 text-blue-500" />
                    <span>Active Contracts</span>
                  </div>
                }
                value={contracts.filter((c) => c.status === "Active").length}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {contracts.filter((c) => c.status === "Expiring Soon").length}{" "}
                expiring soon
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-1 text-green-500" />
                    <span>Active Policies</span>
                  </div>
                }
                value={
                  policies.filter(
                    (p) =>
                      p.status === "Active" || p.status === "Recently Updated"
                  ).length
                }
                valueStyle={{ color: "#52c41a" }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {policies.filter((p) => p.status === "Under Review").length}{" "}
                under review
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <GraduationCap size={16} className="mr-1 text-purple-500" />
                    <span>Academic Staff</span>
                  </div>
                }
                value={
                  contracts.filter(
                    (c) =>
                      (c.department.includes("Faculty") &&
                        c.position.includes("Lecturer")) ||
                      c.position.includes("Professor")
                  ).length
                }
                valueStyle={{ color: "#722ed1" }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {contracts.filter((c) => c.contractType === "Visiting").length}{" "}
                visiting faculty
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-orange-500" />
                    <span>Policy Compliance</span>
                  </div>
                }
                value={getAcknowledgmentPercentage()}
                valueStyle={{ color: "#fa8c16" }}
                suffix="%"
              />
              <div className="mt-2">
                <Progress
                  percent={getAcknowledgmentPercentage()}
                  size="small"
                  status="active"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Card className="mb-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <FileText size={16} /> Employment Contracts
              </span>
            }
            key="contracts"
          >
            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>Staff Contracts</Title>
              <Space>
                <Input
                  placeholder="Search contracts..."
                  prefix={<Search size={16} />}
                  style={{ width: 220 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                  placeholder="Filter by Status"
                  style={{ width: 150 }}
                  allowClear
                  value={filterStatus}
                  onChange={setFilterStatus}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Expiring Soon">Expiring Soon</Option>
                  <Option value="Expired">Expired</Option>
                  <Option value="Terminated">Terminated</Option>
                </Select>

                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showEditModal("contract")}
                >
                  Add Contract
                </Button>
              </Space>
            </div>

            <Table
              size="small"
              columns={contractColumns}
              dataSource={contracts}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BookOpen size={16} /> University Policies
              </span>
            }
            key="policies"
          >
            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>Institutional Policies</Title>
              <Space>
                <Input
                  placeholder="Search policies..."
                  prefix={<Search size={16} />}
                  style={{ width: 220 }}
                />
                <Select
                  placeholder="Filter by Category"
                  style={{ width: 170 }}
                  allowClear
                >
                  <Option value="Human Resources">Human Resources</Option>
                  <Option value="Academic">Academic</Option>
                  <Option value="IT">IT</Option>
                  <Option value="Financial">Financial</Option>
                  <Option value="Administrative">Administrative</Option>
                </Select>
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showEditModal("policy")}
                >
                  Add Policy
                </Button>
              </Space>
            </div>

            <Table
              size="small"
              columns={policyColumns}
              dataSource={policies}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Drawer
        title={
          <div className="flex items-center">
            {selectedRecord?.type === "contract" ? (
              <FileText size={20} className="mr-2" />
            ) : (
              <BookOpen size={20} className="mr-2" />
            )}
            <span>Record Details</span>
          </div>
        }
        width={600}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {renderDrawerContent()}
      </Drawer>

      {renderModal()}
    </div>
  );

  // Helper function to calculate policy acknowledgment percentage
  function getAcknowledgmentPercentage() {
    const policiesRequiringAcknowledgment = policies.filter(
      (p) => p.acknowledgmentRequired
    );
    if (policiesRequiringAcknowledgment.length === 0) return 100;

    let totalAcknowledged = 0;
    let totalRequired = 0;

    policiesRequiringAcknowledgment.forEach((policy) => {
      totalAcknowledged += policy.acknowledgmentStats.acknowledged;
      totalRequired += policy.acknowledgmentStats.total;
    });

    return Math.round((totalAcknowledged / totalRequired) * 100);
  }
}
