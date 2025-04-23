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
  Statistic,
  Alert,
  Progress,
  Upload,
  message,
  Drawer,
  List,
  Timeline,
  Segmented,
  Calendar,
  Descriptions,
  Popover,
  Checkbox,
  Empty,
  Divider,
  Dropdown,
  Menu,
  InputNumber,
  Radio,
} from "antd";
import {
  AlertCircle,
  Search,
  Download,
  Upload as UploadIcon,
  PlusCircle,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  RefreshCw,
  Clock,
  Users,
  Copy,
  MoreHorizontal,
  Scale as Scales,
  ClipboardList,
  Book as BookIcon,
  Radio as RadioIcon,
} from "lucide-react";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Shared context for notifications and alerts
const getGlobalNotifications = () => {
  return [
    {
      id: 1,
      title: "Ministry of Labor Update",
      description:
        "New minimum wage guidelines released for educational institutions",
      date: "2023-12-01",
      type: "law_update",
      priority: "high",
      read: false,
    },
    {
      id: 2,
      title: "Occupational Safety Training Due",
      description:
        "15 employees need to complete mandatory safety training this month",
      date: "2023-12-10",
      type: "compliance_training",
      priority: "medium",
      read: true,
    },
    {
      id: 3,
      title: "Employment Act Amendment",
      description:
        "Recent amendments to Uganda's Employment Act affecting academic institutions",
      date: "2023-11-28",
      type: "law_update",
      priority: "high",
      read: false,
    },
    {
      id: 4,
      title: "NSSF Compliance Report Due",
      description:
        "Quarterly NSSF compliance report submission deadline approaching",
      date: "2023-12-15",
      type: "report_due",
      priority: "high",
      read: false,
    },
    {
      id: 5,
      title: "Labor Inspection Scheduled",
      description:
        "Ministry of Gender, Labor & Social Development inspection scheduled",
      date: "2024-01-10",
      type: "inspection",
      priority: "high",
      read: true,
    },
  ];
};

export default function LaborLawCompliance() {
  const [lawUpdateForm] = Form.useForm();
  const [complianceTrainingForm] = Form.useForm();
  const [complianceReportForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activeTab, setActiveTab] = useState("law_updates");
  const [viewMode, setViewMode] = useState("table");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [globalNotifications, setGlobalNotifications] = useState(
    getGlobalNotifications()
  );
  const [notifications, setNotifications] = useState([]);
  const [trainingStats, setTrainingStats] = useState({
    completed: 85,
    pending: 15,
    upcoming: 5,
    overdue: 3,
  });

  // Sample data for labor law updates
  const lawUpdates = [
    {
      key: "1",
      title: "Employment Act Amendment 2023",
      authority: "Uganda Parliament",
      publishDate: "2023-11-15",
      effectiveDate: "2024-01-01",
      category: "Employment Law",
      status: "Review Needed",
      description:
        "Amendments affecting working hours, leave entitlements, and termination procedures for academic institutions.",
      actionRequired: "Update staff handbook and employment contracts",
      university_impact: "High",
      document_url: "https://example.com/employment_act_2023.pdf",
    },
    {
      key: "2",
      title: "NSSF Contribution Rate Change",
      authority: "National Social Security Fund",
      publishDate: "2023-10-10",
      effectiveDate: "2024-01-01",
      category: "Social Security",
      status: "Compliant",
      description:
        "Increase in employer contribution rate from 10% to 11% for all employees.",
      actionRequired: "Update payroll systems and inform employees",
      university_impact: "Medium",
      document_url: "https://example.com/nssf_update_2023.pdf",
    },
    {
      key: "3",
      title: "Occupational Safety and Health Regulations Update",
      authority: "Ministry of Gender, Labour & Social Development",
      publishDate: "2023-09-05",
      effectiveDate: "2023-11-01",
      category: "Workplace Safety",
      status: "Action Required",
      description:
        "New requirements for safety protocols in educational laboratories and workshop environments.",
      actionRequired: "Conduct safety audit and train laboratory staff",
      university_impact: "High",
      document_url: "https://example.com/osh_regulations_2023.pdf",
    },
    {
      key: "4",
      title: "Minimum Wage Review for Education Sector",
      authority: "Ministry of Education and Sports",
      publishDate: "2023-08-20",
      effectiveDate: "2024-02-01",
      category: "Compensation",
      status: "Review Needed",
      description:
        "New guidelines for minimum wage adjustments specific to higher education teaching and non-teaching staff.",
      actionRequired: "Review salary structures across all departments",
      university_impact: "High",
      document_url: "https://example.com/min_wage_education_2023.pdf",
    },
    {
      key: "5",
      title: "Data Protection and Privacy Act Implementation Guidelines",
      authority: "National Information Technology Authority",
      publishDate: "2023-07-12",
      effectiveDate: "2023-10-01",
      category: "Data Privacy",
      status: "Compliant",
      description:
        "Implementation guidelines for the Data Protection and Privacy Act affecting storage and processing of employee and student data.",
      actionRequired: "Update privacy policies and secure data storage systems",
      university_impact: "Medium",
      document_url: "https://example.com/data_privacy_guidelines_2023.pdf",
    },
  ];

  // Sample data for compliance trainings
  const complianceTrainings = [
    {
      key: "1",
      title: "Uganda Labor Law Essentials",
      department: "All Staff",
      targetAudience: "HR, Department Heads",
      scheduledDate: "2023-12-15",
      duration: "4 hours",
      trainer: "Esther Namuganza (External)",
      status: "Scheduled",
      completionRate: 0,
      description:
        "Essential training on Uganda labor laws and their application in the university setting.",
      location: "Main Campus, Conference Room A",
    },
    {
      key: "2",
      title: "Workplace Harassment Prevention",
      department: "All Staff",
      targetAudience: "All Employees",
      scheduledDate: "2023-12-10",
      duration: "2 hours",
      trainer: "Dr. Moses Okello",
      status: "In Progress",
      completionRate: 45,
      description:
        "Mandatory training on recognizing and preventing workplace harassment.",
      location: "Online (Zoom)",
    },
    {
      key: "3",
      title: "NSSF and PAYE Compliance for HR",
      department: "Human Resources",
      targetAudience: "HR Staff, Finance",
      scheduledDate: "2023-11-20",
      duration: "3 hours",
      trainer: "Robert Ssentongo (NSSF Representative)",
      status: "Completed",
      completionRate: 100,
      description:
        "Detailed training on NSSF and PAYE regulations and compliance requirements.",
      location: "Admin Block, HR Training Room",
    },
    {
      key: "4",
      title: "Laboratory Safety Regulations",
      department: "Science Faculty",
      targetAudience: "Laboratory Staff, Science Lecturers",
      scheduledDate: "2023-12-05",
      duration: "4 hours",
      trainer: "Dr. Sarah Nakimuli",
      status: "Scheduled",
      completionRate: 0,
      description:
        "Training on updated laboratory safety regulations and compliance requirements.",
      location: "Science Block, Lab 3",
    },
    {
      key: "5",
      title: "Data Protection and Privacy for Administrative Staff",
      department: "All Administrative Departments",
      targetAudience: "Administrative Staff",
      scheduledDate: "2023-11-15",
      duration: "2 hours",
      trainer: "Patricia Kyambadde",
      status: "Completed",
      completionRate: 92,
      description:
        "Training on handling and protecting sensitive employee and student data.",
      location: "Online (Recorded)",
    },
  ];

  // Sample data for compliance reports
  const complianceReports = [
    {
      key: "1",
      title: "Annual Labor Compliance Audit Report",
      reportType: "Annual Audit",
      dueDate: "2023-12-31",
      submissionDate: null,
      department: "Human Resources",
      submittedBy: null,
      status: "Pending",
      recipients: "University Council, Ministry of Education",
      description:
        "Comprehensive audit of labor law compliance across all university departments.",
      attachments: [],
    },
    {
      key: "2",
      title: "Q4 NSSF Contribution Report",
      reportType: "Quarterly Statutory",
      dueDate: "2024-01-15",
      submissionDate: null,
      department: "Finance",
      submittedBy: null,
      status: "Preparing",
      recipients: "NSSF Authority",
      description:
        "Quarterly report of all NSSF contributions for university employees.",
      attachments: [],
    },
    {
      key: "3",
      title: "Annual PAYE Tax Compliance Report",
      reportType: "Annual Statutory",
      dueDate: "2024-01-31",
      submissionDate: null,
      department: "Finance",
      submittedBy: null,
      status: "Not Started",
      recipients: "Uganda Revenue Authority",
      description: "Annual summary of PAYE tax compliance and remittances.",
      attachments: [],
    },
    {
      key: "4",
      title: "Q3 NSSF Contribution Report",
      reportType: "Quarterly Statutory",
      dueDate: "2023-10-15",
      submissionDate: "2023-10-12",
      department: "Finance",
      submittedBy: "Jane Akello",
      status: "Submitted",
      recipients: "NSSF Authority",
      description:
        "Quarterly report of all NSSF contributions for university employees.",
      attachments: ["Q3_NSSF_Report.pdf"],
    },
    {
      key: "5",
      title: "Employment Equity and Diversity Report",
      reportType: "Annual",
      dueDate: "2023-11-30",
      submissionDate: "2023-11-28",
      department: "Human Resources",
      submittedBy: "Dr. Thomas Ssekandi",
      status: "Submitted",
      recipients: "University Council, Equal Opportunities Commission",
      description:
        "Annual report on university's compliance with employment equity and diversity requirements.",
      attachments: ["Diversity_Report_2023.pdf"],
    },
  ];

  // Function to handle notifications
  useEffect(() => {
    // Filter out relevant notifications for this component
    const relevantTypes = [
      "law_update",
      "compliance_training",
      "report_due",
      "inspection",
    ];
    const filteredNotifications = globalNotifications.filter((notification) =>
      relevantTypes.includes(notification.type)
    );
    setNotifications(filteredNotifications);
  }, [globalNotifications]);

  // Columns for law updates table
  const lawUpdateColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.authority}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Employment Law", value: "Employment Law" },
        { text: "Compensation", value: "Compensation" },
        { text: "Workplace Safety", value: "Workplace Safety" },
        { text: "Social Security", value: "Social Security" },
        { text: "Data Privacy", value: "Data Privacy" },
      ],
      onFilter: (value, record) => record.category === value,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>
            <Text type="secondary">Published: </Text>
            {record.publishDate}
          </div>
          <div>
            <Text type="secondary">Effective: </Text>
            {record.effectiveDate}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate),
    },
    {
      title: "Impact",
      dataIndex: "university_impact",
      key: "university_impact",
      filters: [
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.university_impact === value,
      render: (text) => {
        let color = "green";
        if (text === "High") color = "red";
        else if (text === "Medium") color = "orange";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Compliant", value: "Compliant" },
        { text: "Review Needed", value: "Review Needed" },
        { text: "Action Required", value: "Action Required" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "green";
        let icon = <CheckCircle size={10} />;

        if (status === "Review Needed") {
          color = "orange";
          icon = <AlertCircle size={10} />;
        } else if (status === "Action Required") {
          color = "red";
          icon = <AlertTriangle size={10} />;
        }

        return (
          <Tag
            icon={icon}
            color={color}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0px 2px",
              fontSize: "10px",
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
      title: "Action Required",
      dataIndex: "actionRequired",
      key: "actionRequired",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showRecordDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showEditModal("law_update", record)}
            />
          </Tooltip>
          <Dropdown overlay={renderActionMenu(record)} trigger={["click"]}>
            <Button type="text" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Columns for compliance trainings table
  const trainingColumns = [
    {
      title: "Training",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            Target: {record.targetAudience}
          </div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "All Staff", value: "All Staff" },
        { text: "Human Resources", value: "Human Resources" },
        { text: "Finance", value: "Finance" },
        { text: "Science Faculty", value: "Science Faculty" },
        {
          text: "All Administrative Departments",
          value: "All Administrative Departments",
        },
      ],
      onFilter: (value, record) => record.department === value,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => (
        <div>
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-1 text-gray-500" />
            {record.scheduledDate}
          </div>
          <div className="flex items-center mt-1">
            <Clock size={14} className="mr-1 text-gray-500" />
            {record.duration}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate),
    },
    {
      title: "Trainer",
      dataIndex: "trainer",
      key: "trainer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Scheduled", value: "Scheduled" },
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => {
        let color = "blue";
        let icon = <Clock size={10} />;

        if (status === "Completed") {
          color = "green";
          icon = <CheckCircle size={10} />;
        } else if (status === "In Progress") {
          color = "orange";
          icon = <RefreshCw size={10} />;
        }

        return (
          <div>
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

            {(status === "In Progress" || status === "Completed") && (
              <Progress
                percent={record.completionRate}
                size="small"
                status={record.completionRate === 100 ? "success" : "active"}
                className="mt-1"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showRecordDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showEditModal("compliance_training", record)}
            />
          </Tooltip>
          <Dropdown
            overlay={renderTrainingActionMenu(record)}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Columns for compliance reports table
  const reportColumns = [
    {
      title: "Report Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.reportType}</div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Human Resources", value: "Human Resources" },
        { text: "Finance", value: "Finance" },
      ],
      onFilter: (value, record) => record.department === value,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>
            <Text type="secondary">Due: </Text>
            {record.dueDate}
          </div>
          {record.submissionDate && (
            <div>
              <Text type="secondary">Submitted: </Text>
              {record.submissionDate}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Not Started", value: "Not Started" },
        { text: "Preparing", value: "Preparing" },
        { text: "Pending", value: "Pending" },
        { text: "Submitted", value: "Submitted" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "blue";
        let icon = <Clock size={10} />;

        if (status === "Submitted") {
          color = "green";
          icon = <CheckCircle size={10} />;
        } else if (status === "Preparing") {
          color = "orange";
          icon = <RefreshCw size={10} />;
        } else if (status === "Not Started") {
          color = "red";
          icon = <AlertCircle size={10} />;
        }

        return (
          <Tag
            icon={icon}
            color={color}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0px 2px",
              fontSize: "10px",
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
      title: "Submitted By",
      dataIndex: "submittedBy",
      key: "submittedBy",
      render: (text) => text || "-",
    },
    {
      title: "Recipients",
      dataIndex: "recipients",
      key: "recipients",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FileText size={16} />}
              onClick={() => showRecordDetails(record)}
            />
          </Tooltip>

          {record.status !== "Submitted" && (
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<Edit size={16} />}
                onClick={() => showEditModal("compliance_report", record)}
              />
            </Tooltip>
          )}
          <Dropdown
            overlay={renderReportActionMenu(record)}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreHorizontal size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Functions to show record details
  const showRecordDetails = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  // Function to show edit modal
  const showEditModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);

    if (record) {
      switch (type) {
        case "law_update":
          lawUpdateForm.setFieldsValue({
            ...record,
            publishDate: moment(record.publishDate),
            effectiveDate: moment(record.effectiveDate),
          });
          break;
        case "compliance_training":
          complianceTrainingForm.setFieldsValue({
            ...record,
            scheduledDate: moment(record.scheduledDate),
          });
          break;
        case "compliance_report":
          complianceReportForm.setFieldsValue({
            ...record,
            dueDate: moment(record.dueDate),
            submissionDate: record.submissionDate
              ? moment(record.submissionDate)
              : null,
          });
          break;
        default:
          break;
      }
    } else {
      // Clear form for new record
      switch (type) {
        case "law_update":
          lawUpdateForm.resetFields();
          break;
        case "compliance_training":
          complianceTrainingForm.resetFields();
          break;
        case "compliance_report":
          complianceReportForm.resetFields();
          break;
        default:
          break;
      }
    }
  };

  // Handle modal OK
  const handleModalOk = () => {
    setIsModalVisible(false);
    message.success("Record saved successfully");
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Function to render the action menu for law updates
  const renderActionMenu = (record) => (
    <Menu>
      <Menu.Item key="1" icon={<Download size={10} />}>
        Download Document
      </Menu.Item>
      <Menu.Item key="2" icon={<Copy size={10} />}>
        Copy Link
      </Menu.Item>
      <Menu.Item key="3" icon={<Users size={10} />}>
        Assign Review Task
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" icon={<Trash2 size={10} />} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  // Function to render the action menu for trainings
  const renderTrainingActionMenu = (record) => (
    <Menu>
      <Menu.Item key="1" icon={<Users size={14} />}>
        Manage Attendees
      </Menu.Item>
      <Menu.Item key="2" icon={<FileText size={14} />}>
        Generate Attendance Sheet
      </Menu.Item>
      <Menu.Item key="3" icon={<CheckCircle size={14} />}>
        Mark as Completed
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" icon={<Trash2 size={14} />} danger>
        Cancel Training
      </Menu.Item>
    </Menu>
  );

  // Function to render the action menu for reports
  const renderReportActionMenu = (record) => (
    <Menu>
      {record.status !== "Submitted" ? (
        <>
          <Menu.Item key="1" icon={<CheckCircle size={14} />}>
            Mark as Submitted
          </Menu.Item>
          <Menu.Item key="2" icon={<RefreshCw size={14} />}>
            Update Status
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="1" icon={<Download size={14} />}>
          Download Submission
        </Menu.Item>
      )}
      <Menu.Item key="3" icon={<Copy size={14} />}>
        Duplicate Report
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" icon={<Trash2 size={14} />} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  const renderDrawerContent = () => {
    if (!selectedRecord) return null;

    if (selectedRecord.authority) {
      // This is a law update record
      return (
        <>
          <Descriptions
            title="Law Update Details"
            bordered
            column={1}
            size="small"
            className="mb-6"
          >
            <Descriptions.Item label="Title">
              {selectedRecord.title}
            </Descriptions.Item>
            <Descriptions.Item label="Authority">
              {selectedRecord.authority}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {selectedRecord.category}
            </Descriptions.Item>
            <Descriptions.Item label="University Impact">
              <Tag
                color={
                  selectedRecord.university_impact === "High"
                    ? "red"
                    : selectedRecord.university_impact === "Medium"
                      ? "orange"
                      : "green"
                }
              >
                {selectedRecord.university_impact}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedRecord.status === "Compliant"
                    ? "green"
                    : selectedRecord.status === "Review Needed"
                      ? "orange"
                      : "red"
                }
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Publish Date">
              {selectedRecord.publishDate}
            </Descriptions.Item>
            <Descriptions.Item label="Effective Date">
              {selectedRecord.effectiveDate}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Details</Divider>
          <Paragraph className="mb-4">{selectedRecord.description}</Paragraph>

          <Divider orientation="left">Required Actions</Divider>
          <Alert
            message="Action Required"
            description={selectedRecord.actionRequired}
            type={
              selectedRecord.status === "Action Required"
                ? "error"
                : selectedRecord.status === "Review Needed"
                  ? "warning"
                  : "info"
            }
            showIcon
            className="mb-6"
          />

          <Divider orientation="left">Document</Divider>
          <Button
            type="primary"
            icon={<Download size={16} />}
            href={selectedRecord.document_url}
            target="_blank"
          >
            Download Official Document
          </Button>
        </>
      );
    } else if (selectedRecord.trainer) {
      // This is a training record
      return (
        <>
          <Descriptions
            title="Compliance Training Details"
            bordered
            column={1}
            size="small"
            className="mb-6"
          >
            <Descriptions.Item label="Title">
              {selectedRecord.title}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {selectedRecord.department}
            </Descriptions.Item>
            <Descriptions.Item label="Target Audience">
              {selectedRecord.targetAudience}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedRecord.status === "Completed"
                    ? "green"
                    : selectedRecord.status === "In Progress"
                      ? "orange"
                      : "blue"
                }
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Scheduled Date">
              {selectedRecord.scheduledDate}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {selectedRecord.duration}
            </Descriptions.Item>
            <Descriptions.Item label="Trainer">
              {selectedRecord.trainer}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedRecord.location}
            </Descriptions.Item>
          </Descriptions>

          {(selectedRecord.status === "In Progress" ||
            selectedRecord.status === "Completed") && (
            <>
              <Divider orientation="left">Completion Status</Divider>
              <Progress
                percent={selectedRecord.completionRate}
                status={
                  selectedRecord.completionRate === 100 ? "success" : "active"
                }
              />
              <div className="mt-2 text-sm text-gray-500">
                {selectedRecord.completionRate}% of target audience has
                completed this training
              </div>
            </>
          )}

          <Divider orientation="left">Description</Divider>
          <Paragraph className="mb-4">{selectedRecord.description}</Paragraph>

          <Divider orientation="left">Attendees</Divider>
          <Empty description="No attendance data available yet" />

          <div className="mt-6 flex justify-end">
            <Space>
              <Button icon={<FileText size={16} />}>Attendance Report</Button>
              <Button type="primary" icon={<Users size={16} />}>
                Manage Attendees
              </Button>
            </Space>
          </div>
        </>
      );
    } else if (selectedRecord.reportType) {
      // This is a report record
      return (
        <>
          <Descriptions
            title="Compliance Report Details"
            bordered
            column={1}
            size="small"
            className="mb-6"
          >
            <Descriptions.Item label="Title">
              {selectedRecord.title}
            </Descriptions.Item>
            <Descriptions.Item label="Report Type">
              {selectedRecord.reportType}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {selectedRecord.department}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedRecord.status === "Submitted"
                    ? "green"
                    : selectedRecord.status === "Preparing"
                      ? "orange"
                      : selectedRecord.status === "Pending"
                        ? "blue"
                        : "red"
                }
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {selectedRecord.dueDate}
            </Descriptions.Item>
            {selectedRecord.submissionDate && (
              <Descriptions.Item label="Submission Date">
                {selectedRecord.submissionDate}
              </Descriptions.Item>
            )}
            {selectedRecord.submittedBy && (
              <Descriptions.Item label="Submitted By">
                {selectedRecord.submittedBy}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Recipients">
              {selectedRecord.recipients}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Description</Divider>
          <Paragraph className="mb-4">{selectedRecord.description}</Paragraph>

          {selectedRecord.status === "Submitted" ? (
            <>
              <Divider orientation="left">Attachments</Divider>
              {selectedRecord.attachments &&
              selectedRecord.attachments.length > 0 ? (
                <List
                  size="small"
                  bordered
                  dataSource={selectedRecord.attachments}
                  renderItem={(item) => (
                    <List.Item
                      key={item}
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
                <Empty description="No attachments available" />
              )}
            </>
          ) : (
            <>
              <Divider orientation="left">Timeline</Divider>
              <Timeline>
                <Timeline.Item color="blue">
                  Report created (
                  {moment().subtract(7, "days").format("YYYY-MM-DD")})
                </Timeline.Item>
                {selectedRecord.status === "Preparing" && (
                  <Timeline.Item color="orange">
                    Report preparation started (
                    {moment().subtract(3, "days").format("YYYY-MM-DD")})
                  </Timeline.Item>
                )}
                {selectedRecord.status === "Pending" && (
                  <>
                    <Timeline.Item color="orange">
                      Report preparation started (
                      {moment().subtract(5, "days").format("YYYY-MM-DD")})
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      Ready for review (
                      {moment().subtract(1, "days").format("YYYY-MM-DD")})
                    </Timeline.Item>
                  </>
                )}
                <Timeline.Item color="gray">
                  Due for submission ({selectedRecord.dueDate})
                </Timeline.Item>
              </Timeline>
            </>
          )}

          <div className="mt-6 flex justify-end">
            <Space>
              {selectedRecord.status !== "Submitted" ? (
                <>
                  <Button icon={<Edit size={16} />}>Edit Report</Button>
                  <Button type="primary" icon={<CheckCircle size={16} />}>
                    Mark as Submitted
                  </Button>
                </>
              ) : (
                <Button type="primary" icon={<FileText size={16} />}>
                  Download Report
                </Button>
              )}
            </Space>
          </div>
        </>
      );
    }

    return <Empty description="No details available" />;
  };

  // Render modals for different types
  const renderModal = () => {
    switch (modalType) {
      case "law_update":
        return (
          <Modal
            title="Labor Law Update"
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
              form={lawUpdateForm}
              layout="vertical"
              initialValues={{
                publishDate: moment(),
                category: "Employment Law",
                status: "Review Needed",
                university_impact: "Medium",
              }}
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                      { required: true, message: "Please enter the title" },
                    ]}
                  >
                    <Input placeholder="e.g. Employment Act Amendment 2023" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                      { required: true, message: "Please select a category" },
                    ]}
                  >
                    <Select>
                      <Option value="Employment Law">Employment Law</Option>
                      <Option value="Compensation">Compensation</Option>
                      <Option value="Workplace Safety">Workplace Safety</Option>
                      <Option value="Social Security">Social Security</Option>
                      <Option value="Data Privacy">Data Privacy</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="authority"
                    label="Issuing Authority"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the issuing authority",
                      },
                    ]}
                  >
                    <Input placeholder="e.g. Uganda Parliament" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="publishDate"
                    label="Publish Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select a publish date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="effectiveDate"
                    label="Effective Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select an effective date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Compliance Status"
                    rules={[
                      { required: true, message: "Please select a status" },
                    ]}
                  >
                    <Select>
                      <Option value="Compliant">Compliant</Option>
                      <Option value="Review Needed">Review Needed</Option>
                      <Option value="Action Required">Action Required</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="university_impact"
                    label="Impact on University"
                    rules={[
                      { required: true, message: "Please select impact level" },
                    ]}
                  >
                    <Select>
                      <Option value="High">High</Option>
                      <Option value="Medium">Medium</Option>
                      <Option value="Low">Low</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Describe the law update and its implications"
                />
              </Form.Item>
              <Form.Item
                name="actionRequired"
                label="Action Required"
                rules={[
                  {
                    required: true,
                    message: "Please specify required actions",
                  },
                ]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Specify what actions need to be taken"
                />
              </Form.Item>
              <Form.Item name="document_url" label="Document URL">
                <Input placeholder="Link to official document" />
              </Form.Item>
              <Form.Item name="attachment" label="Upload Document">
                <Upload {...uploadProps}>
                  <Button icon={<UploadIcon size={16} />}>
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        );
      case "compliance_training":
        return (
          <Modal
            title="Compliance Training"
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
              form={complianceTrainingForm}
              layout="vertical"
              initialValues={{
                scheduledDate: moment().add(7, "days"),
                department: "All Staff",
                status: "Scheduled",
                duration: "2 hours",
                completionRate: 0,
              }}
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="title"
                    label="Training Title"
                    rules={[
                      { required: true, message: "Please enter the title" },
                    ]}
                  >
                    <Input placeholder="e.g. Workplace Harassment Prevention" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="department"
                    label="Department"
                    rules={[
                      { required: true, message: "Please select a department" },
                    ]}
                  >
                    <Select>
                      <Option value="All Staff">All Staff</Option>
                      <Option value="Human Resources">Human Resources</Option>
                      <Option value="Finance">Finance</Option>
                      <Option value="Science Faculty">Science Faculty</Option>
                      <Option value="All Administrative Departments">
                        All Administrative Departments
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="targetAudience"
                    label="Target Audience"
                    rules={[
                      {
                        required: true,
                        message: "Please specify target audience",
                      },
                    ]}
                  >
                    <Input placeholder="e.g. HR Staff, Department Heads" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="scheduledDate"
                    label="Scheduled Date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="duration"
                    label="Duration"
                    rules={[
                      { required: true, message: "Please specify duration" },
                    ]}
                  >
                    <Input placeholder="e.g. 2 hours" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="trainer"
                    label="Trainer"
                    rules={[
                      { required: true, message: "Please specify the trainer" },
                    ]}
                  >
                    <Input placeholder="e.g. Dr. Moses Okello" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      {
                        required: true,
                        message: "Please specify the location",
                      },
                    ]}
                  >
                    <Input placeholder="e.g. Main Campus, Conference Room A" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select a status" },
                    ]}
                  >
                    <Select>
                      <Option value="Scheduled">Scheduled</Option>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="completionRate"
                    label="Completion Rate (%)"
                    rules={[
                      {
                        required: true,
                        message: "Please enter completion rate",
                      },
                    ]}
                  >
                    <InputNumber min={0} max={100} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Describe the training content and objectives"
                />
              </Form.Item>
              <Form.Item name="materials" label="Training Materials">
                <Upload {...uploadProps}>
                  <Button icon={<UploadIcon size={16} />}>
                    Upload Materials
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        );
      case "compliance_report":
        return (
          <Modal
            title="Compliance Report"
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
              form={complianceReportForm}
              layout="vertical"
              initialValues={{
                reportType: "Quarterly Statutory",
                department: "Human Resources",
                status: "Pending",
                dueDate: moment().add(30, "days"),
              }}
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="title"
                    label="Report Title"
                    rules={[
                      { required: true, message: "Please enter the title" },
                    ]}
                  >
                    <Input placeholder="e.g. Q4 NSSF Contribution Report" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="reportType"
                    label="Report Type"
                    rules={[
                      { required: true, message: "Please select a type" },
                    ]}
                  >
                    <Select>
                      <Option value="Annual Audit">Annual Audit</Option>
                      <Option value="Quarterly Statutory">
                        Quarterly Statutory
                      </Option>
                      <Option value="Annual Statutory">Annual Statutory</Option>
                      <Option value="Monthly">Monthly</Option>
                      <Option value="Annual">Annual</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="department"
                    label="Responsible Department"
                    rules={[
                      { required: true, message: "Please select a department" },
                    ]}
                  >
                    <Select>
                      <Option value="Human Resources">Human Resources</Option>
                      <Option value="Finance">Finance</Option>
                      <Option value="Legal">Legal</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="dueDate"
                    label="Due Date"
                    rules={[
                      { required: true, message: "Please select a due date" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select a status" },
                    ]}
                  >
                    <Select>
                      <Option value="Not Started">Not Started</Option>
                      <Option value="Preparing">Preparing</Option>
                      <Option value="Pending">Pending</Option>
                      <Option value="Submitted">Submitted</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="recipients"
                    label="Recipients"
                    rules={[
                      { required: true, message: "Please specify recipients" },
                    ]}
                  >
                    <Input placeholder="e.g. NSSF Authority, University Council" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="submittedBy" label="Submitted By">
                    <Input placeholder="Name of person submitting the report" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Describe the purpose and content of the report"
                />
              </Form.Item>
              <Form.Item name="attachments" label="Attachments">
                <Upload {...uploadProps}>
                  <Button icon={<UploadIcon size={16} />}>Upload Files</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        );
      default:
        return null;
    }
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

  return (
    <div className="labor-law-compliance">
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <Scales size={16} className="mr-1 text-blue-500" />
                    <span>Labor Law Updates</span>
                  </div>
                }
                value={lawUpdates.length}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {
                  lawUpdates.filter((item) => item.status === "Action Required")
                    .length
                }{" "}
                require immediate action
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <BookIcon size={16} className="mr-1 text-green-500" />
                    <span>Compliance Training</span>
                  </div>
                }
                value={`${trainingStats.completed}%`}
                valueStyle={{ color: "#52c41a" }}
              />
              <div className="mt-2">
                <Progress
                  percent={trainingStats.completed}
                  size="small"
                  status="active"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <ClipboardList size={16} className="mr-1 text-orange-500" />
                    <span>Compliance Reports</span>
                  </div>
                }
                value={complianceReports.length}
                valueStyle={{ color: "#fa8c16" }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {
                  complianceReports.filter((item) => !item.submissionDate)
                    .length
                }{" "}
                reports pending submission
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="h-full">
              <Statistic
                title={
                  <div className="flex items-center">
                    <AlertCircle size={16} className="mr-1 text-red-500" />
                    <span>Notifications</span>
                  </div>
                }
                value={notifications.filter((n) => !n.read).length}
                valueStyle={{ color: "#f5222d" }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {
                  notifications.filter((n) => n.priority === "high" && !n.read)
                    .length
                }{" "}
                high priority
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
                <Scales size={16} /> Labor Law Updates
              </span>
            }
            key="law_updates"
          >
            <div className="mb-4 flex justify-between items-center">
              <div>
                <Radio.Group
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  buttonStyle="solid"
                  size="small"
                >
                  <Tooltip title="View as List">
                    <Radio.Button value="table">
                      <FileText size={14} className="mr-1" />
                    </Radio.Button>
                  </Tooltip>

                  <Tooltip title="View as Calendar">
                    <Radio.Button value="calendar">
                      <CalendarIcon size={14} className="mr-1" />
                    </Radio.Button>
                  </Tooltip>
                </Radio.Group>
              </div>
              <Space>
                <Input
                  placeholder="Search updates..."
                  prefix={<Search size={16} />}
                  style={{ width: 220 }}
                />
                <Select
                  placeholder="Filter by Status"
                  style={{ width: 150 }}
                  allowClear
                >
                  <Option value="Compliant">Compliant</Option>
                  <Option value="Review Needed">Review Needed</Option>
                  <Option value="Action Required">Action Required</Option>
                </Select>
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showEditModal("law_update")}
                >
                  Add Update
                </Button>
              </Space>
            </div>

            {viewMode === "table" ? (
              <Table
                size="small"
                columns={lawUpdateColumns}
                dataSource={lawUpdates}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "bg-gray-50" : ""
                }
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <div className="calendar-view">
                <Calendar
                  dateCellRender={(date) => {
                    const formattedDate = date.format("YYYY-MM-DD");
                    const updates = lawUpdates.filter(
                      (u) =>
                        u.publishDate === formattedDate ||
                        u.effectiveDate === formattedDate
                    );

                    return (
                      <ul className="events">
                        {updates.map((update, index) => (
                          <li key={index}>
                            <Tag
                              color={
                                update.publishDate === formattedDate
                                  ? "blue"
                                  : "red"
                              }
                              style={{ margin: "2px 0" }}
                            >
                              {update.publishDate === formattedDate
                                ? "Published"
                                : "Effective"}
                            </Tag>
                            <span className="text-xs">{update.title}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />
              </div>
            )}
          </TabPane>
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BookIcon size={16} /> Compliance Training
              </span>
            }
            key="compliance_training"
          >
            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>Scheduled Trainings</Title>
              <Space>
                <Input
                  placeholder="Search trainings..."
                  prefix={<Search size={16} />}
                  style={{ width: 220 }}
                />
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showEditModal("compliance_training")}
                >
                  Schedule Training
                </Button>
              </Space>
            </div>

            <Table
              size="small"
              columns={trainingColumns}
              dataSource={complianceTrainings}
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
                <ClipboardList size={16} /> Compliance Reports
              </span>
            }
            key="compliance_reports"
          >
            <div className="mb-4 flex justify-between items-center">
              <Title level={5}>Required Reports</Title>
              <Space>
                <Input
                  placeholder="Search reports..."
                  prefix={<Search size={16} />}
                  style={{ width: 220 }}
                />
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => showEditModal("compliance_report")}
                >
                  Add Report
                </Button>
              </Space>
            </div>

            <Table
              size="small"
              columns={reportColumns}
              dataSource={complianceReports}
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
            <FileText size={20} className="mr-2" />
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
}
