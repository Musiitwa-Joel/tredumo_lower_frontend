import { useState } from "react";
import {
  Table,
  Space,
  Tag,
  Avatar,
  Progress,
  Button,
  Dropdown,
  Menu,
  Descriptions,
  Timeline,
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Empty,
  message,
  Badge,
  Steps,
} from "antd";
import {
  MoreHorizontal,
  Eye,
  Edit,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Briefcase,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Typography } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

// Sample data for upcoming trips
const upcomingTripsData = [
  {
    key: "1",
    employee: {
      name: "Prof. Jude Lubega",
      avatar: "http://199.241.139.118:9000/api/lecturer/image/NUA213",
      department: "Management",
    },
    destination: "New York, USA",
    departure: "2025-03-15",
    return: "2025-03-20",
    status: "Approved",
    purpose: "Board Meeting",
    budget: 3500,
    expenses: 0,
    progress: 25,
    expenseReportSubmitted: false,
  },
  {
    key: "2",
    employee: {
      name: "Mr. Bekalaze Richard",
      avatar: "http://199.241.139.118:9000/api/lecturer/image/NUL484",
      department: "Marketing",
    },
    destination: "London, UK",
    departure: "2025-03-18",
    return: "2025-03-25",
    status: "Pending",
    purpose: "Conference",
    budget: 5200,
    expenses: 0,
    progress: 10,
    expenseReportSubmitted: false,
  },
  {
    key: "3",
    employee: {
      name: "MR. Kamusiime Christopher",
      avatar: "http://199.241.139.118:9000/api/lecturer/image/NUL277",
      department: "Engineering",
    },
    destination: "Tokyo, Japan",
    departure: "2025-02-20",
    return: "2025-02-28",
    status: "Completed",
    purpose: "Training",
    budget: 6800,
    expenses: 5900,
    progress: 100,
    expenseReportSubmitted: true,
  },
  {
    key: "4",
    employee: {
      name: "Mr. Hakim Mulinde",
      avatar: "http://199.241.139.118:9000/api/lecturer/image/NUA211",
      department: "Product",
    },
    destination: "Paris, France",
    departure: "2025-02-10",
    return: "2025-02-15",
    status: "Completed",
    purpose: "Client Meeting",
    budget: 4200,
    expenses: 0,
    progress: 100,
    expenseReportSubmitted: false,
  },
];

// Helper function to render status tag - defined at module level
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
    case "Completed":
      color = "blue";
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

const TripManagement = ({ viewMode, openDrawer }) => {
  const [trips, setTrips] = useState(upcomingTripsData);
  const [filterReturned, setFilterReturned] = useState(false);

  // Check if a trip is returned (past return date)
  const isReturned = (trip) => {
    const today = new Date();
    const returnDate = new Date(trip.return);
    return returnDate < today;
  };

  // Action menu for trips
  const tripActionMenu = (record) => {
    const returned = isReturned(record);

    return (
      <Menu>
        <Menu.Item key="view" onClick={() => openDrawer("viewTrip", record)}>
          <Space>
            <Eye size={14} />
            View Details
          </Space>
        </Menu.Item>
        <Menu.Item key="edit" onClick={() => openDrawer("editTrip", record)}>
          <Space>
            <Edit size={14} />
            Edit Trip
          </Space>
        </Menu.Item>
        {!returned && (
          <Menu.Item key="cancel" onClick={() => handleCancelTrip(record)}>
            <Space>
              <X size={14} />
              Cancel Trip
            </Space>
          </Menu.Item>
        )}
        {returned && !record.expenseReportSubmitted && (
          <Menu.Item
            key="expense"
            onClick={() => openDrawer("submitExpenseReport", record)}
          >
            <Space>
              <FileText size={14} />
              Submit Expense Report
            </Space>
          </Menu.Item>
        )}
        {returned && record.expenseReportSubmitted && (
          <Menu.Item
            key="viewExpense"
            onClick={() => openDrawer("viewExpenseReport", record)}
          >
            <Space>
              <FileText size={14} />
              View Expense Report
            </Space>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  // Handle cancel trip
  const handleCancelTrip = (record) => {
    message.success(`Trip to ${record.destination} has been cancelled`);
    // In a real app, you would update the data here
    const updatedTrips = trips.map((trip) =>
      trip.key === record.key ? { ...trip, status: "Cancelled" } : trip
    );
    setTrips(updatedTrips);
  };

  // Table columns for upcoming trips with enhanced features
  const upcomingTripsColumns = [
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
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
      render: (destination) => (
        <Space>
          <MapPin size={14} />
          {destination}
        </Space>
      ),
      sorter: (a, b) => a.destination.localeCompare(b.destination),
    },
    {
      title: "Date Range",
      key: "dateRange",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>
            {record.departure} to {record.return}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {Math.ceil(
              (new Date(record.return) - new Date(record.departure)) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days
          </Text>
          {isReturned(record) && (
            <Tag color="blue" style={{ marginTop: 4 }}>
              Returned
            </Tag>
          )}
        </Space>
      ),
      sorter: (a, b) => new Date(a.departure) - new Date(b.departure),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (purpose) => (
        <Space>
          <Briefcase size={14} />
          {purpose}
        </Space>
      ),
      filters: [
        { text: "Client Meeting", value: "Client Meeting" },
        { text: "Conference", value: "Conference" },
        { text: "Training", value: "Training" },
      ],
      onFilter: (value, record) => record.purpose === value,
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (budget, record) => (
        <Space direction="vertical" size={0}>
          <Text>UGX&nbsp;{budget.toLocaleString()}</Text>
          <Progress
            percent={record.progress}
            size="small"
            showInfo={false}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
          {record.expenses > 0 && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Spent: UGX&nbsp;{record.expenses.toLocaleString()}
            </Text>
          )}
        </Space>
      ),
      sorter: (a, b) => a.budget - b.budget,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space direction="vertical" size={0}>
          {renderStatusTag(status)}
          {isReturned(record) && !record.expenseReportSubmitted && (
            <Tag
              color="orange"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: 4,
              }}
            >
              <AlertTriangle size={14} /> Expense Report Due
            </Tag>
          )}
          {isReturned(record) && record.expenseReportSubmitted && (
            <Tag
              color="success"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: 4,
              }}
            >
              <CheckCircle2 size={14} /> Expense Report Submitted
            </Tag>
          )}
        </Space>
      ),
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "Pending", value: "Pending" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={() => tripActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreHorizontal size={16} />} />
        </Dropdown>
      ),
    },
  ];

  // Render card view for trips
  const renderCardView = () => {
    const displayTrips = filterReturned
      ? trips.filter((trip) => isReturned(trip))
      : trips;

    return (
      <Row gutter={[16, 16]}>
        {displayTrips.map((trip) => (
          <Col xs={24} sm={12} md={8} lg={6} key={trip.key}>
            <Card
              hoverable
              extra={
                isReturned(trip) && !trip.expenseReportSubmitted ? (
                  <Badge status="warning" text="Expense Report Due" />
                ) : isReturned(trip) && trip.expenseReportSubmitted ? (
                  <Badge status="success" text="Expense Report Submitted" />
                ) : null
              }
              actions={[
                <Button
                  type="text"
                  icon={<Eye size={16} />}
                  onClick={() => openDrawer("viewTrip", trip)}
                  key="view"
                >
                  View
                </Button>,
                <Button
                  type="text"
                  icon={<Edit size={16} />}
                  onClick={() => openDrawer("editTrip", trip)}
                  key="edit"
                >
                  Edit
                </Button>,
                isReturned(trip) && !trip.expenseReportSubmitted ? (
                  <Button
                    type="text"
                    icon={<FileText size={16} />}
                    onClick={() => openDrawer("submitExpenseReport", trip)}
                    key="expense"
                  >
                    Submit Expenses
                  </Button>
                ) : isReturned(trip) && trip.expenseReportSubmitted ? (
                  <Button
                    type="text"
                    icon={<FileText size={16} />}
                    onClick={() => openDrawer("viewExpenseReport", trip)}
                    key="viewExpense"
                  >
                    View Expenses
                  </Button>
                ) : (
                  <Button
                    type="text"
                    icon={<X size={16} />}
                    onClick={() => handleCancelTrip(trip)}
                    key="cancel"
                  >
                    Cancel
                  </Button>
                ),
              ]}
            >
              <div style={{ display: "flex", marginBottom: 16 }}>
                <Avatar src={trip.employee.avatar} size={64} />
                <div style={{ marginLeft: 12 }}>
                  <Text strong>{trip.employee.name}</Text>
                  <div>{trip.employee.department}</div>
                  <div style={{ marginTop: 8 }}>
                    {renderStatusTag(trip.status)}
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
                  <Text type="secondary">Destination:</Text>
                  <Text>{trip.destination}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Dates:</Text>
                  <Text>
                    {trip.departure} - {trip.return}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Purpose:</Text>
                  <Text>{trip.purpose}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text type="secondary">Budget:</Text>
                  <Text>UGX&nbsp;{trip.budget.toLocaleString()}</Text>
                </div>
                <Progress
                  percent={trip.progress}
                  size="small"
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          type={filterReturned ? "primary" : "default"}
          onClick={() => setFilterReturned(!filterReturned)}
        >
          {filterReturned ? "Show All Trips" : "Show Only Returned Trips"}
        </Button>
        <Text>
          {
            trips.filter(
              (trip) => isReturned(trip) && !trip.expenseReportSubmitted
            ).length
          }{" "}
          trips require expense reports
        </Text>
      </div>

      {viewMode === "table" ? (
        <Table
          columns={upcomingTripsColumns}
          dataSource={
            filterReturned ? trips.filter((trip) => isReturned(trip)) : trips
          }
          size="small"
          pagination={{
            pageSize: 5,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowKey="key"
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0, padding: "12px 0" }}>
                <Descriptions size="small" column={3} bordered>
                  <Descriptions.Item label="Employee">
                    {record.employee.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Department">
                    {record.employee.department}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {renderStatusTag(record.status)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Destination">
                    {record.destination}
                  </Descriptions.Item>
                  <Descriptions.Item label="Departure">
                    {record.departure}
                  </Descriptions.Item>
                  <Descriptions.Item label="Return">
                    {record.return}
                  </Descriptions.Item>
                  <Descriptions.Item label="Purpose">
                    {record.purpose}
                  </Descriptions.Item>
                  <Descriptions.Item label="Budget">
                    UGX&nbsp;{record.budget.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Progress">
                    <Progress percent={record.progress} size="small" />
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
          }}
        />
      ) : (
        renderCardView()
      )}
    </>
  );
};

// Trip Details Component
const TripDetails = ({ type, record, onClose }) => {
  const [form] = Form.useForm();
  const [expenseForm] = Form.useForm();

  // Expense Report Submission Form
  if (type === "submitExpenseReport") {
    if (!record) return <Empty description="No trip details available" />;

    return (
      <Form
        form={expenseForm}
        layout="vertical"
        onFinish={(values) => {
          console.log("Expense report values:", values);
          message.success("Expense report submitted successfully");
          onClose();
        }}
      >
        <Descriptions
          title="Trip Information"
          bordered
          column={1}
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Employee">
            {record.employee.name}
          </Descriptions.Item>
          <Descriptions.Item label="Destination">
            {record.destination}
          </Descriptions.Item>
          <Descriptions.Item label="Date Range">
            {record.departure} to {record.return}
          </Descriptions.Item>
          <Descriptions.Item label="Purpose">
            {record.purpose}
          </Descriptions.Item>
          <Descriptions.Item label="Budget">
            UGX&nbsp;{record.budget.toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5}>Expense Details</Title>

        <Form.List name="expenses" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} style={{ marginBottom: 16 }} size="small">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "category"]}
                        label="Category"
                        rules={[
                          { required: true, message: "Missing category" },
                        ]}
                      >
                        <Select placeholder="Select category">
                          <Option value="Flight">Flight</Option>
                          <Option value="Accommodation">Accommodation</Option>
                          <Option value="Meals">Meals</Option>
                          <Option value="Transportation">Transportation</Option>
                          <Option value="Other">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "amount"]}
                        label="Amount"
                        rules={[{ required: true, message: "Missing amount" }]}
                      >
                        <Input prefix="UGX" type="number" placeholder="0.00" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "date"]}
                        label="Date"
                        rules={[{ required: true, message: "Missing date" }]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Description"
                        rules={[
                          { required: true, message: "Missing description" },
                        ]}
                      >
                        <Input.TextArea rows={2} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "receipt"]}
                        label="Receipt"
                      >
                        <Input type="file" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button
                    type="text"
                    danger
                    onClick={() => remove(name)}
                    icon={<X size={14} />}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  >
                    Remove
                  </Button>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Add Expense
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="notes" label="Additional Notes">
          <Input.TextArea
            rows={4}
            placeholder="Any additional information about your expenses"
          />
        </Form.Item>

        <Form.Item name="totalAmount" label="Total Amount">
          <Input prefix="UGX" disabled placeholder="0.00" />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit Expense Report
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }

  // View Expense Report
  if (type === "viewExpenseReport") {
    if (!record) return <Empty description="No expense report available" />;

    // Sample expense data for the report
    const expenseData = [
      {
        key: "1",
        category: "Flight",
        amount: 1250.75,
        date: "2025-02-21",
        description: "Round-trip flight to Tokyo",
        receipt: true,
      },
      {
        key: "2",
        category: "Accommodation",
        amount: 3200.5,
        date: "2025-02-20",
        description: "Hotel stay for 8 nights",
        receipt: true,
      },
      {
        key: "3",
        category: "Meals",
        amount: 850.25,
        date: "2025-02-22",
        description: "Meals during stay",
        receipt: true,
      },
      {
        key: "4",
        category: "Transportation",
        amount: 320.0,
        date: "2025-02-23",
        description: "Local transportation",
        receipt: true,
      },
    ];

    return (
      <>
        <Descriptions
          title="Trip Information"
          bordered
          column={1}
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Employee">
            {record.employee.name}
          </Descriptions.Item>
          <Descriptions.Item label="Destination">
            {record.destination}
          </Descriptions.Item>
          <Descriptions.Item label="Date Range">
            {record.departure} to {record.return}
          </Descriptions.Item>
          <Descriptions.Item label="Purpose">
            {record.purpose}
          </Descriptions.Item>
          <Descriptions.Item label="Budget">
            UGX&nbsp;{record.budget.toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5}>Expense Details</Title>

        <Table
          dataSource={expenseData}
          pagination={false}
          size="small"
          columns={[
            {
              title: "Category",
              dataIndex: "category",
              key: "category",
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              render: (amount) =>
                `UGX${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
            },
            {
              title: "Description",
              dataIndex: "description",
              key: "description",
              ellipsis: true,
            },
            {
              title: "Receipt",
              dataIndex: "receipt",
              key: "receipt",
              render: (receipt) =>
                receipt ? (
                  <Tag color="success">Provided</Tag>
                ) : (
                  <Tag color="error">Missing</Tag>
                ),
            },
          ]}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={1}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>
                  UGX&nbsp;
                  {expenseData
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={3}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        <div style={{ marginTop: 24 }}>
          <Title level={5}>Approval Status</Title>
          <Steps current={2} size="small">
            <Step title="Submitted" description="Feb 28, 2025" />
            <Step title="Under Review" description="Mar 1, 2025" />
            <Step title="Approved" description="Mar 2, 2025" />
            <Step title="Reimbursed" description="Pending" />
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
          <Button onClick={onClose}>Close</Button>
          <Button
            type="primary"
            onClick={() => {
              message.success("Expense report approved for reimbursement");
              onClose();
            }}
          >
            Approve for Reimbursement
          </Button>
        </div>
      </>
    );
  }

  if (type === "newTrip") {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("New trip values:", values);
          message.success("Travel request submitted successfully");
          onClose();
        }}
      >
        <Form.Item
          name="employee"
          label="Employee"
          rules={[{ required: true, message: "Please select an employee" }]}
        >
          <Select placeholder="Select employee">
            <Option value="john">John Smith (Sales)</Option>
            <Option value="sarah">Sarah Johnson (Marketing)</Option>
            <Option value="michael">Michael Brown (Engineering)</Option>
            <Option value="emily">Emily Davis (Product)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="destination"
          label="Destination"
          rules={[{ required: true, message: "Please enter a destination" }]}
        >
          <Input placeholder="City, Country" />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Travel Dates"
          rules={[{ required: true, message: "Please select travel dates" }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="purpose"
          label="Purpose"
          rules={[{ required: true, message: "Please select a purpose" }]}
        >
          <Select placeholder="Select purpose">
            <Option value="Client Meeting">Client Meeting</Option>
            <Option value="Conference">Conference</Option>
            <Option value="Training">Training</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="budget"
          label="Estimated Budget"
          rules={[
            { required: true, message: "Please enter an estimated budget" },
          ]}
        >
          <Input prefix="UGX&nbsp;" type="number" placeholder="0.00" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={4}
            placeholder="Additional details about the trip"
          />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit Request
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }

  if (type === "editTrip" && record) {
    // Pre-fill the form with existing data
    form.setFieldsValue({
      destination: record.destination,
      purpose: record.purpose,
      budget: record.budget,
    });

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("Edit trip values:", values);
          message.success("Trip updated successfully");
          onClose();
        }}
      >
        <Form.Item label="Employee" name="employee">
          <Input disabled defaultValue={record.employee.name} />
        </Form.Item>

        <Form.Item
          name="destination"
          label="Destination"
          rules={[{ required: true, message: "Please enter a destination" }]}
        >
          <Input placeholder="City, Country" />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Travel Dates"
          rules={[{ required: true, message: "Please select travel dates" }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="purpose"
          label="Purpose"
          rules={[{ required: true, message: "Please select a purpose" }]}
        >
          <Select placeholder="Select purpose">
            <Option value="Client Meeting">Client Meeting</Option>
            <Option value="Conference">Conference</Option>
            <Option value="Training">Training</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="budget"
          label="Estimated Budget"
          rules={[
            { required: true, message: "Please enter an estimated budget" },
          ]}
        >
          <Input prefix="UGX&nbsp;" type="number" placeholder="0.00" />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Update Trip
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }

  if (!record) return <Empty description="No trip details available" />;

  return (
    <>
      <Descriptions title="Trip Information" bordered column={1}>
        <Descriptions.Item label="Employee">
          <Space>
            <Avatar src={record.employee.avatar} />
            {record.employee.name}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Department">
          {record.employee.department}
        </Descriptions.Item>
        <Descriptions.Item label="Destination">
          {record.destination}
        </Descriptions.Item>
        <Descriptions.Item label="Departure Date">
          {record.departure}
        </Descriptions.Item>
        <Descriptions.Item label="Return Date">
          {record.return}
        </Descriptions.Item>
        <Descriptions.Item label="Purpose">{record.purpose}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {renderStatusTag(record.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Budget">
          UGX&nbsp;{record.budget.toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: "24px" }}>
        <Title level={5}>Trip Timeline</Title>
        <Timeline mode="left">
          <Timeline.Item label="Request Submitted">
            Trip request submitted by {record.employee.name}
          </Timeline.Item>
          <Timeline.Item label="Manager Approval">
            Approved by manager
          </Timeline.Item>
          <Timeline.Item label="HR Review" color="blue">
            Currently under HR review
          </Timeline.Item>
          <Timeline.Item label="Booking" color="gray">
            Pending travel booking
          </Timeline.Item>
          <Timeline.Item label="Trip" color="gray">
            Travel period
          </Timeline.Item>
          <Timeline.Item label="Expense Submission" color="gray">
            Expense report submission
          </Timeline.Item>
        </Timeline>
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
            message.success(`Trip to ${record.destination} has been cancelled`);
            onClose();
          }}
        >
          Cancel Trip
        </Button>
        <Button
          type="primary"
          onClick={() => {
            message.success(`Trip to ${record.destination} has been approved`);
            onClose();
          }}
        >
          Approve Trip
        </Button>
      </div>
    </>
  );
};

TripManagement.Details = TripDetails;

export default TripManagement;
