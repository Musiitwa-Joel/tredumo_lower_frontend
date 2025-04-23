import { useState, useEffect } from "react";
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
  Select,
} from "antd";
import { Users, Plus, Edit, Trash2, Calendar, Heart } from "lucide-react";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

const relationshipTypes = ["Spouse", "Child", "Parent", "Sibling", "Other"];

const Dependents = ({ employeeId }) => {
  const [dependents, setDependents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDependent, setEditingDependent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data based on employeeId
    const mockDependents = {
      1: [
        {
          id: "1",
          name: "Jane Doe",
          relationship: "Spouse",
          dateOfBirth: "1985-05-15",
        },
        {
          id: "2",
          name: "John Doe Jr.",
          relationship: "Child",
          dateOfBirth: "2010-03-20",
        },
      ],
      2: [
        {
          id: "1",
          name: "Alice Smith",
          relationship: "Child",
          dateOfBirth: "2015-11-10",
        },
      ],
      3: [
        {
          id: "1",
          name: "Robert Johnson",
          relationship: "Parent",
          dateOfBirth: "1955-08-22",
        },
      ],
    };
    setDependents(mockDependents[employeeId] || []);
  }, [employeeId]);

  const showModal = (dependent = null) => {
    setEditingDependent(dependent);
    if (dependent) {
      form.setFieldsValue({
        ...dependent,
        dateOfBirth: dayjs(dependent.dateOfBirth),
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
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        id: editingDependent ? editingDependent.id : Date.now().toString(),
      };

      if (editingDependent) {
        setDependents(
          dependents.map((dep) =>
            dep.id === editingDependent.id ? formattedValues : dep
          )
        );
        message.success("Dependent updated successfully");
      } else {
        setDependents([formattedValues, ...dependents]);
        message.success("Dependent added successfully");
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setDependents(dependents.filter((dep) => dep.id !== id));
    message.success("Dependent deleted successfully");
  };

  return (
    <Card
      title={
        <Space>
          <Users size={24} />
          <span>Dependents</span>
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => showModal()}
        >
          Add Dependent
        </Button>
      }
      bordered={false}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
    >
      {dependents.length > 0 ? (
        <Row gutter={[16, 16]}>
          {dependents.map((dep) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={dep.id}>
              <Card
                size="small"
                title={<Title level={5}>{dep.name}</Title>}
                extra={
                  <Space>
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<Edit size={14} />}
                        onClick={() => showModal(dep)}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete Dependent"
                      description="Are you sure you want to delete this dependent?"
                      onConfirm={() => handleDelete(dep.id)}
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
                  <Text style={{ display: "flex", alignItems: "center" }}>
                    <Heart
                      size={14}
                      style={{ marginRight: 8, verticalAlign: "text-bottom" }}
                    />
                    {dep.relationship}
                  </Text>
                  <Text style={{ display: "flex", alignItems: "center" }}>
                    <Calendar
                      size={14}
                      style={{ marginRight: 8, verticalAlign: "text-bottom" }}
                    />
                    {dayjs(dep.dateOfBirth).format("MMMM D, YYYY")}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Text type="secondary">No dependents added yet</Text>
        </div>
      )}

      <Modal
        title={
          <Space>
            <Users size={18} />
            {editingDependent ? "Edit Dependent" : "Add Dependent"}
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter dependent's name" },
            ]}
          >
            <Input placeholder="e.g. John Doe" />
          </Form.Item>

          <Form.Item
            name="relationship"
            label="Relationship"
            rules={[{ required: true, message: "Please select relationship" }]}
          >
            <Select placeholder="Select relationship">
              {relationshipTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Dependents;
