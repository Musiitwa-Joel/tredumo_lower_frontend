import React from "react";
import { Table, Typography, Button, Tag } from "antd";

import "./styles.css";
const { Title } = Typography;

export default function SchoolRevenueTable() {
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
      ellipsis: true,
      key: "stdNo",
      width: 100,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      ellipsis: true,
      key: "paidAmount",
      width: 150,
    },
    {
      title: "Outstanding Balance",
      ellipsis: true,
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      width: 150,
      render: (text) => (
        <span
          style={{
            color: text > 0 ? "red" : "green", // Set color to red if balance is greater than 0 (due), otherwise green
          }}
        >
          {`UGX ${text}`}
        </span>
      ),
    },
    {
      title: "Total Payments",
      ellipsis: true,
      dataIndex: "totalPayments",
      key: "totalPayments",
      width: 150,
    },
    {
      title: "Campus",
      ellipsis: true,
      dataIndex: "campus",
      key: "campus",
      width: 120,
    },
    {
      title: "College",
      ellipsis: true,
      dataIndex: "college",

      key: "college",
      width: 150,
    },
    {
      title: "Intake",
      ellipsis: true,
      dataIndex: "intake",
      key: "intake",
      width: 120,
    },
    {
      title: "Program",
      ellipsis: true,
      dataIndex: "program",
      key: "program",
      width: 200,
    },
    {
      title: "Faculty",
      ellipsis: true,
      dataIndex: "faculty",
      key: "faculty",
      width: 120,
    },
    {
      title: "Sponsorship",
      ellipsis: true,
      dataIndex: "sponsorship",
      key: "sponsorship",
      width: 150,
    },
    {
      title: "StudyTime",
      ellipsis: true,
      dataIndex: "studyTime",
      key: "studyTime",
      width: 120,
    },
    {
      title: "StudyYear",
      ellipsis: true,
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
      paidAmount: "UGX 300,000",
      outstandingBalance: 200000, // Amount still due
      totalPayments: "UGX 300,000",
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
      paidAmount: "UGX 500,000",
      outstandingBalance: 500000, // Amount still due
      totalPayments: "UGX 500,000",
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
      paidAmount: "UGX 300,000",
      outstandingBalance: 0, // No balance, paid off
      totalPayments: "UGX 300,000",
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
      paidAmount: "UGX 600,000",
      outstandingBalance: 0, // No balance, paid off
      totalPayments: "UGX 600,000",
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
