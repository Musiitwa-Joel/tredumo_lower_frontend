import React from "react";
import { Tabs } from "antd";
import EmployeeBioData from "./EmployeeBioData";
import EducationInformation from "./EducationInformation";
import TemplatePreview from "../../appraisals/appraisal_templates/TemplatePreview";
import Questionnare from "./Questionnare";
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Questionnaire",
    children: <Questionnare />,
  },
  {
    key: "2",
    label: "Reviewer Feedback",
    children: "Reviewers Feedback",
  },
  {
    key: "3",
    label: "Goals",
    children: "Content of Tab Pane 3",
  },
];
const EmployeeTabs = () => (
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);
export default EmployeeTabs;
