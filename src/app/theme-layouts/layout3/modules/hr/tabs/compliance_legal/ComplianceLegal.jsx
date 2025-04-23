import { useState } from "react";
import { Tabs } from "antd";
import LaborLawCompliance from "./sub_modules/LaborLawCompliance";
import ContractsPolicies from "./sub_modules/Contracts";
import WorkplaceSafety from "./sub_modules/WorkplaceSafety";
import GrievancesDisciplinary from "./sub_modules/GrievancesDisciplinary";
import EqualOpportunity from "./sub_modules/EqualOpportunity";
import DataSecurity from "./sub_modules/DataSecurity";

export default function ComplianceLegalManagement() {
  const [activeTab, setActiveTab] = useState("1");

  const items = [
    {
      key: "1",
      label: "Labor Law Compliance",
      children: <LaborLawCompliance />,
    },
    {
      key: "2",
      label: "Contracts & Policies",
      children: <ContractsPolicies />,
    },
    {
      key: "3",
      label: "Workplace Safety",
      children: <WorkplaceSafety />,
    },
    {
      key: "4",
      label: "Grievances & Discipline",
      children: <GrievancesDisciplinary />,
    },
    {
      key: "5",
      label: "Equal Opportunity",
      children: <EqualOpportunity />,
    },
    {
      key: "6",
      label: "Data Security",
      children: <DataSecurity />,
    },
  ];

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-6">Compliance & Legal Management</h1>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={items}
        className="compliance-tabs"
      />
    </div>
  );
}
