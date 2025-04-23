"use client";

import { useState } from "react";
import {
  Card,
  Button,
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
  Divider,
  Tag,
  message,
  Space,
  Table,
  Tooltip,
  Switch,
} from "antd";
import {
  Users,
  BarChart2,
  PieChart,
  TrendingUp,
  Search,
  Plus,
  Download,
  Filter,
  RefreshCw,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit,
  Eye,
  FileCheck,
  Clock,
  ChevronRight,
} from "lucide-react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export default function EqualEmployment() {
  // Internal state management instead of using context
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [form] = Form.useForm();
  const [reportForm] = Form.useForm();

  // Internal data instead of fetching from context
  const [diversityStats, setDiversityStats] = useState({
    genderDistribution: {
      male: 320,
      female: 280,
      other: 15,
    },
    ageDistribution: {
      under30: 175,
      between30And50: 350,
      over50: 90,
    },
    disabilityStats: {
      withDisability: 28,
      withoutDisability: 587,
    },
    departmentDistribution: {
      "Faculty of Business": 120,
      "Faculty of Science": 95,
      "Faculty of Arts": 85,
      "Faculty of Law": 65,
      Administration: 110,
      "Support Staff": 140,
    },
    ethnicityDistribution: {
      Baganda: 210,
      Banyankole: 95,
      Basoga: 75,
      Iteso: 65,
      Acholi: 55,
      Langi: 45,
      Other: 70,
    },
    leadershipStats: {
      female: 35,
      male: 65,
    },
    payGapStats: {
      femaleAvgSalary: 4850000,
      maleAvgSalary: 5000000,
    },
  });

  // Calculate totals and percentages
  const totalEmployees =
    diversityStats.genderDistribution.male +
    diversityStats.genderDistribution.female +
    diversityStats.genderDistribution.other;

  const genderPercentages = {
    male: Math.round(
      (diversityStats.genderDistribution.male / totalEmployees) * 100
    ),
    female: Math.round(
      (diversityStats.genderDistribution.female / totalEmployees) * 100
    ),
    other: Math.round(
      (diversityStats.genderDistribution.other / totalEmployees) * 100
    ),
  };

  const agePercentages = {
    under30: Math.round(
      (diversityStats.ageDistribution.under30 / totalEmployees) * 100
    ),
    between30And50: Math.round(
      (diversityStats.ageDistribution.between30And50 / totalEmployees) * 100
    ),
    over50: Math.round(
      (diversityStats.ageDistribution.over50 / totalEmployees) * 100
    ),
  };

  const disabilityPercentages = {
    withDisability: Math.round(
      (diversityStats.disabilityStats.withDisability / totalEmployees) * 100
    ),
    withoutDisability: Math.round(
      (diversityStats.disabilityStats.withoutDisability / totalEmployees) * 100
    ),
  };

  // Department and ethnicity data for charts
  const departmentData = Object.entries(
    diversityStats.departmentDistribution
  ).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / totalEmployees) * 100),
  }));

  const ethnicityData = Object.entries(
    diversityStats.ethnicityDistribution
  ).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / totalEmployees) * 100),
  }));

  // Policies data
  const [diversityPolicies, setDiversityPolicies] = useState([
    {
      id: "DP-001",
      title: "Equal Employment Opportunity Policy",
      description:
        "Policy ensuring fair treatment in all employment practices regardless of protected characteristics",
      lastUpdated: "2023-05-15",
      status: "active",
      documentLink: "#",
      reviewDate: "2024-05-15",
    },
    {
      id: "DP-002",
      title: "Anti-Discrimination and Harassment Policy",
      description:
        "Policy prohibiting discrimination and harassment based on protected characteristics",
      lastUpdated: "2023-06-10",
      status: "active",
      documentLink: "#",
      reviewDate: "2024-06-10",
    },
    {
      id: "DP-003",
      title: "Reasonable Accommodation Policy",
      description:
        "Policy for providing reasonable accommodations to employees with disabilities",
      lastUpdated: "2023-04-22",
      status: "active",
      documentLink: "#",
      reviewDate: "2024-04-22",
    },
    {
      id: "DP-004",
      title: "Diversity and Inclusion Strategic Plan",
      description:
        "Comprehensive plan for promoting diversity and inclusion at Nkumba University",
      lastUpdated: "2023-07-30",
      status: "active",
      documentLink: "#",
      reviewDate: "2024-07-30",
    },
  ]);

  // Training data
  const [diversityTrainings, setDiversityTrainings] = useState([
    {
      id: "DT-001",
      title: "Unconscious Bias Training",
      description:
        "Training to help staff recognize and mitigate unconscious biases in the workplace",
      date: "2023-11-20",
      status: "scheduled",
      targetAudience: "All Staff",
      duration: "3 hours",
      facilitator: "Dr. Sarah Nakimuli",
      location: "Main Campus, Conference Hall A",
      mandatory: true,
      registeredParticipants: 87,
    },
    {
      id: "DT-002",
      title: "Inclusive Leadership Workshop",
      description:
        "Workshop for department heads and supervisors on fostering inclusive teams",
      date: "2023-12-05",
      status: "scheduled",
      targetAudience: "Department Heads, Supervisors",
      duration: "Full day",
      facilitator: "Prof. James Okello",
      location: "Main Campus, Executive Training Center",
      mandatory: true,
      registeredParticipants: 42,
    },
    {
      id: "DT-003",
      title: "Disability Awareness Training",
      description:
        "Training on creating an accessible and inclusive environment for people with disabilities",
      date: "2024-01-15",
      status: "scheduled",
      targetAudience: "All Staff",
      duration: "2 hours",
      facilitator: "Ms. Rebecca Auma",
      location: "Online (Zoom)",
      mandatory: false,
      registeredParticipants: 65,
    },
  ]);

  // Compliance reports data
  const [complianceReports, setComplianceReports] = useState([
    {
      id: "CR-001",
      title: "Annual EEO Compliance Report",
      date: "2023-06-30",
      status: "Submitted",
      submittedBy: "Dr. Florence Namubiru",
      approvedBy: "Vice Chancellor",
      documentLink: "#",
    },
    {
      id: "CR-002",
      title: "Quarterly Diversity Metrics Report",
      date: "2023-09-30",
      status: "Submitted",
      submittedBy: "Mr. Daniel Ochieng",
      approvedBy: "HR Director",
      documentLink: "#",
    },
    {
      id: "CR-003",
      title: "Disability Inclusion Assessment",
      date: "2023-08-15",
      status: "Submitted",
      submittedBy: "Ms. Rebecca Auma",
      approvedBy: "HR Director",
      documentLink: "#",
    },
    {
      id: "CR-004",
      title: "Gender Pay Gap Analysis",
      date: "2023-07-22",
      status: "Submitted",
      submittedBy: "Dr. Florence Namubiru",
      approvedBy: "Vice Chancellor",
      documentLink: "#",
    },
  ]);

  // Handlers
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Data refreshed successfully");
    }, 1000);
  };

  const showAddTrainingModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleAddTraining = () => {
    form.validateFields().then((values) => {
      const newTraining = {
        id: `DT-00${diversityTrainings.length + 1}`,
        ...values,
        status: "scheduled",
        registeredParticipants: 0,
      };

      setDiversityTrainings([...diversityTrainings, newTraining]);
      message.success("Diversity training added successfully");
      setIsModalVisible(false);
    });
  };

  const showGenerateReportModal = () => {
    reportForm.resetFields();
    setIsReportModalVisible(true);
  };

  const handleGenerateReport = () => {
    reportForm.validateFields().then((values) => {
      message.success(
        "Report generation initiated. You will be notified when it's ready."
      );
      setIsReportModalVisible(false);
    });
  };

  const viewPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
  };

  // Columns for the reports table
  const reportsColumns = [
    {
      title: "Report Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div className="text-xs text-gray-500 mt-1">ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-2 text-blue-500" />
          {text}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Submitted" ? "success" : "processing"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      key: "submittedBy",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Report">
            <Button type="text" icon={<Eye size={16} />} />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<Download size={16} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="equal-employment bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <Title level={3} className="mb-2">
          Equal Employment Opportunity Management
        </Title>
        <Paragraph className="text-gray-500">
          Monitor and manage diversity, inclusion, and equal opportunity
          compliance at Nkumba University
        </Paragraph>
      </div>

      {/* Dashboard Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: 0 }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <Users size={18} className="mr-2 text-blue-500" />
                  <span className="text-gray-700 font-medium">
                    Gender Diversity
                  </span>
                </div>
              }
              value={genderPercentages.female}
              suffix="%"
              valueStyle={{ color: "#1890ff" }}
              prefix={<Text type="secondary">Female: </Text>}
            />
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>Female</Text>
                <Text>
                  {diversityStats.genderDistribution.female} (
                  {genderPercentages.female}%)
                </Text>
              </div>
              <Progress
                percent={genderPercentages.female}
                size="small"
                strokeColor="#1890ff"
              />

              <div className="flex justify-between mb-1 mt-2">
                <Text>Male</Text>
                <Text>
                  {diversityStats.genderDistribution.male} (
                  {genderPercentages.male}%)
                </Text>
              </div>
              <Progress
                percent={genderPercentages.male}
                size="small"
                strokeColor="#52c41a"
              />

              {diversityStats.genderDistribution.other > 0 && (
                <div className="flex justify-between mb-1 mt-2">
                  <Text>Other</Text>
                  <Text>
                    {diversityStats.genderDistribution.other} (
                    {genderPercentages.other}%)
                  </Text>
                </div>
              )}
              {diversityStats.genderDistribution.other > 0 && (
                <Progress
                  percent={genderPercentages.other}
                  size="small"
                  strokeColor="#722ed1"
                />
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: 0 }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <BarChart2 size={18} className="mr-2 text-green-500" />
                  <span className="text-gray-700 font-medium">
                    Age Diversity
                  </span>
                </div>
              }
              value={agePercentages.between30And50}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
              prefix={<Text type="secondary">30-50 years: </Text>}
            />
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>Under 30</Text>
                <Text>
                  {diversityStats.ageDistribution.under30} (
                  {agePercentages.under30}%)
                </Text>
              </div>
              <Progress
                percent={agePercentages.under30}
                size="small"
                strokeColor="#1890ff"
              />

              <div className="flex justify-between mb-1 mt-2">
                <Text>30-50</Text>
                <Text>
                  {diversityStats.ageDistribution.between30And50} (
                  {agePercentages.between30And50}%)
                </Text>
              </div>
              <Progress
                percent={agePercentages.between30And50}
                size="small"
                strokeColor="#52c41a"
              />

              <div className="flex justify-between mb-1 mt-2">
                <Text>Over 50</Text>
                <Text>
                  {diversityStats.ageDistribution.over50} (
                  {agePercentages.over50}%)
                </Text>
              </div>
              <Progress
                percent={agePercentages.over50}
                size="small"
                strokeColor="#722ed1"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="h-full shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: 0 }}
          >
            <Statistic
              title={
                <div className="flex items-center">
                  <PieChart size={18} className="mr-2 text-purple-500" />
                  <span className="text-gray-700 font-medium">
                    Disability Inclusion
                  </span>
                </div>
              }
              value={disabilityPercentages.withDisability}
              suffix="%"
              valueStyle={{ color: "#722ed1" }}
              prefix={<Text type="secondary">PWD: </Text>}
            />
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>With Disability</Text>
                <Text>
                  {diversityStats.disabilityStats.withDisability} (
                  {disabilityPercentages.withDisability}%)
                </Text>
              </div>
              <Progress
                percent={disabilityPercentages.withDisability}
                size="small"
                strokeColor="#722ed1"
              />

              <div className="flex justify-between mb-1 mt-2">
                <Text>Without Disability</Text>
                <Text>
                  {diversityStats.disabilityStats.withoutDisability} (
                  {disabilityPercentages.withoutDisability}%)
                </Text>
              </div>
              <Progress
                percent={disabilityPercentages.withoutDisability}
                size="small"
                strokeColor="#d9d9d9"
              />
            </div>
            <div className="mt-4">
              <Alert
                message="Disability Inclusion Target"
                description="Nkumba University aims to achieve 5% representation of persons with disabilities by 2025."
                type="info"
                showIcon
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          className="custom-tabs"
        >
          {/* Diversity Analytics Tab */}
          <TabPane
            tab={
              <span
                className="px-1"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BarChart2 size={16} className="mr-2" /> Diversity Analytics
              </span>
            }
            key="1"
          >
            <div className="mb-4">
              <Alert
                message="Diversity and Inclusion at Nkumba University"
                description="Nkumba University is committed to creating a diverse and inclusive environment for all staff and students. We monitor these metrics to ensure we are making progress towards our goals."
                type="info"
                showIcon
                className="mb-4"
              />

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-blue-500" />
                        <span>Department Distribution</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <div className="mb-4">
                      {departmentData.map((dept, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <Text>{dept.name}</Text>
                            <Text>
                              {dept.count} ({dept.percentage}%)
                            </Text>
                          </div>
                          <Progress
                            percent={dept.percentage}
                            size="small"
                            strokeColor={{
                              "0%": "#108ee9",
                              "100%": "#87d068",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <PieChart size={16} className="mr-2 text-green-500" />
                        <span>Ethnicity Distribution</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <div className="mb-4">
                      {ethnicityData.slice(0, 5).map((ethnicity, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <Text>{ethnicity.name}</Text>
                            <Text>
                              {ethnicity.count} ({ethnicity.percentage}%)
                            </Text>
                          </div>
                          <Progress
                            percent={ethnicity.percentage}
                            size="small"
                            strokeColor={{
                              "0%": "#722ed1",
                              "100%": "#1890ff",
                            }}
                          />
                        </div>
                      ))}
                      {ethnicityData.length > 5 && (
                        <div className="mt-3 text-center">
                          <Button type="link" size="small">
                            View all {ethnicityData.length} ethnicities{" "}
                            <ChevronRight size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <TrendingUp size={16} className="mr-2 text-blue-500" />
                        <span>Gender Pay Gap Analysis</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <div className="mb-4">
                      <Title level={5}>Average Salary by Gender (UGX)</Title>
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <Text>Female</Text>
                          <Text>
                            {diversityStats.payGapStats.femaleAvgSalary.toLocaleString()}
                          </Text>
                        </div>
                        <Progress
                          percent={97}
                          size="small"
                          strokeColor="#1890ff"
                        />

                        <div className="flex justify-between mb-1 mt-3">
                          <Text>Male</Text>
                          <Text>
                            {diversityStats.payGapStats.maleAvgSalary.toLocaleString()}
                          </Text>
                        </div>
                        <Progress
                          percent={100}
                          size="small"
                          strokeColor="#52c41a"
                        />
                      </div>
                      <div className="mt-4">
                        <Alert
                          message="3% Gender Pay Gap"
                          description="Nkumba University is working to eliminate the gender pay gap through regular salary reviews and adjustments."
                          type="warning"
                          showIcon
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-purple-500" />
                        <span>Leadership Diversity</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <div className="mb-4">
                      <Title level={5}>Gender Distribution in Leadership</Title>
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <Text>Female</Text>
                          <Text>{diversityStats.leadershipStats.female}%</Text>
                        </div>
                        <Progress
                          percent={diversityStats.leadershipStats.female}
                          size="small"
                          strokeColor="#1890ff"
                        />

                        <div className="flex justify-between mb-1 mt-3">
                          <Text>Male</Text>
                          <Text>{diversityStats.leadershipStats.male}%</Text>
                        </div>
                        <Progress
                          percent={diversityStats.leadershipStats.male}
                          size="small"
                          strokeColor="#52c41a"
                        />
                      </div>
                      <div className="mt-4">
                        <Alert
                          message="Leadership Diversity Target"
                          description="Nkumba University aims to achieve at least 40% female representation in leadership positions by 2025."
                          type="info"
                          showIcon
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          {/* Diversity Policies Tab */}
          <TabPane
            tab={
              <span
                className="px-1"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <FileText size={16} className="mr-2" /> Diversity Policies
              </span>
            }
            key="2"
          >
            <div className="mb-4 flex justify-between flex-wrap gap-2">
              <Space>
                <Input
                  placeholder="Search policies..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                  className="search-input"
                />
                <Button icon={<Filter size={16} />} className="filter-btn">
                  Filter
                </Button>
              </Space>
              <Space>
                <Button
                  icon={<RefreshCw size={16} />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button icon={<Download size={16} />}>Export</Button>
                <Button type="primary" icon={<Plus size={16} />}>
                  Add Policy
                </Button>
              </Space>
            </div>

            <div className="policies-list">
              {diversityPolicies.map((policy) => (
                <Card
                  key={policy.id}
                  className="mb-4 policy-card shadow-sm hover:shadow-md transition-shadow"
                  bordered={false}
                >
                  <div className="flex justify-between flex-wrap">
                    <div className="policy-info">
                      <div className="flex items-center mb-2">
                        <FileCheck size={18} className="mr-2 text-blue-500" />
                        <Title level={4} className="m-0">
                          {policy.title}
                        </Title>
                        <Tag color="success" className="ml-3">
                          Active
                        </Tag>
                      </div>
                      <Paragraph className="policy-description text-gray-600">
                        {policy.description}
                      </Paragraph>
                      <div className="policy-meta flex items-center text-gray-500 text-sm mt-2">
                        <Calendar size={14} className="mr-1" />
                        <span className="mr-4">
                          Last updated: {policy.lastUpdated}
                        </span>
                        <Clock size={14} className="mr-1" />
                        <span>Next review: {policy.reviewDate}</span>
                      </div>
                    </div>
                    <div className="policy-actions flex items-center">
                      <Space>
                        <Button
                          type="primary"
                          ghost
                          onClick={() => viewPolicyDetails(policy)}
                        >
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                        <Button>
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                      </Space>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabPane>

          {/* Diversity Trainings Tab */}
          <TabPane
            tab={
              <span
                className="px-1"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Users size={16} className="mr-2" /> Diversity Trainings
              </span>
            }
            key="3"
          >
            <div className="mb-4 flex justify-between flex-wrap gap-2">
              <Space>
                <Input
                  placeholder="Search trainings..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                  className="search-input"
                />
                <Button icon={<Filter size={16} />} className="filter-btn">
                  Filter
                </Button>
              </Space>
              <Space>
                <Button
                  icon={<RefreshCw size={16} />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={showAddTrainingModal}
                >
                  Add Training
                </Button>
              </Space>
            </div>

            <div className="trainings-list">
              {diversityTrainings.map((training) => (
                <Card
                  key={training.id}
                  className="mb-4 training-card shadow-sm hover:shadow-md transition-shadow"
                  bordered={false}
                >
                  <div className="flex justify-between flex-wrap">
                    <div className="training-info">
                      <div className="flex items-center mb-2">
                        <Users size={18} className="mr-2 text-blue-500" />
                        <Title level={4} className="m-0">
                          {training.title}
                        </Title>
                        <Tag color="processing" className="ml-3">
                          {training.status.charAt(0).toUpperCase() +
                            training.status.slice(1)}
                        </Tag>
                        {training.mandatory && (
                          <Tag color="error" className="ml-2">
                            Mandatory
                          </Tag>
                        )}
                      </div>
                      <Paragraph className="training-description text-gray-600">
                        {training.description}
                      </Paragraph>
                      <div className="training-meta flex flex-wrap items-center text-gray-500 text-sm mt-2">
                        <div className="mr-4 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{training.date}</span>
                        </div>
                        <div className="mr-4 flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>Duration: {training.duration}</span>
                        </div>
                        <div className="mr-4 flex items-center">
                          <Users size={14} className="mr-1" />
                          <span>Target: {training.targetAudience}</span>
                        </div>
                        <div className="flex items-center">
                          <FileCheck size={14} className="mr-1" />
                          <span>
                            Registered: {training.registeredParticipants}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="training-actions flex items-center">
                      <Space>
                        <Button type="primary">Register</Button>
                        <Button>
                          <Eye size={16} className="mr-1" /> Details
                        </Button>
                      </Space>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabPane>

          {/* Compliance Reports Tab */}
          <TabPane
            tab={
              <span
                className="px-1"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <TrendingUp size={16} className="mr-2" /> Compliance Reports
              </span>
            }
            key="4"
          >
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <span>EEO Compliance Status</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle
                          size={18}
                          className="text-green-500 mr-2"
                        />
                        <Text strong>Uganda Employment Act Compliance</Text>
                      </div>
                      <Paragraph className="pl-6 text-gray-600">
                        Nkumba University is fully compliant with Uganda's
                        Employment Act provisions on equal opportunity and
                        non-discrimination.
                      </Paragraph>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle
                          size={18}
                          className="text-green-500 mr-2"
                        />
                        <Text strong>
                          Persons with Disabilities Act Compliance
                        </Text>
                      </div>
                      <Paragraph className="pl-6 text-gray-600">
                        The university meets the requirements for accessibility
                        and reasonable accommodations for persons with
                        disabilities.
                      </Paragraph>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <AlertTriangle
                          size={18}
                          className="text-amber-500 mr-2"
                        />
                        <Text strong>Gender Balance Requirements</Text>
                      </div>
                      <Paragraph className="pl-6 text-gray-600">
                        The university is working towards meeting the
                        recommended 40% minimum representation of either gender
                        in leadership positions.
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-blue-500" />
                        <span>Recent Compliance Reports</span>
                      </div>
                    }
                    bordered={false}
                    className="shadow-sm"
                  >
                    <Table
                      dataSource={complianceReports}
                      columns={reportsColumns}
                      pagination={false}
                      size="middle"
                      rowKey="id"
                      className="reports-table"
                    />
                    <div className="mt-4 text-right">
                      <Button
                        type="primary"
                        icon={<Download size={16} />}
                        onClick={showGenerateReportModal}
                      >
                        Generate New Report
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Add Training Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <Plus size={18} className="mr-2 text-blue-500" />
            <span>Add Diversity Training</span>
          </div>
        }
        visible={isModalVisible}
        onOk={handleAddTraining}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        className="custom-modal"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                name="date"
                label="Training Date"
                rules={[
                  { required: true, message: "Please select training date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter training description" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter training description" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="targetAudience"
                label="Target Audience"
                rules={[
                  { required: true, message: "Please select target audience" },
                ]}
              >
                <Select placeholder="Select target audience">
                  <Option value="All Staff">All Staff</Option>
                  <Option value="Department Heads">Department Heads</Option>
                  <Option value="Faculty">Faculty</Option>
                  <Option value="Administrative Staff">
                    Administrative Staff
                  </Option>
                  <Option value="New Employees">New Employees</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration"
                rules={[{ required: true, message: "Please select duration" }]}
              >
                <Select placeholder="Select duration">
                  <Option value="1 hour">1 hour</Option>
                  <Option value="2 hours">2 hours</Option>
                  <Option value="3 hours">3 hours</Option>
                  <Option value="Half day">Half day</Option>
                  <Option value="Full day">Full day</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="facilitator"
                label="Facilitator"
                rules={[
                  { required: true, message: "Please enter facilitator name" },
                ]}
              >
                <Input placeholder="Enter facilitator name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="mandatory"
            label="Mandatory Training"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate Report Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FileText size={18} className="mr-2 text-blue-500" />
            <span>Generate Compliance Report</span>
          </div>
        }
        visible={isReportModalVisible}
        onOk={handleGenerateReport}
        onCancel={() => setIsReportModalVisible(false)}
        width={600}
        className="custom-modal"
      >
        <Form form={reportForm} layout="vertical">
          <Form.Item
            name="reportType"
            label="Report Type"
            rules={[{ required: true, message: "Please select report type" }]}
          >
            <Select placeholder="Select report type">
              <Option value="eeo">EEO Compliance Report</Option>
              <Option value="diversity">Diversity Metrics Report</Option>
              <Option value="disability">Disability Inclusion Report</Option>
              <Option value="payGap">Gender Pay Gap Analysis</Option>
              <Option value="leadership">Leadership Diversity Report</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="departments" label="Departments">
            <Select
              mode="multiple"
              placeholder="Select departments (leave empty for all)"
              optionFilterProp="children"
            >
              <Option value="all">All Departments</Option>
              <Option value="business">Faculty of Business</Option>
              <Option value="science">Faculty of Science</Option>
              <Option value="arts">Faculty of Arts</Option>
              <Option value="law">Faculty of Law</Option>
              <Option value="admin">Administration</Option>
              <Option value="support">Support Staff</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="format"
            label="Report Format"
            rules={[{ required: true, message: "Please select report format" }]}
          >
            <Select placeholder="Select format">
              <Option value="pdf">PDF Document</Option>
              <Option value="excel">Excel Spreadsheet</Option>
              <Option value="word">Word Document</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <Input.TextArea
              rows={3}
              placeholder="Enter any additional notes or requirements"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Policy Modal */}
      {selectedPolicy && (
        <Modal
          title={
            <div className="flex items-center">
              <FileCheck size={18} className="mr-2 text-blue-500" />
              <span>{selectedPolicy.title}</span>
            </div>
          }
          visible={!!selectedPolicy}
          onCancel={() => setSelectedPolicy(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedPolicy(null)}>
              Close
            </Button>,
            <Button key="edit" icon={<Edit size={16} />}>
              Edit Policy
            </Button>,
            <Button key="download" type="primary" icon={<Download size={16} />}>
              Download
            </Button>,
          ]}
          width={700}
          className="custom-modal"
        >
          <div className="policy-details">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Tag color="success">Active</Tag>
                <div className="ml-2 text-gray-500">
                  <span className="mr-2">ID: {selectedPolicy.id}</span>
                  <span>Last Updated: {selectedPolicy.lastUpdated}</span>
                </div>
              </div>
              <Divider className="my-3" />
              <Paragraph className="text-gray-700">
                {selectedPolicy.description}
              </Paragraph>
            </div>

            <div className="mb-4">
              <Title level={5}>Policy Details</Title>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">
                  <strong>Scope:</strong> This policy applies to all employees,
                  contractors, and visitors at Nkumba University.
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong> To ensure equal opportunity and fair
                  treatment for all individuals regardless of their protected
                  characteristics.
                </p>
                <p className="mb-2">
                  <strong>Legal Basis:</strong> Uganda Employment Act, Persons
                  with Disabilities Act, and other relevant legislation.
                </p>
                <p className="mb-0">
                  <strong>Next Review Date:</strong> {selectedPolicy.reviewDate}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <Title level={5}>Key Provisions</Title>
              <ul className="list-disc pl-5">
                <li className="mb-2">
                  Non-discrimination in recruitment, promotion, and all
                  employment practices
                </li>
                <li className="mb-2">
                  Equal pay for equal work regardless of gender or other
                  protected characteristics
                </li>
                <li className="mb-2">
                  Reasonable accommodations for persons with disabilities
                </li>
                <li className="mb-2">
                  Zero tolerance for harassment and discrimination
                </li>
                <li className="mb-2">
                  Commitment to diversity and inclusion in all university
                  activities
                </li>
              </ul>
            </div>

            <div>
              <Title level={5}>Responsible Parties</Title>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">
                  <strong>Policy Owner:</strong> Human Resources Department
                </p>
                <p className="mb-2">
                  <strong>Approving Authority:</strong> University Council
                </p>
                <p className="mb-0">
                  <strong>Implementation:</strong> All department heads and
                  supervisors
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <style jsx global>{`
        .equal-employment .ant-card-head {
          border-bottom: none;
          padding-bottom: 0;
        }

        .equal-employment .custom-tabs .ant-tabs-nav {
          margin-bottom: 16px;
        }

        .equal-employment .policy-card:hover,
        .equal-employment .training-card:hover {
          border-color: #1890ff;
        }

        .equal-employment .search-input .ant-input-prefix {
          color: #bfbfbf;
        }

        .equal-employment .filter-btn {
          display: flex;
          align-items: center;
        }

        .equal-employment .reports-table .ant-table-thead > tr > th {
          background-color: #f5f5f5;
        }

        .equal-employment .custom-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
