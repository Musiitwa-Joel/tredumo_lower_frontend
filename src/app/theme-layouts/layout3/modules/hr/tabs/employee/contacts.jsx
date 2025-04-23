import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tooltip,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import { Phone, Plus, Edit, Trash2, Mail, User, MapPin } from "lucide-react";

const { Text } = Typography;

const Contacts = ({ employeeId }) => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data based on employeeId
    const mockContacts = {
      1: [
        {
          id: "primary",
          name: "Musiitwa Joel",
          type: "Primary",
          phone: "+1 (555) 123-4567",
          email: "musiitwa.joel@example.com",
          address: "123 Main St, Anytown, USA",
        },
        {
          id: "1",
          name: "Kyali Mark",
          type: "Emergency",
          phone: "+1 (555) 987-6543",
          email: "kyali.mark@example.com",
          address: "123 Main St, Anytown, USA",
        },
        {
          id: "2",
          name: "Musimenya Joseph",
          type: "Work",
          phone: "+1 (555) 246-8135",
          email: "musimenya.joseph@example.com",
          address: "456 Corp Ave, Business City, USA",
        },
      ],
      2: [
        {
          id: "primary",
          name: "Kyali Mark",
          type: "Primary",
          phone: "+1 (555) 987-6543",
          email: "kyali.mark@example.com",
          address: "456 Oak St, Somewhere, USA",
        },
        {
          id: "1",
          name: "Kalika Joseph",
          type: "Emergency",
          phone: "+1 (555) 246-8135",
          email: "kalika.joseph@example.com",
          address: "456 Oak St, Somewhere, USA",
        },
      ],
    };
    setContacts(mockContacts[employeeId] || []);
  }, [employeeId]);

  const showModal = (contact = null) => {
    setEditingContact(contact);
    if (contact && contact.id !== "primary") {
      form.setFieldsValue(contact);
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
        id: editingContact ? editingContact.id : Date.now().toString(),
      };

      if (editingContact) {
        setContacts(
          contacts.map((contact) =>
            contact.id === editingContact.id ? formattedValues : contact
          )
        );
        message.success("Contact updated successfully");
      } else {
        setContacts([...contacts, formattedValues]);
        message.success("Contact added successfully");
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    message.success("Contact deleted successfully");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      key: "name",
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.type === "Primary" && (
            <Tag
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px", // Adds spacing between icon and text
                fontSize: "8px",
                padding: "2px 6px",
                height: "auto",
                lineHeight: "normal",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              color="blue"
            >
              Primary
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Type",
      ellipsis: true,
      dataIndex: "type",
      key: "type",
      render: (text) => {
        const color =
          text === "Emergency" ? "red" : text === "Work" ? "green" : "default";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Phone",
      ellipsis: true,

      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <Space>
          <Phone size={14} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      ellipsis: true,
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <Mail size={14} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Address",
      ellipsis: true,

      dataIndex: "address",
      key: "address",
      render: (text) => (
        <Space>
          <MapPin size={14} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {record.type !== "Primary" && (
            <>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<Edit size={14} />}
                  onClick={() => showModal(record)}
                />
              </Tooltip>
              <Popconfirm
                title="Delete Contact"
                description="Are you sure you want to delete this contact?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="text" danger icon={<Trash2 size={14} />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <User size={24} />
          <span>Contacts</span>
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => showModal()}
        >
          Add Contact
        </Button>
      }
      bordered={false}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
    >
      <Table
        size="small"
        dataSource={contacts}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={
          <Space>
            <User size={18} />
            {editingContact ? "Edit Contact" : "Add Contact"}
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter contact's name" }]}
          >
            <Input placeholder="e.g. John Doe" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Contact Type"
            rules={[{ required: true, message: "Please select contact type" }]}
          >
            <Input placeholder="e.g. Emergency, Work, Personal" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="e.g. +1 (555) 123-4567" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="e.g. john.doe@example.com" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea
              placeholder="e.g. 123 Main St, Anytown, USA"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Contacts;
