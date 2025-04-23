"use client";
import {
  Table,
  Space,
  Tag,
  Avatar,
  Button,
  Dropdown,
  Menu,
  Descriptions,
  Steps,
  Form,
  InputNumber,
  Input,
  DatePicker,
  Select,
  Radio,
  Card,
  Row,
  Col,
  Empty,
  message,
} from "antd";
import {
  MoreHorizontal,
  Eye,
  Edit,
  X,
  CheckCircle2,
  Clock,
  CreditCard,
  Hotel,
  Plane,
  MapPin,
  DollarSign,
  Check,
} from "lucide-react";
import { Typography } from "antd";

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

// Sample data for recent expenses
const recentExpensesData = [
  {
    key: "1",
    employee: {
      name: "Musiitwa Joel",
      avatar:
        "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
      department: "Sales",
    },
    date: "2025-03-05",
    amount: 1250.75,
    category: "Flight",
    status: "Reimbursed",
    receipt: true,
    description: "Round-trip flight to New York for client meeting",
    submittedDate: "2025-03-06",
    processedDate: "2025-03-08",
  },
  {
    key: "2",
    employee: {
      name: "Akampereza Darlington",
      avatar:
        "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000101041",
      department: "Marketing",
    },
    date: "2025-03-02",
    amount: 875.5,
    category: "Accommodation",
    status: "Pending",
    receipt: true,
    description: "Hotel stay in London for marketing conference",
    submittedDate: "2025-03-04",
    processedDate: null,
  },
  {
    key: "3",
    employee: {
      name: "Lubega Tasha Desire",
      avatar:
        "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100539",
      department: "Engineering",
    },
    date: "2025-02-28",
    amount: 320.25,
    category: "Meals",
    status: "Approved",
    receipt: true,
    description: "Team dinner with Tokyo office staff",
    submittedDate: "2025-03-01",
    processedDate: "2025-03-03",
  },
  {
    key: "4",
    employee: {
      name: "Mulinde Hakim",
      avatar: "http://199.241.139.118:9000/api/lecturer/image/NUA211",
      department: "Product",
    },
    date: "2025-02-25",
    amount: 150.0,
    category: "Transportation",
    status: "Reimbursed",
    receipt: true,
    description: "Taxi services during Paris client visit",
    submittedDate: "2025-02-26",
    processedDate: "2025-02-28",
  },
];

const ExpenseManagement = ({ viewMode, openDrawer }) => {
  // Status tag renderer with enhanced styling
  const renderStatusTag = (status) => {
    let color;
    let icon;

    switch (status) {
      case "Approved":
        color = "success";
        icon = <CheckCircle2 size={14} />;
        break;
      case "Pending":
        color = "warning";
        icon = <Clock size={14} />;
        break;
      case "Reimbursed":
        color = "success";
        icon = <CheckCircle2 size={14} />;
        break;
      default:
        color = "default";
        icon = null;
    }

    return (
      <Tag
        color={color}
        style={{ display: "flex", alignItems: "center", gap: "4px" }}
      >
        {icon} {status}
      </Tag>
    );
  };

  // Action menu for expenses
  const expenseActionMenu = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => openDrawer("viewExpense", record)}>
        <Space>
          <Eye size={14} />
          View Details
        </Space>
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => openDrawer("editExpense", record)}>
        <Space>
          <Edit size={14} />
          Edit Expense
        </Space>
      </Menu.Item>
      <Menu.Item key="approve" onClick={() => handleApproveExpense(record)}>
        <Space>
          <Check size={14} />
          Approve
        </Space>
      </Menu.Item>
      <Menu.Item key="reject" onClick={() => handleRejectExpense(record)}>
        <Space>
          <X size={14} />
          Reject
        </Space>
      </Menu.Item>
    </Menu>
  );

  // Handle approve expense
  const handleApproveExpense = (record) => {
    message.success(
      `Expense of UGX${record.amount.toFixed(2)} has been approved`
    );
    // In a real app, you would update the data here
  };

  // Handle reject expense
  const handleRejectExpense = (record) => {
    message.error(
      `Expense of UGX${record.amount.toFixed(2)} has been rejected`
    );
    // In a real app, you would update the data here
  };

  // Table columns for recent expenses with enhanced features
  const recentExpensesColumns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      render: (employee) => (
        <Space>
          <Avatar src={employee.avatar} />
          <div>
            <div>{employee.name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {employee.department}
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.employee.name.localeCompare(b.employee.name),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        let icon;
        switch (category) {
          case "Flight":
            icon = <Plane size={14} />;
            break;
          case "Accommodation":
            icon = <Hotel size={14} />;
            break;
          case "Meals":
            icon = <CreditCard size={14} />;
            break;
          case "Transportation":
            icon = <MapPin size={14} />;
            break;
          default:
            icon = <CreditCard size={14} />;
        }
        return (
          <Space>
            {icon}
            {category}
          </Space>
        );
      },
      filters: [
        { text: "Flight", value: "Flight" },
        { text: "Accommodation", value: "Accommodation" },
        { text: "Meals", value: "Meals" },
        { text: "Transportation", value: "Transportation" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Space>
          <DollarSign size={14} />
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Space>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
      filters: [
        { text: "Reimbursed", value: "Reimbursed" },
        { text: "Approved", value: "Approved" },
        { text: "Pending", value: "Pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={() => expenseActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreHorizontal size={16} />} />
        </Dropdown>
      ),
    },
  ];

  // Render card view for expenses
  const renderCardView = () => {
    return (
      <Row gutter={[16, 16]}>
        {recentExpensesData.map((expense) => (
          <Col xs={24} sm={12} md={8} lg={6} key={expense.key}>
            <Card
              hoverable
              actions={[
                <Button
                  type="text"
                  icon={<Eye size={16} />}
                  onClick={() => openDrawer("viewExpense", expense)}
                  key="view"
                >
                  View
                </Button>,
                <Button
                  type="text"
                  icon={<Edit size={16} />}
                  onClick={() => openDrawer("editExpense", expense)}
                  key="edit"
                >
                  Edit
                </Button>,
                <Button
                  type="text"
                  icon={<Check size={16} />}
                  onClick={() => handleApproveExpense(expense)}
                  key="approve"
                >
                  Approve
                </Button>,
              ]}
            >
              <div style={{ display: "flex", marginBottom: 16 }}>
                <Avatar src={expense.employee.avatar} size={64} />
                <div style={{ marginLeft: 12 }}>
                  <Text strong>{expense.employee.name}</Text>
                  <div>{expense.employee.department}</div>
                  <div style={{ marginTop: 8 }}>
                    {renderStatusTag(expense.status)}
                  </div>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Amount:</Text>
                  <Text>
                    UGX&nbsp;
                    {expense.amount !== undefined
                      ? expense.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Category:</Text>
                  <Text>{expense.category}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Date:</Text>
                  <Text>{expense.date}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Submitted:</Text>
                  <Text>{expense.submittedDate}</Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Description:</Text>
                  <div style={{ marginTop: 4 }}>{expense.description}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <>
      {viewMode === "table" ? (
        <Table
          columns={recentExpensesColumns}
          dataSource={recentExpensesData}
          size="small"
          pagination={{
            pageSize: 5,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowKey="key"
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ amount }) => {
              totalAmount += amount;
            });
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>
                    UGX&nbsp;
                    {totalAmount !== undefined
                      ? totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={3}></Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      ) : (
        renderCardView()
      )}
    </>
  );
};

// Expense Details Component
const ExpenseDetails = ({ type, record, onClose }) => {
  const [form] = Form.useForm();

  if (type === "editExpense" && record) {
    // Pre-fill the form with existing data
    form.setFieldsValue({
      amount: record.amount,
      category: record.category,
      description: record.description,
      date: record.date,
      status: record.status,
    });

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("Form values:", values);
          message.success("Expense updated successfully");
          onClose();
        }}
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please enter the amount" }]}
        >
          <InputNumber
            prefix={<DollarSign size={14} />}
            style={{ width: "100%" }}
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select>
            <Option value="Flight">Flight</Option>
            <Option value="Accommodation">Accommodation</Option>
            <Option value="Meals">Meals</Option>
            <Option value="Transportation">Transportation</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Radio.Group>
            <Radio value="Pending">Pending</Radio>
            <Radio value="Approved">Approved</Radio>
            <Radio value="Reimbursed">Reimbursed</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }

  if (!record) return <Empty description="No expense details available" />;

  return (
    <>
      <Descriptions title="Expense Information" bordered column={1}>
        <Descriptions.Item label="Employee">
          <Space>
            <Avatar src={record.employee.avatar} />
            {record.employee.name}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Department">
          {record.employee.department}
        </Descriptions.Item>
        <Descriptions.Item label="Date">{record.date}</Descriptions.Item>
        <Descriptions.Item label="Category">
          {record.category}
        </Descriptions.Item>
        <Descriptions.Item label="Amount">
          UGX&nbsp;
          {record.amount !== undefined
            ? record.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00"}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {record.description}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {renderStatusTag(record.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Receipt">
          {record.receipt ? (
            <Tag color="success">Provided</Tag>
          ) : (
            <Tag color="error">Missing</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Submitted Date">
          {record.submittedDate}
        </Descriptions.Item>
        <Descriptions.Item label="Processed Date">
          {record.processedDate || "Not processed yet"}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: "24px" }}>
        <Title level={5}>Expense Processing Steps</Title>
        <Steps
          current={
            record.status === "Reimbursed"
              ? 3
              : record.status === "Approved"
                ? 2
                : 1
          }
          size="small"
        >
          <Step title="Submitted" description={record.submittedDate} />
          <Step title="Under Review" description="Checking policy compliance" />
          <Step
            title="Approved"
            description={
              record.status === "Approved" || record.status === "Reimbursed"
                ? record.processedDate
                : "Pending"
            }
          />
          <Step
            title="Reimbursed"
            description={
              record.status === "Reimbursed" ? record.processedDate : "Pending"
            }
          />
        </Steps>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button
          onClick={() => {
            message.error(
              `Expense of UGX${record.amount.toFixed(2)} has been rejected`
            );
            onClose();
          }}
        >
          Reject
        </Button>
        <Button
          type="primary"
          onClick={() => {
            message.success(
              `Expense of UGX${record.amount.toFixed(2)} has been approved`
            );
            onClose();
          }}
        >
          Approve
        </Button>
      </div>
    </>
  );
};

// Helper function to render status tag
const renderStatusTag = (status) => {
  let color;
  let icon;

  switch (status) {
    case "Approved":
      color = "success";
      icon = <CheckCircle2 size={14} />;
      break;
    case "Pending":
      color = "warning";
      icon = <Clock size={14} />;
      break;
    case "Reimbursed":
      color = "success";
      icon = <CheckCircle2 size={14} />;
      break;
    default:
      color = "default";
      icon = null;
  }

  return (
    <Tag
      color={color}
      style={{ display: "flex", alignItems: "center", gap: "4px" }}
    >
      {icon} {status}
    </Tag>
  );
};

ExpenseManagement.Details = ExpenseDetails;

export default ExpenseManagement;
