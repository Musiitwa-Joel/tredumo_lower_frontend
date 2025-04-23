import React, { useState } from "react";
import { Card } from "antd";
import Summary from "./_reports/Summary";
import ApplicationsReport from "./_reports/ApplicationsReport";

const tabListNoTitle = [
  {
    key: "summary",
    label: "Summary",
  },
  {
    key: "application_report",
    label: "Applications Report",
  },
];
const contentListNoTitle = {
  summary: <Summary />,
  application_report: <ApplicationsReport />,
};
const App = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");
  const [activeTabKey2, setActiveTabKey2] = useState("summary");
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };
  return (
    <>
      <div
        style={{
          padding: 5,
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
export default App;
