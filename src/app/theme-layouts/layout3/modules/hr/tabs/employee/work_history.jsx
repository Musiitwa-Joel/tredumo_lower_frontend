import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Checkbox,
  message,
  Typography,
  Card,
  Tag,
  Tooltip,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  Plus,
  Trash2,
  Edit,
  Building2,
  Calendar,
  FileText,
  Clock,
  MapPin,
} from "lucide-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Title, Text, Paragraph } = Typography;

const WorkHistory = ({ employeeId }) => {
  const [workHistory, setWorkHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [currentJob, setCurrentJob] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (employeeId === "1") {
      setWorkHistory([
        {
          id: "1",
          company: "Tech Solutions Ltd",
          position: "Senior Software Developer",
          location: "Kampala, Uganda",
          startDate: "2018-03-15",
          endDate: "2023-01-10",
          responsibilities:
            "Led development team, implemented new features, mentored junior developers. Managed project timelines and client expectations. Implemented CI/CD pipelines and improved code quality standards.",
          achievements:
            "Reduced application load time by 40%, Increased test coverage to 85%, Led successful migration to microservices architecture",
          isCurrentJob: false,
        },
        {
          id: "2",
          company: "Digital Innovations",
          position: "Software Developer",
          location: "Entebbe, Uganda",
          startDate: "2015-06-20",
          endDate: "2018-02-28",
          responsibilities:
            "Developed web applications, maintained existing systems, collaborated with design team. Participated in code reviews and sprint planning.",
          achievements:
            "Developed key features that increased user engagement by 25%, Optimized database queries reducing response time by 30%",
          isCurrentJob: false,
        },
      ]);
    } else if (employeeId === "2") {
      setWorkHistory([
        {
          id: "1",
          company: "Global Tech",
          position: "Project Manager",
          location: "Kampala, Uganda",
          startDate: "2019-08-01",
          endDate: null,
          responsibilities:
            "Managing software development projects, client communication, resource allocation. Overseeing project budgets and timelines.",
          achievements:
            "Delivered 12 projects on time and within budget, Improved team productivity by 20%",
          isCurrentJob: true,
        },
        {
          id: "2",
          company: "Software Solutions Inc",
          position: "Team Lead",
          location: "Jinja, Uganda",
          startDate: "2016-04-15",
          endDate: "2019-07-25",
          responsibilities:
            "Led development team, code reviews, sprint planning. Coordinated with stakeholders and managed project deliverables.",
          achievements:
            "Successfully migrated legacy system to modern architecture, Reduced bug rate by 35%",
          isCurrentJob: false,
        },
      ]);
    } else if (employeeId === "3") {
      setWorkHistory([
        {
          id: "1",
          company: "Finance Partners",
          position: "Financial Analyst",
          location: "Kampala, Uganda",
          startDate: "2017-02-10",
          endDate: null,
          responsibilities:
            "Financial reporting, budget analysis, investment research. Preparing quarterly financial statements and forecasts.",
          achievements:
            "Identified cost-saving opportunities worth $50,000 annually, Improved financial reporting accuracy by 15%",
          isCurrentJob: true,
        },
      ]);
    } else if (employeeId === "4") {
      setWorkHistory([
        {
          id: "1",
          company: "Legal Associates",
          position: "Legal Counsel",
          location: "Kampala, Uganda",
          startDate: "2018-09-05",
          endDate: "2022-11-30",
          responsibilities:
            "Contract review, legal advisory, compliance monitoring. Representing the company in legal proceedings.",
          achievements:
            "Successfully resolved 3 major legal disputes, Implemented compliance program that reduced legal risks",
          isCurrentJob: false,
        },
      ]);
    } else if (employeeId === "5") {
      setWorkHistory([
        {
          id: "1",
          company: "City Hospital",
          position: "Medical Officer",
          location: "Kampala, Uganda",
          startDate: "2019-01-15",
          endDate: null,
          responsibilities:
            "Patient care, medical procedures, health education. Coordinating with nursing staff and specialists.",
          achievements:
            "Improved patient satisfaction scores by 25%, Implemented new treatment protocols that reduced recovery time",
          isCurrentJob: true,
        },
      ]);
    } else {
      setWorkHistory([]);
    }
  }, [employeeId]);

  const calculateDuration = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();

    const years = end.diff(start, "year");
    const months = end.diff(start, "month") % 12;

    let result = "";
    if (years > 0) {
      result += `${years} ${years === 1 ? "year" : "years"}`;
    }
    if (months > 0 || years === 0) {
      if (years > 0) result += " ";
      result += `${months} ${months === 1 ? "month" : "months"}`;
    }

    return result;
  };

  const showModal = (record) => {
    setEditingJob(record || null);
    setCurrentJob(record?.isCurrentJob || false);

    if (record) {
      form.setFieldsValue({
        ...record,
        dateRange: record.endDate
          ? [dayjs(record.startDate), dayjs(record.endDate)]
          : [dayjs(record.startDate), null],
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setCurrentJob(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        company: values.company,
        position: values.position,
        location: values.location,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: currentJob ? null : values.dateRange[1]?.format("YYYY-MM-DD"),
        responsibilities: values.responsibilities,
        achievements: values.achievements,
        isCurrentJob: currentJob,
        id: editingJob ? editingJob.id : Date.now().toString(),
      };

      if (editingJob) {
        setWorkHistory(
          workHistory.map((job) =>
            job.id === editingJob.id ? formattedValues : job
          )
        );
        message.success("Work history updated successfully");
      } else {
        setWorkHistory([...workHistory, formattedValues]);
        message.success("Work history added successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setCurrentJob(false);
    });
  };

  const handleDelete = (id) => {
    setWorkHistory(workHistory.filter((job) => job.id !== id));
    message.success("Work history deleted successfully");
  };

  const formatDateRange = (startDate, endDate, isCurrentJob) => {
    if (isCurrentJob) {
      return `${dayjs(startDate).format("MMM YYYY")} - Present`;
    }
    return `${dayjs(startDate).format("MMM YYYY")} - ${dayjs(endDate).format("MMM YYYY")}`;
  };

  const renderExpandedRow = (record) => {
    return (
      <div className="expanded-row-content" style={{ padding: "0 20px 20px" }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5}>Responsibilities</Title>
            <Paragraph>{record.responsibilities}</Paragraph>
          </Col>
          {record.achievements && (
            <Col span={24}>
              <Title level={5}>Key Achievements</Title>
              <ul style={{ paddingLeft: 20 }}>
                {record.achievements.split(",").map((achievement, index) => (
                  <li key={index}>
                    <Paragraph>{achievement.trim()}</Paragraph>
                  </li>
                ))}
              </ul>
            </Col>
          )}
        </Row>
      </div>
    );
  };

  const columns = [
    {
      title: "Company & Position",
      key: "companyInfo",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: getAvatarColor(record.company),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Building2 size={24} color="white" />
          </div>
          <div>
            <Text strong style={{ fontSize: "16px" }}>
              {record.position}
            </Text>
            <div>
              <Text>{record.company}</Text>
              {record.isCurrentJob && (
                <Tag color="green" style={{ marginLeft: 8 }}>
                  Current
                </Tag>
              )}
            </div>
            {record.location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              >
                <MapPin size={12} style={{ marginRight: 4 }} />
                {record.location}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      width: 200,
      render: (_, record) => (
        <div>
          <div>
            <Calendar size={14} style={{ marginRight: 8 }} />
            {formatDateRange(
              record.startDate,
              record.endDate,
              record.isCurrentJob
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 4,
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.65)",
            }}
          >
            <Clock size={12} style={{ marginRight: 4 }} />
            {calculateDuration(record.startDate, record.endDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Work History"
            description="Are you sure you want to delete this work history entry?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<Trash2 size={16} />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Generate a consistent color based on company name
  const getAvatarColor = (companyName) => {
    const colors = [
      "#1890ff",
      "#52c41a",
      "#faad14",
      "#f5222d",
      "#722ed1",
      "#13c2c2",
      "#eb2f96",
      "#fa8c16",
    ];

    let hash = 0;
    for (let i = 0; i < companyName.length; i++) {
      hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileText size={20} style={{ marginRight: 8 }} />
          <span>Employment History</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => showModal()}
        >
          Add Work Experience
        </Button>
      }
      bordered={false}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
    >
      {workHistory.length > 0 ? (
        <Table
          columns={columns}
          dataSource={workHistory}
          rowKey="id"
          pagination={false}
          expandable={{
            expandedRowRender: renderExpandedRow,
            expandRowByClick: true,
          }}
          style={{ marginTop: 16 }}
        />
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Text type="secondary">No work history records found</Text>
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => showModal()}
            >
              Add Work Experience
            </Button>
          </div>
        </div>
      )}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Building2 size={18} style={{ marginRight: 8 }} />
            {editingJob ? "Edit Work Experience" : "Add Work Experience"}
          </div>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={700}
        bodyStyle={{ maxHeight: "70vh", overflow: "auto", padding: "24px" }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Company Name"
                rules={[
                  { required: true, message: "Please enter company name" },
                ]}
              >
                <Input
                  prefix={<Building2 size={16} />}
                  placeholder="e.g. Acme Corporation"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="position"
                label="Position/Title"
                rules={[{ required: true, message: "Please enter position" }]}
              >
                <Input placeholder="e.g. Senior Developer" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter job location" }]}
          >
            <Input
              prefix={<MapPin size={16} />}
              placeholder="e.g. Kampala, Uganda"
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Employment Period"
            rules={[
              {
                required: true,
                message: "Please select employment period",
              },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              disabled={[false, currentJob]}
              placeholder={["Start Date", currentJob ? "Present" : "End Date"]}
            />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={currentJob}
              onChange={(e) => setCurrentJob(e.target.checked)}
            >
              This is my current job
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="responsibilities"
            label="Responsibilities"
            rules={[
              { required: true, message: "Please enter job responsibilities" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your main duties and responsibilities in this role"
            />
          </Form.Item>

          <Form.Item
            name="achievements"
            label="Key Achievements"
            tooltip="List your achievements separated by commas"
          >
            <TextArea
              rows={3}
              placeholder="e.g. Increased sales by 20%, Reduced costs by 15%, Led team of 5 developers"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default WorkHistory;
