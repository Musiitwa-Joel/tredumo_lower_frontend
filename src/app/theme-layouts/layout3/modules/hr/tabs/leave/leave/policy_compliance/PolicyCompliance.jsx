import React from "react";
import { useState } from "react";
import {
  Tabs,
  Card,
  Typography,
  Layout,
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { TabPane } = Tabs;
const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const LeaveComplianceModule = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout
      className="site-layout-background"
      style={{ padding: "24px 0", background: "#fff" }}
    >
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <Title level={2}>Leave Compliance & Policy Enforcement</Title>
        <Card>
          <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
            <TabPane tab="Leave Policies" key="1">
              <LeavePoliciesTab />
            </TabPane>
            <TabPane tab="Approval Rules" key="2">
              <ApprovalRulesTab />
            </TabPane>
            <TabPane tab="Blackout Periods" key="3">
              <BlackoutPeriodsTab />
            </TabPane>
            <TabPane tab="Leave Deductions" key="4">
              <LeaveDeductionsTab />
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
};

// Leave Policies Tab
const LeavePoliciesTab = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      department: "Engineering",
      employeeLevel: "Senior",
      maxConsecutiveDays: 15,
      annualQuota: 25,
    },
    {
      id: 2,
      department: "Marketing",
      employeeLevel: "Junior",
      maxConsecutiveDays: 10,
      annualQuota: 20,
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPolicy, setEditingPolicy] =
    (useState < LeavePolicy) | (null > null);
  const [form] = Form.useForm();

  const columns = [
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Employee Level",
      dataIndex: "employeeLevel",
      key: "employeeLevel",
    },
    {
      title: "Max Consecutive Days",
      dataIndex: "maxConsecutiveDays",
      key: "maxConsecutiveDays",
    },
    { title: "Annual Quota", dataIndex: "annualQuota", key: "annualQuota" },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this policy?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingPolicy(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setPolicies(policies.filter((policy) => policy.id !== id));
    message.success("Policy deleted successfully");
  };

  const handleAdd = () => {
    setEditingPolicy(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingPolicy) {
        setPolicies(
          policies.map((policy) =>
            policy.id === editingPolicy.id ? { ...policy, ...values } : policy
          )
        );
        message.success("Policy updated successfully");
      } else {
        const newPolicy = {
          id: Math.max(...policies.map((p) => p.id)) + 1,
          ...values,
        };
        setPolicies([...policies, newPolicy]);
        message.success("New policy added successfully");
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add New Policy
      </Button>
      <Table columns={columns} dataSource={policies} rowKey="id" />
      <Modal
        title={editingPolicy ? "Edit Leave Policy" : "Add New Leave Policy"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="employeeLevel"
            label="Employee Level"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Junior">Junior</Option>
              <Option value="Mid-level">Mid-level</Option>
              <Option value="Senior">Senior</Option>
              <Option value="Manager">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="maxConsecutiveDays"
            label="Max Consecutive Days"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={30} />
          </Form.Item>
          <Form.Item
            name="annualQuota"
            label="Annual Quota"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={50} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Approval Rules Tab
const ApprovalRulesTab = () => {
  const [rules, setRules] = useState([
    { id: 1, leaveType: "Casual", maxDays: 2, autoApprove: true },
    { id: 2, leaveType: "Sick", maxDays: 3, autoApprove: false },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] =
    (useState < ApprovalRule) | (null > null);
  const [form] = Form.useForm();

  const columns = [
    { title: "Leave Type", dataIndex: "leaveType", key: "leaveType" },
    {
      title: "Max Days for Auto-Approval",
      dataIndex: "maxDays",
      key: "maxDays",
    },
    {
      title: "Auto-Approve",
      dataIndex: "autoApprove",
      key: "autoApprove",
      render: (autoApprove, record) => (
        <Switch
          checked={autoApprove}
          onChange={(checked) => handleToggleAutoApprove(record.id, checked)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditRule(record)}
        />
      ),
    },
  ];

  const handleToggleAutoApprove = (id, checked) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, autoApprove: checked } : rule
      )
    );
    message.success(
      `Auto-approve ${checked ? "enabled" : "disabled"} for ${
        rules.find((r) => r.id === id)?.leaveType
      } leave`
    );
  };

  const handleEditRule = (record) => {
    setEditingRule(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      setRules(
        rules.map((rule) =>
          rule.id === editingRule?.id ? { ...rule, ...values } : rule
        )
      );
      setIsModalVisible(false);
      message.success("Rule updated successfully");
    });
  };

  return (
    <div>
      <Table columns={columns} dataSource={rules} rowKey="id" />
      <Modal
        title="Edit Approval Rule"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="leaveType"
            label="Leave Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maxDays"
            label="Max Days for Auto-Approval"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={30} />
          </Form.Item>
          <Form.Item
            name="autoApprove"
            label="Auto-Approve"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Blackout Periods Tab
const BlackoutPeriodsTab = () => {
  const [blackoutPeriods, setBlackoutPeriods] = useState([
    {
      id: 1,
      name: "End of Year",
      startDate: "2023-12-20",
      endDate: "2024-01-05",
    },
    {
      id: 2,
      name: "Summer Exams",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPeriod, setEditingPeriod] =
    (useState < BlackoutPeriod) | (null > null);
  const [form] = Form.useForm();

  const columns = [
    { title: "Period Name", dataIndex: "name", key: "name" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPeriod(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this blackout period?"
            onConfirm={() => handleDeletePeriod(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleEditPeriod = (record) => {
    setEditingPeriod(record);
    form.setFieldsValue({
      ...record,
      dateRange: [moment(record.startDate), moment(record.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDeletePeriod = (id) => {
    setBlackoutPeriods(blackoutPeriods.filter((period) => period.id !== id));
    message.success("Blackout period deleted successfully");
  };

  const handleAddPeriod = () => {
    setEditingPeriod(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const [startDate, endDate] = values.dateRange.map((date) =>
        date.format("YYYY-MM-DD")
      );
      const newPeriod = {
        id: editingPeriod
          ? editingPeriod.id
          : Math.max(...blackoutPeriods.map((p) => p.id)) + 1,
        name: values.name,
        startDate,
        endDate,
      };

      if (editingPeriod) {
        setBlackoutPeriods(
          blackoutPeriods.map((period) =>
            period.id === editingPeriod.id ? newPeriod : period
          )
        );
        message.success("Blackout period updated successfully");
      } else {
        setBlackoutPeriods([...blackoutPeriods, newPeriod]);
        message.success("New blackout period added successfully");
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        onClick={handleAddPeriod}
        style={{ marginBottom: 16 }}
      >
        Add Blackout Period
      </Button>
      <Table columns={columns} dataSource={blackoutPeriods} rowKey="id" />
      <Modal
        title={
          editingPeriod ? "Edit Blackout Period" : "Add New Blackout Period"
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Period Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true }]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Leave Deductions Tab
const LeaveDeductionsTab = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] =
    useState <
    LeaveDeductionSettings >
    {
      unpaidLeaveDeduction: 100,
      excessLeaveHandling: "deduct",
      alertThreshold: 80,
    };

  const onFinish = (values) => {
    setSettings(values);
    message.success("Leave deduction settings updated successfully");
  };

  return (
    <Card title="Leave Deduction Settings">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={settings}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unpaidLeaveDeduction"
              label="Unpaid Leave Deduction (% of daily salary)"
              rules={[{ required: true, type: "number", min: 0, max: 100 }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="excessLeaveHandling"
              label="Excess Leave Handling"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="deduct">Deduct from next year's quota</Option>
                <Option value="unpaid">Convert to unpaid leave</Option>
                <Option value="deny">Deny application</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="alertThreshold"
              label="Alert Threshold (% of total leave quota)"
              rules={[{ required: true, type: "number", min: 0, max: 100 }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LeaveComplianceModule;
