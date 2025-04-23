import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Space,
  Input,
  Badge,
  Segmented,
  Tooltip,
  Drawer,
} from "antd";
import {
  Plane,
  FileText,
  BarChart3,
  Search,
  Plus,
  Download,
  Filter,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { Typography } from "antd";
import { DatePicker } from "antd";
import { Dropdown, Menu } from "antd";

import TripManagement from "./components/trip-management";
import ExpenseManagement from "./components/expense-management";
import PolicyAnalytics from "./components/policy-analytics";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const HRTravelManagement = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  // Function to open drawer with specific type and record
  const openDrawer = (type, record) => {
    setDrawerType(type);
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  // Render drawer title based on type
  const getDrawerTitle = () => {
    switch (drawerType) {
      case "viewTrip":
        return "Trip Details";
      case "viewExpense":
        return "Expense Details";
      case "editExpense":
        return "Edit Expense";
      case "newTrip":
        return "New Travel Request";
      default:
        return "";
    }
  };

  // Handle new travel request
  const handleNewTravelRequest = () => {
    setDrawerType("newTrip");
    setSelectedRecord(null);
    setDrawerVisible(true);
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header with Advanced Features */}
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  <Space>
                    <Plane size={24} />
                    HR Travel Management
                  </Space>
                </Title>
                <Text type="secondary">
                  Manage employee travel requests, expenses, and policy
                  compliance
                </Text>
              </div>
              <Space>
                <Segmented
                  options={[
                    {
                      label: (
                        <Tooltip title="Card View">
                          <div style={{ padding: "0 8px" }}>
                            <FileText size={16} />
                          </div>
                        </Tooltip>
                      ),
                      value: "card",
                    },
                    {
                      label: (
                        <Tooltip title="Table View">
                          <div style={{ padding: "0 8px" }}>
                            <BarChart3 size={16} />
                          </div>
                        </Tooltip>
                      ),
                      value: "table",
                    },
                  ]}
                  value={viewMode}
                  onChange={(value) => setViewMode(value.toString())}
                />
                <Input
                  placeholder="Search..."
                  prefix={<Search size={16} />}
                  style={{ width: 250 }}
                  allowClear
                />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={handleNewTravelRequest}
                >
                  New Travel Request
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards with Advanced Visualization */}
      <Row gutter={[16, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderColor: "#f6ffed",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
            hoverable
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Active Trips</Text>
                <Title level={2} style={{ margin: "8px 0" }}>
                  12
                </Title>
                <Space>
                  <Badge status="processing" />
                  <Text type="secondary">4 departing this week</Text>
                </Space>
              </div>
              <div
                style={{
                  backgroundColor: "#f6ffed",
                  padding: "12px",
                  borderRadius: "50%",
                }}
              >
                <Plane size={24} color="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Pending Expenses</Text>
                <Title level={2} style={{ margin: "8px 0" }}>
                  UGX 12,450
                </Title>
                <Space>
                  <Badge status="warning" />
                  <Text type="secondary">8 awaiting approval</Text>
                </Space>
              </div>
              <div
                style={{
                  backgroundColor: "#fff7e6",
                  padding: "12px",
                  borderRadius: "50%",
                }}
              >
                <CreditCard size={24} color="#fa8c16" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Policy Compliance</Text>
                <Title level={2} style={{ margin: "8px 0" }}>
                  88%
                </Title>
                <Space>
                  <Badge status="success" />
                  <Text type="secondary">+2.5% from last month</Text>
                </Space>
              </div>
              <div
                style={{
                  backgroundColor: "#f0f5ff",
                  padding: "12px",
                  borderRadius: "50%",
                }}
              >
                <FileText size={24} color="#2f54eb" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs with Advanced Features */}
      <Card style={{ marginTop: "24px" }}>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Space>
              <RangePicker style={{ width: 250 }} />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">All Departments</Menu.Item>
                    <Menu.Item key="2">Sales</Menu.Item>
                    <Menu.Item key="3">Marketing</Menu.Item>
                    <Menu.Item key="4">Engineering</Menu.Item>
                    <Menu.Item key="5">Product</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button icon={<Filter size={16} />}>
                  Filter <ChevronDown size={14} />
                </Button>
              </Dropdown>
              <Button icon={<Download size={16} />}>Export</Button>
            </Space>
          }
        >
          {/* Upcoming Trips Tab */}
          <TabPane
            tab={
              <Space>
                <Plane size={16} />
                Upcoming Trips
                <Badge count={4} style={{ backgroundColor: "#52c41a" }} />
              </Space>
            }
            key="1"
          >
            <TripManagement viewMode={viewMode} openDrawer={openDrawer} />
          </TabPane>

          {/* Expenses Tab */}
          <TabPane
            tab={
              <Space>
                <CreditCard size={16} />
                Expenses
                <Badge count={3} />
              </Space>
            }
            key="2"
          >
            <ExpenseManagement viewMode={viewMode} openDrawer={openDrawer} />
          </TabPane>

          {/* Policy Management and Analytics Tab */}
          <TabPane
            tab={
              <Space>
                <FileText size={16} />
                Policy & Analytics
              </Space>
            }
            key="3"
          >
            <PolicyAnalytics viewMode={viewMode} />
          </TabPane>
        </Tabs>
      </Card>

      {/* Drawer for detailed views */}
      <Drawer
        title={getDrawerTitle()}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose
      >
        {drawerType.includes("Trip") && (
          <TripManagement.Details
            type={drawerType}
            record={selectedRecord}
            onClose={() => setDrawerVisible(false)}
          />
        )}
        {drawerType.includes("Expense") && (
          <ExpenseManagement.Details
            type={drawerType}
            record={selectedRecord}
            onClose={() => setDrawerVisible(false)}
          />
        )}
      </Drawer>
    </div>
  );
};

export default HRTravelManagement;
