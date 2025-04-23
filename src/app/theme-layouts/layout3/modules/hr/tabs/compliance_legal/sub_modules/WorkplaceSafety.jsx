"use client";

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
  DatePicker,
  Modal,
  Form,
  Tabs,
  Progress,
  Alert,
  List,
  message,
  Divider,
  Breadcrumb,
  Dropdown,
  Menu,
  Drawer,
  Empty,
  Spin,
  Descriptions,
} from "antd";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  Plus,
  Download,
  RefreshCw,
  Edit,
  Eye,
  Clock,
  FileText,
  Activity,
  TrendingUp,
  BarChart2,
  FileCheck,
  Trash2,
  Printer,
  HelpCircle,
  Settings,
  Info,
  MapPin,
  User,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data - would typically come from an API in a real application
const mockSafetyIncidents = [
  {
    id: "INC-001",
    incidentType: "Slip and Fall",
    location: "Main Campus - Block A Stairwell",
    dateReported: "2023-10-15",
    dateOccurred: "2023-10-14",
    reportedBy: "EMP-103",
    reportedByName: "Dr. Sarah Nambi",
    description:
      "Student slipped on wet floor near the entrance of Block A. Minor injuries sustained. Floor had been recently mopped but no warning sign was placed.",
    severity: "medium",
    status: "resolved",
    actionTaken:
      "Immediate first aid provided. Student taken to campus clinic for assessment. Warning signs have been placed and cleaning schedule adjusted.",
    preventiveMeasures:
      "Implemented new protocol for placing warning signs. Reviewing cleaning schedules to avoid high-traffic periods.",
    witnesses: "John Mukasa, Mary Akello",
    attachments: ["incident_photo_001.jpg", "medical_report_001.pdf"],
  },
  {
    id: "INC-002",
    incidentType: "Electrical Fault",
    location: "Science Laboratory - Room 105",
    dateReported: "2023-10-10",
    dateOccurred: "2023-10-10",
    reportedBy: "EMP-087",
    reportedByName: "Prof. Robert Kigozi",
    description:
      "Short circuit in the electrical panel caused sparking during a laboratory session. No injuries but equipment was damaged.",
    severity: "high",
    status: "investigating",
    actionTaken:
      "Power immediately shut off. Students evacuated. Maintenance team called to assess damage.",
    preventiveMeasures:
      "Electrical system inspection scheduled for all laboratories. Older equipment to be replaced.",
    witnesses: "Technical staff and 15 students",
    attachments: ["electrical_report.pdf"],
  },
  {
    id: "INC-003",
    incidentType: "Chemical Spill",
    location: "Chemistry Lab - Room 203",
    dateReported: "2023-09-28",
    dateOccurred: "2023-09-28",
    reportedBy: "EMP-054",
    reportedByName: "Dr. Elizabeth Namazzi",
    description:
      "Small amount of hydrochloric acid spilled during an experiment. Contained quickly with no injuries.",
    severity: "medium",
    status: "resolved",
    actionTaken:
      "Spill contained using emergency spill kit. Area neutralized and cleaned according to protocol.",
    preventiveMeasures:
      "Refresher training on chemical handling scheduled for all lab assistants and students.",
    witnesses: "Lab assistant and 8 students",
    attachments: ["spill_report.pdf", "cleanup_verification.pdf"],
  },
  {
    id: "INC-004",
    incidentType: "Fire",
    location: "Student Cafeteria - Kitchen Area",
    dateReported: "2023-09-15",
    dateOccurred: "2023-09-15",
    reportedBy: "EMP-112",
    reportedByName: "Mr. Joseph Ssemanda",
    description:
      "Small grease fire in kitchen. Extinguished quickly with fire extinguisher. No injuries or significant damage.",
    severity: "high",
    status: "closed",
    actionTaken:
      "Fire extinguished immediately. Kitchen evacuated briefly. Equipment checked for damage.",
    preventiveMeasures:
      "Additional fire safety training for kitchen staff. Inspection of all cooking equipment.",
    witnesses: "Kitchen staff and cafeteria workers",
    attachments: ["fire_incident_report.pdf", "equipment_inspection.pdf"],
  },
  {
    id: "INC-005",
    incidentType: "Equipment Failure",
    location: "Engineering Workshop - Room 105",
    dateReported: "2023-10-05",
    dateOccurred: "2023-10-05",
    reportedBy: "EMP-076",
    reportedByName: "Eng. David Muwonge",
    description:
      "Lathe machine malfunctioned during demonstration. Emergency stop activated. No injuries.",
    severity: "medium",
    status: "investigating",
    actionTaken:
      "Machine taken out of service. Maintenance team notified for inspection and repair.",
    preventiveMeasures:
      "Scheduling comprehensive inspection of all workshop equipment. Updating maintenance logs.",
    witnesses: "Workshop technician and 12 students",
    attachments: ["equipment_failure_report.pdf"],
  },
  {
    id: "INC-006",
    incidentType: "Structural Issue",
    location: "Library - East Wing",
    dateReported: "2023-09-20",
    dateOccurred: "2023-09-19",
    reportedBy: "EMP-045",
    reportedByName: "Ms. Janet Nakato",
    description:
      "Water leakage from ceiling after heavy rainfall. Some books and computer equipment affected.",
    severity: "medium",
    status: "resolved",
    actionTaken:
      "Area cordoned off. Books and equipment moved. Temporary repairs to roof completed.",
    preventiveMeasures:
      "Comprehensive roof inspection scheduled. Waterproofing to be applied.",
    witnesses: "Library staff and students present",
    attachments: ["structural_assessment.pdf", "damage_report.pdf"],
  },
  {
    id: "INC-007",
    incidentType: "Medical Emergency",
    location: "Sports Field",
    dateReported: "2023-10-12",
    dateOccurred: "2023-10-12",
    reportedBy: "EMP-098",
    reportedByName: "Mr. Peter Okello",
    description:
      "Student collapsed during football practice. Suspected heat exhaustion.",
    severity: "high",
    status: "closed",
    actionTaken:
      "First aid administered immediately. Student taken to campus clinic and later to hospital for observation.",
    preventiveMeasures:
      "Reviewing sports practice schedules during hot weather. Additional water stations to be installed.",
    witnesses: "Coach and team members",
    attachments: ["medical_incident_report.pdf"],
  },
];

const mockSafetyTrainings = [
  {
    id: "TRN-001",
    title: "Fire Safety and Emergency Evacuation",
    description:
      "Comprehensive training on fire prevention, use of fire extinguishers, and evacuation procedures specific to Nkumba University campus.",
    date: "2023-11-15",
    time: "09:00 AM - 12:00 PM",
    location: "Main Auditorium",
    status: "scheduled",
    mandatory: true,
    facilitator: "Mr. James Musoke, Chief Fire Safety Officer",
    attendees: {
      total: 180,
      registered: 145,
    },
    departments: [
      "All Academic Departments",
      "Administration",
      "Support Staff",
    ],
    materials: ["Fire_Safety_Manual.pdf", "Campus_Evacuation_Map.pdf"],
  },
  {
    id: "TRN-002",
    title: "First Aid and Emergency Response",
    description:
      "Basic and advanced first aid techniques, CPR, and emergency response procedures for common campus incidents.",
    date: "2023-11-22",
    time: "10:00 AM - 03:00 PM",
    location: "Health Sciences Building, Room 105",
    status: "scheduled",
    mandatory: true,
    facilitator: "Dr. Rebecca Namuganza, University Medical Center",
    attendees: {
      total: 50,
      registered: 42,
    },
    departments: [
      "Department Representatives",
      "Security Personnel",
      "Residence Assistants",
    ],
    materials: ["First_Aid_Handbook.pdf", "Emergency_Response_Protocols.pdf"],
  },
  {
    id: "TRN-003",
    title: "Laboratory Safety Procedures",
    description:
      "Comprehensive safety training for handling chemicals, biological materials, and laboratory equipment in university research and teaching labs.",
    date: "2023-12-05",
    time: "09:00 AM - 04:00 PM",
    location: "Science Complex, Laboratory 201",
    status: "scheduled",
    mandatory: true,
    facilitator: "Prof. Samuel Kyambadde, Head of Laboratory Safety",
    attendees: {
      total: 35,
      registered: 28,
    },
    departments: [
      "Science Faculty",
      "Laboratory Technicians",
      "Research Assistants",
    ],
    materials: [
      "Lab_Safety_Manual.pdf",
      "Chemical_Handling_Guidelines.pdf",
      "Biohazard_Protocols.pdf",
    ],
  },
  {
    id: "TRN-004",
    title: "Ergonomics and Office Safety",
    description:
      "Training on proper ergonomics, workstation setup, and office safety to prevent repetitive strain injuries and other workplace hazards.",
    date: "2023-12-12",
    time: "02:00 PM - 04:00 PM",
    location: "Administrative Block, Conference Room A",
    status: "scheduled",
    mandatory: false,
    facilitator: "Ms. Patricia Nantaba, Occupational Health Specialist",
    attendees: {
      total: 75,
      registered: 52,
    },
    departments: ["Administrative Staff", "Faculty", "IT Department"],
    materials: ["Ergonomics_Guide.pdf", "Office_Safety_Checklist.pdf"],
  },
  {
    id: "TRN-005",
    title: "Mental Health First Aid",
    description:
      "Training to identify, understand and respond to signs of mental health challenges and substance use disorders among students and colleagues.",
    date: "2024-01-10",
    time: "09:00 AM - 04:00 PM",
    location: "Psychology Department, Room 105",
    status: "scheduled",
    mandatory: false,
    facilitator: "Dr. Michael Ssentongo, Clinical Psychologist",
    attendees: {
      total: 40,
      registered: 22,
    },
    departments: [
      "Student Affairs",
      "Counseling Center",
      "Faculty Representatives",
    ],
    materials: [
      "Mental_Health_Resource_Guide.pdf",
      "Crisis_Intervention_Protocols.pdf",
    ],
  },
];

const mockSafetyAudits = [
  {
    id: "AUD-001",
    title: "Main Campus Fire Safety Audit",
    date: "2023-09-15",
    status: "completed",
    result: "passed",
    auditor: "External - Uganda Fire Safety Bureau",
    findings:
      "All fire extinguishers properly maintained and accessible. Emergency exits clear and well-marked. Fire alarm system fully operational.",
    recommendations:
      "Minor improvements to signage in new buildings. Update evacuation maps to include recent campus changes.",
    nextAuditDue: "2024-03-15",
    attachments: ["fire_safety_audit_report.pdf", "compliance_certificate.pdf"],
  },
  {
    id: "AUD-002",
    title: "Science Laboratory Safety Inspection",
    date: "2023-09-28",
    status: "completed",
    result: "passed",
    auditor: "Internal Safety Committee & External Consultant",
    findings:
      "Chemical storage and handling procedures in compliance with regulations. Safety equipment properly maintained. Proper documentation in place.",
    recommendations:
      "Update chemical inventory system. Additional eye wash stations recommended for Biology labs.",
    nextAuditDue: "2024-03-28",
    attachments: ["lab_safety_audit_report.pdf"],
  },
  {
    id: "AUD-003",
    title: "Student Dormitories Safety Check",
    date: "2023-10-05",
    status: "completed",
    result: "minor issues",
    auditor: "Internal Safety Committee",
    findings:
      "Generally good compliance. Some emergency lighting needs replacement. Isolated instances of blocked emergency exits.",
    recommendations:
      "Replace faulty emergency lights. Conduct student awareness program about keeping exits clear.",
    nextAuditDue: "2024-01-05",
    attachments: ["dormitory_safety_report.pdf", "corrective_action_plan.pdf"],
  },
  {
    id: "AUD-004",
    title: "Administrative Building Electrical Safety",
    date: "2023-10-25",
    status: "scheduled",
    result: "pending",
    auditor: "External - Certified Electrical Safety Inspector",
    findings: "Pending",
    recommendations: "Pending",
    nextAuditDue: "2024-04-25",
    attachments: [],
  },
  {
    id: "AUD-005",
    title: "Sports Facilities Safety Assessment",
    date: "2023-11-10",
    status: "scheduled",
    result: "pending",
    auditor: "Internal Safety Committee & Sports Department",
    findings: "Pending",
    recommendations: "Pending",
    nextAuditDue: "2024-05-10",
    attachments: [],
  },
];

const mockComplianceData = {
  safetyMetrics: {
    overallCompliance: 92,
    incidentTrend: "decreasing",
    trainingCompletion: 87,
    highRiskAreas: ["Laboratories", "Construction Sites", "Workshops"],
    lastUpdated: "2023-10-20",
  },
  locationCompliance: [
    { location: "Main Campus", compliance: 95 },
    { location: "Science Laboratories", compliance: 92 },
    { location: "Student Dormitories", compliance: 88 },
    { location: "Sports Facilities", compliance: 90 },
    { location: "Administrative Buildings", compliance: 94 },
    { location: "Library", compliance: 96 },
    { location: "Cafeteria", compliance: 89 },
  ],
  incidentsByType: [
    { type: "Slip and Fall", count: 7, percentage: 35 },
    { type: "Electrical", count: 3, percentage: 15 },
    { type: "Chemical", count: 2, percentage: 10 },
    { type: "Fire", count: 1, percentage: 5 },
    { type: "Equipment Failure", count: 4, percentage: 20 },
    { type: "Structural", count: 2, percentage: 10 },
    { type: "Other", count: 1, percentage: 5 },
  ],
  incidentsBySeverity: [
    { severity: "Low", count: 7, percentage: 35 },
    { severity: "Medium", count: 8, percentage: 40 },
    { severity: "High", count: 4, percentage: 20 },
    { severity: "Critical", count: 1, percentage: 5 },
  ],
};

const WorkplaceSafety = () => {
  // State management
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isTrainingModalVisible, setIsTrainingModalVisible] = useState(false);
  const [isAuditDrawerVisible, setIsAuditDrawerVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [form] = Form.useForm();
  const [trainingForm] = Form.useForm();
  const [safetyIncidents, setSafetyIncidents] = useState(mockSafetyIncidents);
  const [safetyTrainings, setSafetyTrainings] = useState(mockSafetyTrainings);
  const [safetyAudits, setSafetyAudits] = useState(mockSafetyAudits);
  const [complianceData, setComplianceData] = useState(mockComplianceData);

  // Filter incidents based on search text and filters
  const filteredIncidents = safetyIncidents.filter((incident) => {
    // Text search
    const matchesSearch =
      incident.incidentType.toLowerCase().includes(searchText.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchText.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchText.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchText.toLowerCase());

    // Severity filter
    const matchesSeverity =
      selectedSeverity === "all" || incident.severity === selectedSeverity;

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || incident.status === selectedStatus;

    // Type filter
    const matchesType =
      selectedType === "all" || incident.incidentType === selectedType;

    // Date range filter
    let matchesDateRange = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const incidentDate = moment(incident.dateOccurred);
      matchesDateRange = incidentDate.isBetween(
        dateRange[0],
        dateRange[1],
        null,
        "[]"
      );
    }

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesStatus &&
      matchesType &&
      matchesDateRange
    );
  });

  // Simulate data loading
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Data refreshed successfully");
    }, 1000);
  };

  // Modal handlers
  const showAddIncidentModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showViewIncidentModal = (incident) => {
    setSelectedIncident(incident);
    setIsViewModalVisible(true);
  };

  const showTrainingDetailsModal = (training) => {
    setSelectedTraining(training);
    setIsTrainingModalVisible(true);
  };

  const showAuditDetailsDrawer = (audit) => {
    setSelectedAudit(audit);
    setIsAuditDrawerVisible(true);
  };

  // Form submission handlers
  const handleAddIncident = () => {
    form.validateFields().then((values) => {
      const newIncident = {
        id: `INC-${Math.floor(Math.random() * 1000)}`,
        incidentType: values.incidentType,
        location: values.location,
        dateReported: values.dateReported.format("YYYY-MM-DD"),
        dateOccurred: values.dateOccurred.format("YYYY-MM-DD"),
        reportedBy: "EMP-001", // Current user ID would be used here
        reportedByName: "Current User", // Would be dynamically set
        description: values.description,
        severity: values.severity,
        status: "reported",
        actionTaken: values.actionTaken || "",
        preventiveMeasures: values.preventiveMeasures || "",
        witnesses: values.witnesses || "",
        attachments: [],
      };

      setSafetyIncidents([newIncident, ...safetyIncidents]);
      setIsModalVisible(false);
      message.success("Incident reported successfully");
    });
  };

  const handleAddTraining = () => {
    trainingForm.validateFields().then((values) => {
      const newTraining = {
        id: `TRN-${Math.floor(Math.random() * 1000)}`,
        title: values.title,
        description: values.description,
        date: values.date.format("YYYY-MM-DD"),
        time:
          values.time.format("hh:mm A") +
          " - " +
          values.endTime.format("hh:mm A"),
        location: values.location,
        status: "scheduled",
        mandatory: values.mandatory,
        facilitator: values.facilitator,
        attendees: {
          total: Number.parseInt(values.capacity),
          registered: 0,
        },
        departments: values.departments,
        materials: [],
      };

      setSafetyTrainings([newTraining, ...safetyTrainings]);
      setIsTrainingModalVisible(false);
      message.success("Training scheduled successfully");
    });
  };

  // Table columns
  const incidentColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => <Text strong>{id}</Text>,
    },
    {
      title: "Type",
      dataIndex: "incidentType",
      key: "incidentType",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <Tooltip title={text}>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1 text-gray-500" />
            <Text ellipsis style={{ maxWidth: 200 }}>
              {text}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      dataIndex: "dateOccurred",
      key: "dateOccurred",
      render: (date) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-1 text-gray-500" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: "Reported By",
      dataIndex: "reportedByName",
      key: "reportedByName",
      render: (name) => (
        <div className="flex items-center">
          <User size={14} className="mr-1 text-gray-500" />
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => {
        let color = "default";
        let icon = null;

        switch (severity) {
          case "low":
            color = "success";
            icon = <CheckCircle size={14} />;
            break;
          case "medium":
            color = "warning";
            icon = <AlertTriangle size={14} />;
            break;
          case "high":
            color = "error";
            icon = <AlertTriangle size={14} />;
            break;
          case "critical":
            color = "error";
            icon = <XCircle size={14} />;
            break;
        }

        return (
          <Tag color={color} icon={icon}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
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
          case "reported":
            color = "warning";
            icon = <Clock size={14} />;
            break;
          case "investigating":
            color = "processing";
            icon = <Activity size={14} />;
            break;
          case "resolved":
            color = "success";
            icon = <CheckCircle size={14} />;
            break;
          case "closed":
            color = "default";
            icon = <FileText size={14} />;
            break;
        }

        return (
          <Tag color={color} icon={icon}>
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
          <Tooltip title="View Details">
            <Button
              type="primary"
              size="small"
              icon={<Eye size={14} />}
              onClick={() => showViewIncidentModal(record)}
              ghost
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="default" size="small" icon={<Edit size={14} />} />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" icon={<FileCheck size={14} />}>
                  Mark as Resolved
                </Menu.Item>
                <Menu.Item key="2" icon={<Printer size={14} />}>
                  Print Report
                </Menu.Item>
                <Menu.Item key="3" icon={<Download size={14} />}>
                  Download Details
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="4" icon={<Trash2 size={14} />} danger>
                  Delete
                </Menu.Item>
              </Menu>
            }
          >
            <Button
              type="text"
              size="small"
              icon={<MoreHorizontal size={14} />}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const trainingColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Training",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          {record.mandatory && (
            <Tag color="red" className="ml-2">
              Mandatory
            </Tag>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {record.description.substring(0, 60)}...
          </div>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date, record) => (
        <div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1 text-gray-500" />
            <span>{date}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{record.time}</div>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <Tooltip title={text}>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1 text-gray-500" />
            <Text ellipsis style={{ maxWidth: 200 }}>
              {text}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Facilitator",
      dataIndex: "facilitator",
      key: "facilitator",
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 200 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Registration",
      dataIndex: "attendees",
      key: "attendees",
      render: (attendees) => (
        <div>
          <Progress
            percent={Math.round((attendees.registered / attendees.total) * 100)}
            size="small"
            status="active"
            format={(percent) => `${percent}%`}
          />
          <Text type="secondary" className="text-xs">
            {attendees.registered}/{attendees.total} registered
          </Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => showTrainingDetailsModal(record)}
          >
            Register
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => showTrainingDetailsModal(record)}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const auditColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Audit Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-1 text-gray-500" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: "Auditor",
      dataIndex: "auditor",
      key: "auditor",
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 200 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;

        switch (status) {
          case "scheduled":
            color = "processing";
            icon = <Clock size={14} />;
            break;
          case "completed":
            color = "success";
            icon = <CheckCircle size={14} />;
            break;
          case "in-progress":
            color = "warning";
            icon = <Activity size={14} />;
            break;
        }

        return (
          <Tag color={color} icon={icon}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (result) => {
        let color = "default";
        let icon = null;

        switch (result) {
          case "passed":
            color = "success";
            icon = <CheckCircle size={14} />;
            break;
          case "minor issues":
            color = "warning";
            icon = <AlertTriangle size={14} />;
            break;
          case "failed":
            color = "error";
            icon = <XCircle size={14} />;
            break;
          case "pending":
            color = "default";
            icon = <Clock size={14} />;
            break;
        }

        return (
          <Tag color={color} icon={icon}>
            {result.charAt(0).toUpperCase() + result.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => showAuditDetailsDrawer(record)}
            ghost
          />
          <Button
            type="default"
            size="small"
            icon={<Download size={14} />}
            disabled={record.attachments.length === 0}
          >
            Report
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="workplace-safety">
      <div className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item>Compliance & Legal</Breadcrumb.Item>
          <Breadcrumb.Item>Workplace Safety</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex justify-between items-center mt-2">
          <Title level={4} style={{ margin: 0 }}>
            <Shield className="inline-block mr-2 text-blue-500" size={24} />
            Workplace Safety Management
          </Title>
          <Space>
            <Button icon={<HelpCircle size={16} />}>Help</Button>
            <Button icon={<Settings size={16} />}>Settings</Button>
          </Space>
        </div>
      </div>

      {/* Dashboard Stats */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Shield size={16} className="mr-2 text-green-500" />
                  <span>Safety Compliance Rate</span>
                </div>
              }
              value={complianceData.safetyMetrics.overallCompliance}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
            <div className="mt-4">
              <Progress
                percent={complianceData.safetyMetrics.overallCompliance}
                status="active"
                strokeColor={{
                  "0%": "#52c41a",
                  "100%": "#87d068",
                }}
              />
              <div className="mt-2 text-xs text-gray-500">
                <TrendingUp size={14} className="inline mr-1 text-green-500" />
                <span>3% increase from last quarter</span>
              </div>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="text-xs text-gray-500">
              Last updated: {complianceData.safetyMetrics.lastUpdated}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <AlertTriangle size={16} className="mr-2 text-amber-500" />
                  <span>Incidents This Year</span>
                </div>
              }
              value={safetyIncidents.length}
              valueStyle={{ color: "#faad14" }}
            />
            <div className="mt-4">
              <Title
                level={5}
                style={{ fontSize: "14px", margin: "0 0 8px 0" }}
              >
                Incident Severity
              </Title>
              {complianceData.incidentsBySeverity.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <Text>{item.severity}</Text>
                    <Text>{item.count}</Text>
                  </div>
                  <Progress
                    percent={item.percentage}
                    size="small"
                    strokeColor={
                      item.severity === "Low"
                        ? "#52c41a"
                        : item.severity === "Medium"
                          ? "#faad14"
                          : item.severity === "High"
                            ? "#f5222d"
                            : "#ff4d4f"
                    }
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Activity size={16} className="mr-2 text-blue-500" />
                  <span>Safety Trainings</span>
                </div>
              }
              value={safetyTrainings.length}
              valueStyle={{ color: "#1890ff" }}
              suffix={<Text type="secondary">scheduled</Text>}
            />
            <div className="mt-4">
              <Title
                level={5}
                style={{ fontSize: "14px", margin: "0 0 8px 0" }}
              >
                Training Completion
              </Title>
              {safetyTrainings.slice(0, 3).map((training, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <Tooltip title={training.title}>
                      <Text ellipsis style={{ maxWidth: 180 }}>
                        {training.title}
                      </Text>
                    </Tooltip>
                    <Text>
                      {training.attendees.registered}/{training.attendees.total}
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round(
                      (training.attendees.registered /
                        training.attendees.total) *
                        100
                    )}
                    size="small"
                    status="active"
                    showInfo={false}
                  />
                </div>
              ))}
              <Button
                type="link"
                style={{ padding: "4px 0", height: "auto", marginTop: "8px" }}
              >
                View All Trainings
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <AlertTriangle size={16} /> Incident Management
              </span>
            }
            key="1"
          >
            <div className="mb-4">
              <Alert
                message="Safety First"
                description="All workplace incidents must be reported within 24 hours. Serious incidents requiring medical attention must be reported immediately."
                type="info"
                showIcon
                icon={<Info size={16} />}
                closable
              />
            </div>

            <div className="mb-4 flex flex-wrap justify-between gap-2">
              <Space wrap>
                <Input
                  placeholder="Search incidents..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
                <Select
                  defaultValue="all"
                  style={{ width: 150 }}
                  value={selectedType}
                  onChange={setSelectedType}
                >
                  <Option value="all">All Types</Option>
                  <Option value="Slip and Fall">Slip and Fall</Option>
                  <Option value="Electrical Fault">Electrical</Option>
                  <Option value="Chemical Spill">Chemical</Option>
                  <Option value="Fire">Fire</Option>
                  <Option value="Equipment Failure">Equipment</Option>
                  <Option value="Structural Issue">Structural</Option>
                  <Option value="Medical Emergency">Medical</Option>
                </Select>
                <Select
                  defaultValue="all"
                  style={{ width: 150 }}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                >
                  <Option value="all">All Statuses</Option>
                  <Option value="reported">Reported</Option>
                  <Option value="investigating">Investigating</Option>
                  <Option value="resolved">Resolved</Option>
                  <Option value="closed">Closed</Option>
                </Select>
                <Select
                  defaultValue="all"
                  style={{ width: 150 }}
                  value={selectedSeverity}
                  onChange={setSelectedSeverity}
                >
                  <Option value="all">All Severities</Option>
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
                <RangePicker
                  onChange={(dates) => setDateRange(dates)}
                  allowClear
                />
              </Space>
              <Space wrap>
                <Button icon={<RefreshCw size={16} />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button icon={<Download size={16} />}>Export</Button>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={showAddIncidentModal}
                >
                  Report Incident
                </Button>
              </Space>
            </div>

            <Table
              columns={incidentColumns}
              dataSource={filteredIncidents}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 5,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} incidents`,
              }}
              bordered
              size="middle"
              className="shadow-sm"
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No incidents found"
                  />
                ),
              }}
            />
          </TabPane>

          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Shield size={16} /> Safety Trainings
              </span>
            }
            key="2"
          >
            <div className="mb-4">
              <Alert
                message="Upcoming Mandatory Trainings"
                description="All staff members are required to complete these safety trainings as part of Nkumba University's commitment to workplace safety."
                type="info"
                showIcon
                icon={<Info size={16} />}
                closable
              />
            </div>

            <div className="mb-4 flex justify-between">
              <Space>
                <Input
                  placeholder="Search trainings..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">All Trainings</Option>
                  <Option value="mandatory">Mandatory Only</Option>
                  <Option value="optional">Optional Only</Option>
                </Select>
              </Space>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => {
                  trainingForm.resetFields();
                  setIsTrainingModalVisible(true);
                }}
              >
                Schedule Training
              </Button>
            </div>

            <Table
              columns={trainingColumns}
              dataSource={safetyTrainings}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} trainings`,
              }}
              bordered
              size="middle"
              className="shadow-sm"
            />
          </TabPane>

          <TabPane
            tab={
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BarChart2 size={16} /> Safety Audits
              </span>
            }
            key="3"
          >
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <FileCheck size={16} className="mr-2 text-blue-500" />
                        <span>Recent Safety Audits</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                    extra={
                      <Button type="primary" size="small">
                        Schedule New Audit
                      </Button>
                    }
                  >
                    <Table
                      columns={auditColumns}
                      dataSource={safetyAudits}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      size="small"
                    />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <BarChart2 size={16} className="mr-2 text-blue-500" />
                        <span>Safety Compliance by Location</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <div className="mb-4">
                      {complianceData.locationCompliance.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <Text>{item.location}</Text>
                            <Text>{item.compliance}%</Text>
                          </div>
                          <Progress
                            percent={item.compliance}
                            size="small"
                            status={
                              item.compliance >= 90 ? "success" : "active"
                            }
                            showInfo={false}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button icon={<Download size={16} />}>
                        Export Report
                      </Button>
                      <Button type="primary" icon={<RefreshCw size={16} />}>
                        Refresh Data
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Add Incident Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <AlertTriangle size={18} className="mr-2 text-amber-500" />
            <span>Report Safety Incident</span>
          </div>
        }
        visible={isModalVisible}
        onOk={handleAddIncident}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="Submit Report"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="incidentType"
                label="Incident Type"
                rules={[
                  { required: true, message: "Please select incident type" },
                ]}
              >
                <Select placeholder="Select incident type">
                  <Option value="Slip and Fall">Slip and Fall</Option>
                  <Option value="Electrical Fault">Electrical Fault</Option>
                  <Option value="Chemical Spill">Chemical Spill</Option>
                  <Option value="Fire">Fire</Option>
                  <Option value="Equipment Failure">Equipment Failure</Option>
                  <Option value="Structural Issue">Structural Issue</Option>
                  <Option value="Medical Emergency">Medical Emergency</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input
                  placeholder="Enter location"
                  prefix={<MapPin size={14} />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOccurred"
                label="Date Occurred"
                rules={[
                  { required: true, message: "Please select date occurred" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateReported"
                label="Date Reported"
                rules={[
                  { required: true, message: "Please select date reported" },
                ]}
                initialValue={moment()}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter incident description" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe what happened in detail"
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="Severity"
                rules={[{ required: true, message: "Please select severity" }]}
              >
                <Select placeholder="Select severity">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="witnesses" label="Witnesses">
                <Input placeholder="Names of witnesses (if any)" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="actionTaken" label="Immediate Action Taken">
            <Input.TextArea
              rows={2}
              placeholder="Describe any immediate action taken"
            />
          </Form.Item>
          <Form.Item
            name="preventiveMeasures"
            label="Suggested Preventive Measures"
          >
            <Input.TextArea
              rows={2}
              placeholder="Suggest measures to prevent recurrence"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Incident Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <AlertCircle size={18} className="mr-2 text-blue-500" />
            <span>Incident Details</span>
          </div>
        }
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
          <Button key="edit" type="primary" icon={<Edit size={16} />}>
            Edit
          </Button>,
        ]}
        width={700}
      >
        {selectedIncident && (
          <div>
            <div className="mb-4 pb-4 border-b">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Incident ID</Text>
                    <div>
                      <Text strong>{selectedIncident.id}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Status</Text>
                    <div>
                      <Tag
                        color={
                          selectedIncident.status === "resolved"
                            ? "success"
                            : selectedIncident.status === "investigating"
                              ? "processing"
                              : selectedIncident.status === "reported"
                                ? "warning"
                                : "default"
                        }
                      >
                        {selectedIncident.status.charAt(0).toUpperCase() +
                          selectedIncident.status.slice(1)}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="mb-4 pb-4 border-b">
              <Row gutter={16}>
                <Col span={8}>
                  <div className="mb-2">
                    <Text type="secondary">Incident Type</Text>
                    <div>
                      <Tag color="blue">{selectedIncident.incidentType}</Tag>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="mb-2">
                    <Text type="secondary">Severity</Text>
                    <div>
                      <Tag
                        color={
                          selectedIncident.severity === "low"
                            ? "success"
                            : selectedIncident.severity === "medium"
                              ? "warning"
                              : selectedIncident.severity === "high"
                                ? "error"
                                : "error"
                        }
                      >
                        {selectedIncident.severity.charAt(0).toUpperCase() +
                          selectedIncident.severity.slice(1)}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="mb-2">
                    <Text type="secondary">Location</Text>
                    <div>
                      <Text>{selectedIncident.location}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="mb-4 pb-4 border-b">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Date Occurred</Text>
                    <div>
                      <Text>{selectedIncident.dateOccurred}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Date Reported</Text>
                    <div>
                      <Text>{selectedIncident.dateReported}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="mb-4 pb-4 border-b">
              <div className="mb-2">
                <Text type="secondary">Description</Text>
                <div>
                  <Paragraph>{selectedIncident.description}</Paragraph>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Action Taken</Text>
                    <div>
                      <Paragraph>
                        {selectedIncident.actionTaken || "No action recorded"}
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <Text type="secondary">Preventive Measures</Text>
                    <div>
                      <Paragraph>
                        {selectedIncident.preventiveMeasures ||
                          "No preventive measures recorded"}
                      </Paragraph>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {selectedIncident.attachments &&
              selectedIncident.attachments.length > 0 && (
                <div className="mb-4 pb-4 border-t pt-4">
                  <Text type="secondary">Attachments</Text>
                  <div className="mt-2">
                    {selectedIncident.attachments.map((attachment, index) => (
                      <Tag
                        key={index}
                        icon={<FileText size={14} />}
                        className="mr-2 mb-2"
                      >
                        <a href="#">{attachment}</a>
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      {/* Training Details Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <Shield size={18} className="mr-2 text-blue-500" />
            <span>Training Details</span>
          </div>
        }
        visible={isTrainingModalVisible}
        onCancel={() => setIsTrainingModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsTrainingModalVisible(false)}>
            Close
          </Button>,
          <Button key="register" type="primary">
            Register for Training
          </Button>,
        ]}
        width={700}
      >
        {selectedTraining ? (
          <div>
            <div className="mb-4">
              <Title level={4}>{selectedTraining.title}</Title>
              {selectedTraining.mandatory && <Tag color="red">Mandatory</Tag>}
            </div>

            <Descriptions
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Date">
                {selectedTraining.date}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {selectedTraining.time}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedTraining.location}
              </Descriptions.Item>
              <Descriptions.Item label="Facilitator">
                {selectedTraining.facilitator}
              </Descriptions.Item>
              <Descriptions.Item label="Registration" span={2}>
                <Progress
                  percent={Math.round(
                    (selectedTraining.attendees.registered /
                      selectedTraining.attendees.total) *
                      100
                  )}
                  size="small"
                  status="active"
                />
                <Text type="secondary">
                  {selectedTraining.attendees.registered}/
                  {selectedTraining.attendees.total} registered
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedTraining.description}
              </Descriptions.Item>
              <Descriptions.Item label="Target Departments" span={2}>
                {selectedTraining.departments.map((dept, index) => (
                  <Tag key={index} className="mr-1 mb-1">
                    {dept}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Training Materials" span={2}>
                {selectedTraining.materials.map((material, index) => (
                  <Tag
                    key={index}
                    icon={<FileText size={14} />}
                    className="mr-1 mb-1"
                  >
                    <a href="#">{material}</a>
                  </Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <div className="text-center py-4">
            <Spin />
          </div>
        )}
      </Modal>

      {/* Schedule Training Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <Plus size={18} className="mr-2 text-blue-500" />
            <span>Schedule New Training</span>
          </div>
        }
        visible={isTrainingModalVisible && !selectedTraining}
        onOk={handleAddTraining}
        onCancel={() => setIsTrainingModalVisible(false)}
        width={700}
        okText="Schedule Training"
        cancelText="Cancel"
      >
        <Form form={trainingForm} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Training Title"
                rules={[
                  { required: true, message: "Please enter training title" },
                ]}
              >
                <Input placeholder="Enter training title" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mandatory"
                label="Mandatory"
                rules={[{ required: true, message: "Please select" }]}
              >
                <Select placeholder="Select">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter training description" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="time"
                label="Start Time"
                rules={[
                  { required: true, message: "Please select start time" },
                ]}
              >
                <DatePicker picker="time" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: "Please select end time" }]}
              >
                <DatePicker picker="time" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="Enter training location" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[{ required: true, message: "Please enter capacity" }]}
              >
                <Input type="number" placeholder="Enter capacity" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="facilitator"
            label="Facilitator"
            rules={[{ required: true, message: "Please enter facilitator" }]}
          >
            <Input placeholder="Enter facilitator name and title" />
          </Form.Item>
          <Form.Item
            name="departments"
            label="Target Departments"
            rules={[{ required: true, message: "Please select departments" }]}
          >
            <Select mode="multiple" placeholder="Select departments">
              <Option value="All Academic Departments">
                All Academic Departments
              </Option>
              <Option value="Administration">Administration</Option>
              <Option value="Support Staff">Support Staff</Option>
              <Option value="Science Faculty">Science Faculty</Option>
              <Option value="Laboratory Technicians">
                Laboratory Technicians
              </Option>
              <Option value="Security Personnel">Security Personnel</Option>
              <Option value="Residence Assistants">Residence Assistants</Option>
              <Option value="Department Representatives">
                Department Representatives
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Audit Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <FileCheck size={18} className="mr-2 text-blue-500" />
            <span>Audit Details</span>
          </div>
        }
        placement="right"
        onClose={() => setIsAuditDrawerVisible(false)}
        visible={isAuditDrawerVisible}
        width={600}
        extra={
          <Space>
            <Button onClick={() => setIsAuditDrawerVisible(false)}>
              Close
            </Button>
            <Button
              type="primary"
              icon={<Download size={14} />}
              disabled={!selectedAudit?.attachments?.length}
            >
              Download Report
            </Button>
          </Space>
        }
      >
        {selectedAudit ? (
          <div>
            <div className="mb-4">
              <Title level={4}>{selectedAudit.title}</Title>
              <div className="flex items-center mt-1">
                <Calendar size={14} className="mr-1 text-gray-500" />
                <Text type="secondary">{selectedAudit.date}</Text>
                <Tag
                  className="ml-2"
                  color={
                    selectedAudit.status === "completed"
                      ? "success"
                      : selectedAudit.status === "scheduled"
                        ? "processing"
                        : "warning"
                  }
                >
                  {selectedAudit.status.charAt(0).toUpperCase() +
                    selectedAudit.status.slice(1)}
                </Tag>
                {selectedAudit.result !== "pending" && (
                  <Tag
                    className="ml-1"
                    color={
                      selectedAudit.result === "passed"
                        ? "success"
                        : selectedAudit.result === "minor issues"
                          ? "warning"
                          : "error"
                    }
                  >
                    {selectedAudit.result.charAt(0).toUpperCase() +
                      selectedAudit.result.slice(1)}
                  </Tag>
                )}
              </div>
            </div>

            <Descriptions bordered column={1} className="mb-4">
              <Descriptions.Item label="Auditor">
                {selectedAudit.auditor}
              </Descriptions.Item>
              <Descriptions.Item label="Next Audit Due">
                {selectedAudit.nextAuditDue || "Not scheduled"}
              </Descriptions.Item>
              <Descriptions.Item label="Findings">
                {selectedAudit.findings !== "Pending"
                  ? selectedAudit.findings
                  : "Audit not yet conducted"}
              </Descriptions.Item>
              <Descriptions.Item label="Recommendations">
                {selectedAudit.recommendations !== "Pending"
                  ? selectedAudit.recommendations
                  : "Pending audit completion"}
              </Descriptions.Item>
            </Descriptions>

            {selectedAudit.attachments &&
              selectedAudit.attachments.length > 0 && (
                <div>
                  <Title level={5}>Attachments</Title>
                  <List
                    bordered
                    dataSource={selectedAudit.attachments}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            key="download"
                            type="link"
                            icon={<Download size={14} />}
                          >
                            Download
                          </Button>,
                          <Button
                            key="view"
                            type="link"
                            icon={<Eye size={14} />}
                          >
                            View
                          </Button>,
                        ]}
                      >
                        <div className="flex items-center">
                          <FileText size={16} className="mr-2 text-blue-500" />
                          <Text>{item}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              )}

            {selectedAudit.status === "completed" && (
              <div className="mt-4">
                <Title level={5}>Follow-up Actions</Title>
                {selectedAudit.result === "passed" ? (
                  <Alert
                    message="No follow-up actions required"
                    description="This audit passed with no issues. Regular scheduled audits will continue as planned."
                    type="success"
                    showIcon
                  />
                ) : (
                  <Alert
                    message="Follow-up actions required"
                    description="Please review the recommendations and implement the suggested improvements before the next audit."
                    type="warning"
                    showIcon
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Spin />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default WorkplaceSafety;
