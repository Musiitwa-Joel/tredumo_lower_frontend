import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Popconfirm,
  Space,
  Row,
  Col,
} from "antd";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  School,
  BookOpen,
  Award,
  Calendar,
  MapPin,
} from "lucide-react";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const educationLevels = [
  "Primary",
  "Secondary",
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
];

const Education = ({ employeeId }) => {
  const [education, setEducation] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data based on employeeId
    const mockEducation = [
      {
        id: "5",
        level: "Master's",
        institution: "University of Nairobi",
        fieldOfStudy: "Information Technology",
        startDate: "2018-09-01",
        endDate: "2020-06-30",
        location: "Nairobi, Kenya",
      },
      {
        id: "4",
        level: "Bachelor's",
        institution: "Makerere University",
        fieldOfStudy: "Computer Science",
        startDate: "2013-09-01",
        endDate: "2017-06-30",
        location: "Kampala, Uganda",
      },
      {
        id: "3",
        level: "High School",
        institution: "Kampala Advanced School",
        fieldOfStudy: "Science and Mathematics",
        startDate: "2011-01-01",
        endDate: "2012-12-31",
        location: "Kampala, Uganda",
      },
      {
        id: "2",
        level: "Secondary",
        institution: "Kampala High School",
        fieldOfStudy: "General Education",
        startDate: "2007-01-01",
        endDate: "2010-12-31",
        location: "Kampala, Uganda",
      },
      {
        id: "1",
        level: "Primary",
        institution: "Kampala Primary School",
        fieldOfStudy: "General Education",
        startDate: "2000-01-01",
        endDate: "2006-12-31",
        location: "Kampala, Uganda",
      },
    ];
    setEducation(mockEducation);
  }, [employeeId]);

  const showModal = (edu = null) => {
    setEditingEducation(edu);
    if (edu) {
      form.setFieldsValue({
        ...edu,
        dateRange: [dayjs(edu.startDate), dayjs(edu.endDate)],
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        id: editingEducation ? editingEducation.id : Date.now().toString(),
      };
      delete formattedValues.dateRange;

      if (editingEducation) {
        setEducation(
          education.map((edu) =>
            edu.id === editingEducation.id ? formattedValues : edu
          )
        );
        message.success("Education record updated successfully");
      } else {
        setEducation([formattedValues, ...education]);
        message.success("Education record added successfully");
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setEducation(education.filter((edu) => edu.id !== id));
    message.success("Education record deleted successfully");
  };

  const getEducationIcon = (level) => {
    switch (level) {
      case "Primary":
      case "Secondary":
        return <School size={24} />;
      case "High School":
        return <BookOpen size={24} />;
      case "Bachelor's":
      case "Master's":
      case "PhD":
        return <GraduationCap size={24} />;
      default:
        return <Award size={24} />;
    }
  };

  const getColor = (level) => {
    switch (level) {
      case "Primary":
        return "#91d5ff";
      case "Secondary":
        return "#b7eb8f";
      case "High School":
        return "#87e8de";
      case "Bachelor's":
        return "#ffd591";
      case "Master's":
        return "#ff9c6e";
      case "PhD":
        return "#ff7875";
      default:
        return "#d3adf7";
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <GraduationCap size={24} style={{ marginRight: 8 }} />
          <span>Education</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => showModal()}
        >
          Add Education
        </Button>
      }
      bordered={false}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
    >
      {education.length > 0 ? (
        <Row gutter={[16, 16]}>
          {education.map((edu) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={edu.id}>
              <Card
                size="small"
                title={
                  <Space align="center">
                    {getEducationIcon(edu.level)}
                    <Text strong>{edu.level}</Text>
                  </Space>
                }
                extra={
                  <Space>
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<Edit size={14} />}
                        onClick={() => showModal(edu)}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete Education Record"
                      description="Are you sure you want to delete this education record?"
                      onConfirm={() => handleDelete(edu.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<Trash2 size={14} />} />
                    </Popconfirm>
                  </Space>
                }
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: `4px solid ${getColor(edu.level)}`,
                }}
                bodyStyle={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Title level={5}>{edu.institution}</Title>
                  <Text type="secondary">{edu.fieldOfStudy}</Text>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Space direction="vertical" size={2}>
                    <Text style={{ display: "flex", alignItems: "center" }}>
                      <Calendar
                        size={14}
                        style={{ marginRight: 8, verticalAlign: "text-bottom" }}
                      />
                      {dayjs(edu.startDate).format("MMM YYYY")} -{" "}
                      {dayjs(edu.endDate).format("MMM YYYY")}
                    </Text>
                    <Text style={{ display: "flex", alignItems: "center" }}>
                      <MapPin
                        size={14}
                        style={{ marginRight: 8, verticalAlign: "text-bottom" }}
                      />
                      {edu.location}
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Text type="secondary">No education records added yet</Text>
        </div>
      )}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <GraduationCap size={18} style={{ marginRight: 8 }} />
            {editingEducation ? "Edit Education" : "Add Education"}
          </div>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="level"
            label="Education Level"
            rules={[
              { required: true, message: "Please select education level" },
            ]}
          >
            <Select placeholder="Select education level">
              {educationLevels.map((level) => (
                <Option key={level} value={level}>
                  {level}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="institution"
            label="Institution"
            rules={[
              { required: true, message: "Please enter institution name" },
            ]}
          >
            <Input placeholder="e.g. Makerere University" />
          </Form.Item>

          <Form.Item
            name="fieldOfStudy"
            label="Field of Study"
            rules={[{ required: true, message: "Please enter field of study" }]}
          >
            <Input placeholder="e.g. Computer Science" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Study Period"
            rules={[{ required: true, message: "Please select study period" }]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="e.g. Kampala, Uganda" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Education;
