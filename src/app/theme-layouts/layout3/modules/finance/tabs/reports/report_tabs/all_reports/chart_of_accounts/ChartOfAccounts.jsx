import React from "react";
import { Table } from "antd";

const data = [
  {
    key: "1",
    accountNumber: "1000",
    accountName: "Cash",
    accountType: "Asset",
  },
  {
    key: "2",
    accountNumber: "1100",
    accountName: "Tuition Receivable",
    accountType: "Asset",
  },
  {
    key: "3",
    accountNumber: "1200",
    accountName: "Grants and Donations Receivable",
    accountType: "Asset",
  },
  {
    key: "4",
    accountNumber: "2000",
    accountName: "Accounts Payable",
    accountType: "Liability",
  },
  {
    key: "5",
    accountNumber: "2100",
    accountName: "Long-Term Loans",
    accountType: "Liability",
  },
  {
    key: "6",
    accountNumber: "3000",
    accountName: "Endowment Fund",
    accountType: "Equity",
  },
  {
    key: "7",
    accountNumber: "3100",
    accountName: "Retained Earnings",
    accountType: "Equity",
  },
  {
    key: "8",
    accountNumber: "4000",
    accountName: "Tuition Fees",
    accountType: "Revenue",
  },
  {
    key: "9",
    accountNumber: "4100",
    accountName: "Research Grants",
    accountType: "Revenue",
  },
  {
    key: "10",
    accountNumber: "4200",
    accountName: "Donations",
    accountType: "Revenue",
  },
  {
    key: "11",
    accountNumber: "5000",
    accountName: "Faculty Salaries",
    accountType: "Expense",
  },
  {
    key: "12",
    accountNumber: "5100",
    accountName: "Administrative Salaries",
    accountType: "Expense",
  },
  {
    key: "13",
    accountNumber: "5200",
    accountName: "Utilities Expense",
    accountType: "Expense",
  },
  {
    key: "14",
    accountNumber: "5300",
    accountName: "Maintenance and Repairs",
    accountType: "Expense",
  },
  {
    key: "15",
    accountNumber: "5400",
    accountName: "Academic Supplies",
    accountType: "Expense",
  },
  {
    key: "16",
    accountNumber: "5500",
    accountName: "Scholarships",
    accountType: "Expense",
  },
];

const columns = [
  {
    title: "Account Number",
    ellipsis: true,
    dataIndex: "accountNumber",
    key: "accountNumber",
  },
  {
    title: "Account Name",
    ellipsis: true,
    dataIndex: "accountName",
    key: "accountName",
  },
  {
    title: "Account Type",
    ellipsis: true,
    dataIndex: "accountType",
    key: "accountType",
  },
];

const ChartOfAccountsTable = () => {
  return (
    <Table
      className="custom-table"
      size="small"
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
    />
  );
};

export default ChartOfAccountsTable;
