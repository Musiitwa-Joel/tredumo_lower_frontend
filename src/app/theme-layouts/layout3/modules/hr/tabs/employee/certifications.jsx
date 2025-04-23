import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Tooltip,
  Popconfirm,
  Space,
  Row,
  Col,
  Tag,
} from "antd";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const Certifications = ({ employeeId }) => {
  const [certifications, setCertifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data based on employeeId
    const mockCertifications = {
      1: [
        {
          id: "1",
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "Amazon Web Services",
          issueDate: "2022-03-15",
          expirationDate: "2025-03-15",
          credentialId: "AWS-123456",
          credentialURL:
            "https://www.credly.com/badges/aws-certified-solutions-architect",
        },
        {
          id: "2",
          name: "Certified Scrum Master",
          issuingOrganization: "Scrum Alliance",
          issueDate: "2021-06-01",
          expirationDate: "2023-06-01",
          credentialId: "CSM-789012",
          credentialURL:
            "https://www.scrumalliance.org/certifications/practitioners/certified-scrummaster-csm",
        },
      ],
      2: [
        {
          id: "1",
          name: "Project Management Professional (PMP)",
          issuingOrganization: "Project Management Institute",
          issueDate: "2020-09-10",
          expirationDate: "2023-09-10",
          credentialId: "PMP-345678",
          credentialURL:
            "https://www.pmi.org/certifications/project-management-pmp",
        },
      ],
      3: [
        {
          id: "1",
          name: "Certified Information Systems Auditor (CISA)",
          issuingOrganization: "ISACA",
          issueDate: "2021-11-20",
          expirationDate: "2024-11-20",
          credentialId: "CISA-901234",
          credentialURL: "https://www.isaca.org/credentialing/cisa",
        },
      ],
    };
    setCertifications(mockCertifications[employeeId] || []);
  }, [employeeId]);

  const showModal = (cert = null) => {
    setEditingCertification(cert);
    if (cert) {
      form.setFieldsValue({
        ...cert,
        dateRange: [dayjs(cert.issueDate), dayjs(cert.expirationDate)],
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
        issueDate: values.dateRange[0].format("YYYY-MM-DD"),
        expirationDate: values.dateRange[1].format("YYYY-MM-DD"),
        id: editingCertification
          ? editingCertification.id
          : Date.now().toString(),
      };
      delete formattedValues.dateRange;

      if (editingCertification) {
        setCertifications(
          certifications.map((cert) =>
            cert.id === editingCertification.id ? formattedValues : cert
          )
        );
        message.success("Certification updated successfully");
      } else {
        setCertifications([formattedValues, ...certifications]);
        message.success("Certification added successfully");
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
    message.success("Certification deleted successfully");
  };

  return (
    <Card
      title={
        <Space>
          <Award size={24} />
          <span>Certifications</span>
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => showModal()}
        >
          Add Certification
        </Button>
      }
      bordered={false}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
    >
      {certifications.length > 0 ? (
        <Row gutter={[16, 16]}>
          {certifications.map((cert) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={cert.id}>
              <Card
                size="small"
                title={<Title level={5}>{cert.name}</Title>}
                extra={
                  <Space>
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<Edit size={14} />}
                        onClick={() => showModal(cert)}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete Certification"
                      description="Are you sure you want to delete this certification?"
                      onConfirm={() => handleDelete(cert.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<Trash2 size={14} />} />
                    </Popconfirm>
                  </Space>
                }
                style={{ height: "100%" }}
              >
                <Space direction="vertical" size={2} style={{ width: "100%" }}>
                  <Text type="secondary">{cert.issuingOrganization}</Text>
                  <Text style={{ display: "flex", alignItems: "center" }}>
                    <Calendar
                      size={14}
                      style={{ marginRight: 8, verticalAlign: "text-bottom" }}
                    />
                    {dayjs(cert.issueDate).format("MMM YYYY")} -{" "}
                    {dayjs(cert.expirationDate).format("MMM YYYY")}
                  </Text>
                  <Text style={{ display: "flex", alignItems: "center" }}>
                    Credential ID: {cert.credentialId}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Text type="secondary">No certifications added yet</Text>
        </div>
      )}

      <Modal
        title={
          <Space>
            <Award size={18} />
            {editingCertification ? "Edit Certification" : "Add Certification"}
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Certification Name"
            rules={[
              { required: true, message: "Please enter certification name" },
            ]}
          >
            <Input placeholder="e.g. AWS Certified Solutions Architect" />
          </Form.Item>

          <Form.Item
            name="issuingOrganization"
            label="Issuing Organization"
            rules={[
              { required: true, message: "Please enter issuing organization" },
            ]}
          >
            <Input placeholder="e.g. Amazon Web Services" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Issue Date - Expiration Date"
            rules={[{ required: true, message: "Please select date range" }]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="credentialId"
            label="Credential ID"
            rules={[{ required: true, message: "Please enter credential ID" }]}
          >
            <Input placeholder="e.g. AWS-123456" />
          </Form.Item>

          <Form.Item
            name="credentialURL"
            label="Credential URL"
            rules={[{ required: true, message: "Please enter credential URL" }]}
          >
            <Input placeholder="e.g. https://www.credly.com/badges/..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Certifications;
