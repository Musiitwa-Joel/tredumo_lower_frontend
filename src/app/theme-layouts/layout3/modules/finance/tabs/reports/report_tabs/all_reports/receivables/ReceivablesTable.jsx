import React from "react";
import { Table, Typography, Button, Tag } from "antd";

import "./styles.css";
const { Title } = Typography;

export default function ReceivablesTable() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      key: "name",
      width: 150,
      fixed: "left", // Make the 'Name' column fixed on the left
    },
    {
      title: "StdNo",
      dataIndex: "stdNo",
      key: "stdNo",
      width: 100,
    },
    {
      title: "Receivables",
      dataIndex: "receivables",
      key: "receivables",
      width: 150,
    },
    {
      title: "Campus",
      dataIndex: "campus",
      key: "campus",
      width: 120,
    },
    {
      title: "College",
      dataIndex: "college",
      ellipsis: true,
      key: "college",
      width: 150,
    },
    {
      title: "Intake",
      dataIndex: "intake",
      key: "intake",
      width: 120,
    },
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
      width: 200,
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
      width: 120,
    },
    {
      title: "Sponsorship",
      dataIndex: "sponsorship",
      key: "sponsorship",
      width: 150,
    },
    {
      title: "StudyTime",
      dataIndex: "studyTime",
      key: "studyTime",
      width: 120,
    },
    {
      title: "StudyYear",
      dataIndex: "studyYear",
      key: "studyYear",
      width: 100,
    },
  ];

  const data = [
    {
      key: "1",
      name: "MUSIITWA JOEL",
      stdNo: "2000100121",
      receivables: "UGX 500,000",
      campus: "Main Campus",
      college: "College of Engineering",
      intake: "August 2024",
      program: "BSc Electrical Engineering",
      faculty: "Engineering",
      sponsorship: "Self",
      studyTime: "Day",
      studyYear: "Year 1",
    },
    {
      key: "2",
      name: "AKAMPEREZA DARLINGTON",
      stdNo: "2000101041",
      receivables: "UGX 1,000,000",
      campus: "Main Campus",
      college: "College of Business",
      intake: "January 2024",
      program: "BBA Marketing",
      faculty: "Business",
      sponsorship: "Government",
      studyTime: "Evening",
      studyYear: "Year 2",
    },
    {
      key: "3",
      name: "LUBEGA TASHA DESIRE",
      stdNo: "2000100539",
      receivables: "UGX 300,000",
      campus: "City Campus",
      college: "College of IT",
      intake: "May 2024",
      program: "BSc Computer Science",
      faculty: "IT",
      sponsorship: "Self",
      studyTime: "Weekend",
      studyYear: "Year 3",
    },
    {
      key: "4",
      name: "KYAGABA BLESSING",
      stdNo: "2400123456",
      receivables: "UGX 600,000",
      campus: "Main Campus",
      college: "College of Law",
      intake: "August 2024",
      program: "LLB",
      faculty: "Law",
      sponsorship: "Scholarship",
      studyTime: "Day",
      studyYear: "Year 4",
    },
  ];

  return (
    <div style={{ padding: "10px 0px" }}>
      <Table
        size="small"
        className="custom-table"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
