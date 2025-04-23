import React from "react";
import { Table } from "antd";

const data = [
  {
    key: "1",
    category: "Tuition Fees",
    description: "Income from student tuition fees",
    estimatedAnnualCost: 70000000,
    actualAnnualCost: 72000000,
  },
  {
    key: "2",
    category: "Grants",
    description: "Government and private grants",
    estimatedAnnualCost: 20000000,
    actualAnnualCost: 22000000,
  },
  {
    key: "3",
    category: "Donations",
    description: "Contributions from donors",
    estimatedAnnualCost: 10000000,
    actualAnnualCost: 11000000,
  },
  {
    key: "4",
    category: "Research Funding",
    description: "Income from research projects",
    estimatedAnnualCost: 5000000,
    actualAnnualCost: 6000000,
  },
  {
    key: "5",
    category: "Rental Income",
    description: "Income from renting out university facilities",
    estimatedAnnualCost: 3000000,
    actualAnnualCost: 2500000,
  },
  {
    key: "6",
    category: "Miscellaneous Income",
    description: "Other sources of income (e.g., events, sales)",
    estimatedAnnualCost: 2000000,
    actualAnnualCost: 1500000,
  },
  {
    key: "7",
    category: "Total Revenue",
    description: "Total income generated from all sources",
    estimatedAnnualCost: 105000000,
    actualAnnualCost: 110000000,
  },
  {
    key: "8",
    category: "Salaries and Wages",
    description:
      "Payments to faculty, administrative staff, support staff, and other employees",
    estimatedAnnualCost: 50000000,
    actualAnnualCost: 52000000,
  },
  {
    key: "9",
    category: "Utilities",
    description:
      "Costs for electricity, water, gas, internet, and other essential utilities",
    estimatedAnnualCost: 10000000,
    actualAnnualCost: 11000000,
  },
  {
    key: "10",
    category: "Maintenance",
    description: "Costs for maintaining university buildings and facilities",
    estimatedAnnualCost: 5000000,
    actualAnnualCost: 5500000,
  },
  {
    key: "11",
    category: "Supplies",
    description: "Office, laboratory, and other operational supplies",
    estimatedAnnualCost: 3000000,
    actualAnnualCost: 3200000,
  },
  {
    key: "12",
    category: "Scholarships",
    description: "Funds allocated for student scholarships",
    estimatedAnnualCost: 7000000,
    actualAnnualCost: 7300000,
  },
  {
    key: "13",
    category: "Miscellaneous Expenses",
    description: "Other unforeseen or minor expenses",
    estimatedAnnualCost: 5000000,
    actualAnnualCost: 6000000,
  },
  {
    key: "14",
    category: "Total Expenses",
    description: "Total expenses including operational and capital expenses",
    estimatedAnnualCost: 80000000,
    actualAnnualCost: 85000000,
  },
  {
    key: "15",
    category: "Net Profit/Loss",
    description: "Difference between total revenue and total expenses",
    estimatedAnnualCost: 25000000,
    actualAnnualCost: 25000000,
  },
  {
    key: "16",
    category: "Cash Flow",
    description:
      "Net amount of cash being transferred into and out of the business",
    estimatedAnnualCost: 5000000,
    actualAnnualCost: 4500000,
  },
];

const columns = [
  {
    title: "Category",
    ellipsis: true,
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Description",
    ellipsis: true,
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Estimated Annual Cost (UGX)",
    ellipsis: true,
    dataIndex: "estimatedAnnualCost",
    key: "estimatedAnnualCost",
    render: (text) => <span>{text.toLocaleString()}</span>,
  },
  {
    title: "Actual Annual Cost (UGX)",
    dataIndex: "actualAnnualCost",
    ellipsis: true,
    key: "actualAnnualCost",
    render: (text) => <span>{text.toLocaleString()}</span>,
  },
];

const FinancialYearReportTable = () => (
  <Table
    style={{ marginTop: 30 }}
    size="small"
    className="custom-table"
    columns={columns}
    dataSource={data}
    pagination={false}
  />
);

export default FinancialYearReportTable;
