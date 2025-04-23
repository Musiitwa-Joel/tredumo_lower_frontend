import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  PullRequestOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  RequestPage,
  Reviews,
  Settings,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import PerformanceReviews from "./PerformanceReviews";
import FeedbackRequests from "./FeedbackRequests";
import AppraisalTemplates from "./appraisal_templates/AppraisalTemplates";
import {
  selectActiveAppraisalTab,
  setActiveAppraisalTab,
} from "../../store/hrSlice";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  BarChart3,
  LogOut,
  LayoutTemplate,
} from "lucide-react";
import RespondReview from "./reviews/review_response/RespondReview";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
// const items = [
//   getItem("Performance Reviews", "1", <Reviews />),
//   getItem("Feedback Requests", "3", <PullRequestOutlined />),
//   getItem("Appraisal Templates", "2", <SettingOutlined />),
// ];

const items = [
  {
    key: "1",
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
  },
  {
    key: "2",
    icon: <ClipboardList size={20} />,
    label: "Reviews",
  },
  {
    key: "3",
    icon: <UserCircle size={20} />,
    label: "Self Assessment",
  },
  {
    key: "4",
    icon: <BarChart3 size={20} />,
    label: "Reports",
  },
  {
    key: "5",
    icon: <LayoutTemplate size={20} />,
    label: "Templates",
  },
];
const Appraisals = () => {
  const [collapsed, setCollapsed] = useState(false);
  const activeTab = useSelector(selectActiveAppraisalTab);

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
        // className="bg-white"
      >
        {/* <Menu
          // theme="dark"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => dispatch(setActiveAppraisalTab(key))}
          mode="inline"
          items={items}
        /> */}
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={`${activeTab}`}
          items={items}
          onClick={({ key }) => dispatch(setActiveAppraisalTab(key))}
        />
      </Sider>
      <Layout>
        {activeTab == "2" && <PerformanceReviews />}
        {/* {activeTab == "2" && <RespondReview />} */}
        {activeTab == "3" && <FeedbackRequests />}
        {activeTab == "5" && <AppraisalTemplates />}
      </Layout>
    </Layout>
  );
};
export default Appraisals;
