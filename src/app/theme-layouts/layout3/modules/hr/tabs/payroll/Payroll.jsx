import { useState } from "react";
import { Tabs } from "antd";
import SalaryManagement from "./sub_modules/SalaryManagement";
import TaxDeductions from "./sub_modules/TaxDeductions";
import PayrollProcessing from "./sub_modules/PayrollProcessing";
import LoansAdvances from "./sub_modules/LoansAdvances";
import PayrollRecords from "./sub_modules/PayrollRecords";
import Reports from "./sub_modules/Reports";
import ApprovalWorkflow from "./sub_modules/ApprovalWorkflow";

export default function PayrollManagement() {
  const [activeTab, setActiveTab] = useState("1");

  const items = [
    {
      key: "1",
      label: "Salary & Earnings",
      children: <SalaryManagement />,
    },
    {
      key: "2",
      label: "Tax & Deductions",
      children: <TaxDeductions />,
    },
    {
      key: "3",
      label: "Payroll & Payslips",
      children: <PayrollProcessing />,
    },
    {
      key: "4",
      label: "Loans & Settlements",
      children: <LoansAdvances />,
    },
    {
      key: "5",
      label: "Records",
      children: <PayrollRecords />,
    },
    {
      key: "6",
      label: "Reports",
      children: <Reports />,
    },
    {
      key: "7",
      label: "Approvals",
      children: <ApprovalWorkflow />,
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
