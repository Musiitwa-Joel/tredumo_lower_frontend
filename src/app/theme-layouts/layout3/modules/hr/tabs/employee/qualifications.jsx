import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const Qualifications = ({ employeeId }) => {
  const [qualifications, setQualifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQualification, setEditingQualification] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (employeeId === "1") {
      setQualifications([
        {
          id: "1",
          name: "Bachelor of Science in Computer Science",
          type: "Degree",
          institution: "Nkumba University",
          dateObtained: "2010-06-15",
        },
        {
          id: "2",
          name: "Project Management Professional (PMP)",
          type: "Certification",
          institution: "Project Management Institute",
          dateObtained: "2015-03-22",
        },
      ]);
    } else if (employeeId === "2") {
      setQualifications([
        {
          id: "1",
          name: "Master of Science in Software Engineering",
          type: "Degree",
          institution: "Makerere University",
          dateObtained: "2018-12-10",
        },
      ]);
    } else if (employeeId === "3") {
      setQualifications([
        {
          id: "1",
          name: "Bachelor of Arts in Economics",
          type: "Degree",
          institution: "Kyambogo University",
          dateObtained: "2012-07-20",
        },
      ]);
    } else if (employeeId === "4") {
      setQualifications([
        {
          id: "1",
          name: "Bachelor of Laws",
          type: "Degree",
          institution: "Uganda Christian University",
          dateObtained: "2014-05-18",
        },
      ]);
    } else if (employeeId === "5") {
      setQualifications([
        {
          id: "1",
          name: "Bachelor of Medicine and Bachelor of Surgery",
          type: "Degree",
          institution: "Gulu University",
          dateObtained: "2016-11-30",
        },
      ]);
    } else {
      setQualifications([]);
    }
  }, [employeeId]);

  const showModal = (record) => {
    setEditingQualification(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        dateObtained: dayjs(record.dateObtained),
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
        dateObtained: values.dateObtained.format("YYYY-MM-DD"),
        id: editingQualification
          ? editingQualification.id
          : Date.now().toString(),
      };

      if (editingQualification) {
        setQualifications(
          qualifications.map((q) =>
            q.id === editingQualification.id ? formattedValues : q
          )
        );
        message.success("Qualification updated successfully");
      } else {
        setQualifications([...qualifications, formattedValues]);
        message.success("Qualification added successfully");
      }

      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Qualification",
      content: "Are you sure you want to delete this qualification?",
      onOk() {
        setQualifications(qualifications.filter((q) => q.id !== id));
        message.success("Qualification deleted successfully");
      },
    });
  };

  const columns = [
    {
      title: "Qualification Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Institution",
      dataIndex: "institution",
      key: "institution",
    },
    {
      title: "Date Obtained",
      dataIndex: "dateObtained",
      key: "dateObtained",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3>Academic & Professional Qualifications</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Qualification
        </Button>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={qualifications}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={
          editingQualification ? "Edit Qualification" : "Add Qualification"
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Qualification Name"
            rules={[
              { required: true, message: "Please enter qualification name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: "Please select qualification type" },
            ]}
          >
            <Select
              placeholder="Select qualification type"
              options={[
                { value: "Degree", label: "Degree" },
                { value: "Diploma", label: "Diploma" },
                { value: "Certificate", label: "Certificate" },
                { value: "Certification", label: "Certification" },
                { value: "License", label: "License" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="institution"
            label="Institution"
            rules={[
              { required: true, message: "Please enter institution name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateObtained"
            label="Date Obtained"
            rules={[{ required: true, message: "Please select date obtained" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="attachment" label="Attachment">
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                const isValidFileType =
                  file.type === "application/pdf" ||
                  file.type.startsWith("image/");
                if (!isValidFileType) {
                  message.error("You can only upload PDF or image files!");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Document</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Qualifications;
