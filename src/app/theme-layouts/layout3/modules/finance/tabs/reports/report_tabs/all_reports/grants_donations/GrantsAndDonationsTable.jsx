import React from "react";
import { Table, Typography } from "antd";

import "./styles.css";
const { Title } = Typography;

export default function GrantsAndDonationsTable() {
  const columns = [
    {
      title: "Donor Name/Organization",
      dataIndex: "donorName",
      ellipsis: true,
      key: "donorName",
      width: 200,
      fixed: "left", // Make the 'Donor Name/Organization' column fixed on the left
    },
    {
      title: "Donation/Grant Amount",
      ellipsis: true,
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (text) => <span>{`UGX ${text.toLocaleString()}`}</span>,
    },
    {
      title: "Date of Donation/Grant",
      ellipsis: true,
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Type of Contribution",
      ellipsis: true,
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Purpose/Designation",
      ellipsis: true,
      dataIndex: "purpose",
      key: "purpose",
      width: 200,
    },
    {
      title: "Contact Information",
      ellipsis: true,
      dataIndex: "contactInfo",
      key: "contactInfo",
      width: 200,
    },
    {
      title: "Reference Number",
      ellipsis: true,
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      width: 150,
    },
    {
      title: "Status",
      ellipsis: true,
      dataIndex: "status",
      key: "status",
      width: 150,
    },
    {
      title: "Notes",
      ellipsis: true,
      dataIndex: "notes",
      key: "notes",
      width: 200,
    },
  ];

  const data = [
    {
      key: "1",
      donorName: "MTN Uganda",
      amount: 5000000,
      date: "2024-09-01",
      type: "Donation",
      purpose: "ICT Development Fund",
      contactInfo: "contact@mtn.co.ug",
      receiptNumber: "REC-2024-003",
      status: "Fully Paid",
      notes: "Supports ICT projects",
    },
    {
      key: "2",
      donorName: "Uganda Breweries Limited",
      amount: 3000000,
      date: "2024-10-15",
      type: "Grant",
      purpose: "Environmental Sustainability",
      contactInfo: "info@ubl.co.ug",
      receiptNumber: "REC-2024-004",
      status: "Partly Paid",
      notes: "Annual grant for sustainability",
    },
    {
      key: "3",
      donorName: "Stanbic Bank Uganda",
      amount: 10000000,
      date: "2024-11-05",
      type: "Donation",
      purpose: "Scholarship Fund",
      contactInfo: "support@stanbicbank.co.ug",
      receiptNumber: "REC-2024-005",
      status: "Fully Paid",
      notes: "Scholarships for underprivileged students",
    },
    {
      key: "4",
      donorName: "Mukwano Group of Companies",
      amount: 2000000,
      date: "2024-08-20",
      type: "Grant",
      purpose: "Community Outreach Program",
      contactInfo: "info@mukwano.com",
      receiptNumber: "REC-2024-006",
      status: "Fully Paid",
      notes: "Support for community outreach initiatives",
    },
    {
      key: "5",
      donorName: "Dfcu Bank",
      amount: 4000000,
      date: "2024-07-30",
      type: "Donation",
      purpose: "Infrastructure Development",
      contactInfo: "info@dfcugroup.com",
      receiptNumber: "REC-2024-007",
      status: "Fully Paid",
      notes: "Funding for new campus buildings",
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
