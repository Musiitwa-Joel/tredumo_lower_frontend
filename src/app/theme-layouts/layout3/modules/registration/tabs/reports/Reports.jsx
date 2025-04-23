import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveRegReportsTab,
  setActiveRegReportsTab,
} from "../../store/registrationSlice";
import RegisteredStudentsReport from "./tabs/RegisteredStudentsReport";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Registered Students Report", "1", <PieChartOutlined />),
  getItem("Provisonal Registration Expiry", "2", <DesktopOutlined />),
  getItem("Files", "9", <FileOutlined />),
];
const Reports = () => {
  const [collapsed, setCollapsed] = useState(true);
  const activeTab = useSelector(selectActiveRegReportsTab);
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout
      style={{
        height: "calc(100vh - 99.2px)",
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          position: "absolute",
          bottom: 10,
          //   left: 55,
          left: collapsed ? 58 : 180, // Adjust position based on collapsed state
          transition: "left 0.2s", // Smooth transition
          width: 40, // Equal width and height for a perfect circle
          height: 40,
          borderRadius: 20,
          zIndex: 999,
        }}
      >
        {collapsed ? (
          <ChevronRight
            style={{
              fontSize: 25,
            }}
          />
        ) : (
          <ChevronLeft
            style={{
              fontSize: 25,
            }}
          />
        )}
      </Button>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => dispatch(setActiveRegReportsTab(key))}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>{activeTab == "1" && <RegisteredStudentsReport />}</Layout>
    </Layout>
  );
};
export default Reports;
