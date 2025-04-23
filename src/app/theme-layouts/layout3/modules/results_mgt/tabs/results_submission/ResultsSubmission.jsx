import React, { useState } from "react";
import { Card } from "antd";

import CourseWorkSubmission from "./CourseWorkSubmission";
import FinalResultsSubmission from "./FinalResultsSubmission";
import SubmissionHistory from "./SubmissionHistory";

const tabListNoTitle = [
  {
    key: "course_work_submission",
    label: "Course Work Submission",
  },
  {
    key: "final_results_submission",
    label: "Final Results Submission",
  },
  {
    key: "submission_history",
    label: "Submission History",
  },
];
const contentListNoTitle = {
  course_work_submission: <CourseWorkSubmission />,
  final_results_submission: <FinalResultsSubmission />,
  submission_history: <SubmissionHistory />,
};
const ResultsSubmission = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");
  const [activeTabKey2, setActiveTabKey2] = useState("course_work_submission");
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
export default ResultsSubmission;
