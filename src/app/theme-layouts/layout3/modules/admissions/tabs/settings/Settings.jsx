import React, { useState } from "react";
import { Card } from "antd";
import RunningAdmissions from "./running/RunningAdmissions";
import Schemes from "./managescheme/Schemes";
import AdmissionLevels from "./admission_levels/AdmissionLevels";
import AdmissionForms from "./admission_forms/AdmissionForms";
import AdmissionLetters from "./admission_letters/AdmissionLetters";

const tabListNoTitle = [
  {
    key: "running_admissions",
    label: "Runninng Admissions",
  },
  {
    key: "manage_schemes",
    label: "Manage Schemes",
  },
  {
    key: "admission_levels",
    label: "Admission Levels",
  },
  {
    key: "admission_letters",
    label: "Admission Letters",
  },
];
const contentListNoTitle = {
  running_admissions: <RunningAdmissions />,
  manage_schemes: <Schemes />,
  admission_levels: <AdmissionLevels />,
  admission_letters: <AdmissionLetters />,
};
const Settings = () => {
  const [activeTabKey2, setActiveTabKey2] = useState("running_admissions");

  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };
  return (
    <>
      <div
        style={{
          padding: 10,
        }}
      >
        <Card
          style={{
            width: "100%",
            borderColor: "lightgray",
          }}
          size="small"
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey2}
          bordered
          onTabChange={onTab2Change}
          tabProps={{
            size: "small",
          }}
        >
          {contentListNoTitle[activeTabKey2]}
        </Card>
      </div>
    </>
  );
};
export default Settings;
