import { useState } from "react";
import { Tabs } from "antd";
import LeaveRequest from "./leave/leave_request/LeaveRequest";
import Leavebalance from "./leave/leave_balance/LeaveBalance";
import LeaveCalendar from "./leave/leave_calendar/LeaveCalendar";
import PolicyCompliance from "./leave/policy_compliance/PolicyCompliance";
import ReportsAnalytics from "./leave/analytics/Analytics";
import Notifications from "./leave/notifications/Notifications";


export default function LeaveContainer() {
  const [activeTab, setActiveTab] = useState("1");

  const items = [
    {
      key: "1",
      label: "Leave Request",
      children: <LeaveRequest />,
    },
    {
      key: "2",
      label: "Leave Balance",
      children: <Leavebalance />,
    },
    {
      key: "3",
      label: "Leave Calendar",
      children: <LeaveCalendar />,
    },
    {
      key: "4",
      label: "Policy Compliance",
      children: <PolicyCompliance />,
    },
    {
      key: "5",
      label: "Reports & Analytics",
      children: <ReportsAnalytics />,
    },
    {
      key: "6",
      label: "Notifications",
      children: <Notifications />,
    },
  ];

  return (
    <div className="p-10 bg-white">
      {/* <h1 className="text-2xl font-bold mb-6">Payroll Management System</h1> */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={items}
        className="payroll-tabs"
      />
    </div>
  );
}
