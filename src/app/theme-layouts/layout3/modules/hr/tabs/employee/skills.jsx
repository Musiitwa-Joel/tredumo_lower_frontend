"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Input,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Select,
  message,
  Tooltip,
  Popconfirm,
} from "antd";
import { Plus, Edit, Trash2, FileText } from "lucide-react";

const { Text } = Typography;
const { Option } = Select;

const skillCategories = [
  "Technical",
  "Soft Skills",
  "Languages",
  "Tools",
  "Frameworks",
  "Other",
];

const Skills = ({ employeeId }) => {
  const [skills, setSkills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data based on employeeId
    if (employeeId === "1") {
      setSkills([
        { id: "1", name: "React", category: "Frameworks", level: "Expert" },
        { id: "2", name: "Node.js", category: "Technical", level: "Advanced" },
        {
          id: "3",
          name: "TypeScript",
          category: "Technical",
          level: "Intermediate",
        },
        {
          id: "4",
          name: "Team Leadership",
          category: "Soft Skills",
          level: "Advanced",
        },
      ]);
    } else if (employeeId === "2") {
      setSkills([
        {
          id: "1",
          name: "Project Management",
          category: "Soft Skills",
          level: "Expert",
        },
        {
          id: "2",
          name: "Agile Methodologies",
          category: "Tools",
          level: "Advanced",
        },
        { id: "3", name: "Java", category: "Technical", level: "Advanced" },
      ]);
    } else {
      setSkills([]);
    }
  }, [employeeId]);

  const showModal = (skill = null) => {
    setEditingSkill(skill);
    if (skill) {
      form.setFieldsValue(skill);
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
      if (editingSkill) {
        setSkills(
          skills.map((skill) =>
            skill.id === editingSkill.id ? { ...values, id: skill.id } : skill
          )
        );
        message.success("Skill updated successfully");
      } else {
        const newSkill = { ...values, id: Date.now().toString() };
        setSkills([...skills, newSkill]);
        message.success("Skill added successfully");
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
    message.success("Skill deleted successfully");
  };

  const getTagColor = (level) => {
    switch (level) {
      case "Beginner":
        return "blue";
      case "Intermediate":
        return "green";
      case "Advanced":
        return "orange";
      case "Expert":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileText size={20} style={{ marginRight: 8 }} />
          <span>Skills</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => showModal()}
        >
          Add Skill
        </Button>
      }
      bordered={false}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
    >
      {skills.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {skills.map((skill) => (
            <Tag
              key={skill.id}
              color={getTagColor(skill.level)}
              style={{ padding: "1px 4px", marginBottom: "8px" }}
            >
              <Space>
                <span>{skill.name}</span>
                <Tooltip title="Edit">
                  <Edit
                    size={12}
                    style={{ cursor: "pointer" }}
                    onClick={() => showModal(skill)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete Skill"
                  description="Are you sure you want to delete this skill?"
                  onConfirm={() => handleDelete(skill.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Delete">
                    <Trash2 size={12} style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Popconfirm>
              </Space>
            </Tag>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Text type="secondary">No skills added yet</Text>
        </div>
      )}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <FileText size={18} style={{ marginRight: 8 }} />
            {editingSkill ? "Edit Skill" : "Add Skill"}
          </div>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Skill Name"
            rules={[{ required: true, message: "Please enter skill name" }]}
          >
            <Input placeholder="e.g. React, Project Management, Spanish" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              {skillCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="Proficiency Level"
            rules={[
              { required: true, message: "Please select proficiency level" },
            ]}
          >
            <Select placeholder="Select proficiency level">
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="Expert">Expert</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Skills;
