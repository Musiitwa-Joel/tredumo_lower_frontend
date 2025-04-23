import React from "react";
import { Table } from "antd";

const dataSource = [
  {
    key: "1",
    date: "2021-09-01",
    description: "Tuition Fee - Semester 1",
    amount: 2500000,
    transactionType: "Debit",
  },
  {
    key: "2",
    date: "2021-09-15",
    description: "Library Fee",
    amount: 150000,
    transactionType: "Debit",
  },
  {
    key: "3",
    date: "2021-10-01",
    description: "Sports Fee",
    amount: 100000,
    transactionType: "Debit",
  },
  {
    key: "4",
    date: "2021-11-01",
    description: "Accommodation Fee",
    amount: 1200000,
    transactionType: "Debit",
  },
  {
    key: "5",
    date: "2021-12-01",
    description: "Scholarship - Academic Excellence",
    amount: 500000,
    transactionType: "Credit",
  },
  {
    key: "6",
    date: "2022-01-15",
    description: "Tuition Fee - Semester 2",
    amount: 2500000,
    transactionType: "Debit",
  },
  {
    key: "7",
    date: "2022-02-01",
    description: "Laboratory Fee",
    amount: 200000,
    transactionType: "Debit",
  },
  {
    key: "8",
    date: "2022-03-01",
    description: "Exam Fee",
    amount: 300000,
    transactionType: "Debit",
  },
  {
    key: "9",
    date: "2022-04-01",
    description: "Health Insurance Fee",
    amount: 100000,
    transactionType: "Debit",
  },
  {
    key: "10",
    date: "2022-05-01",
    description: "Late Fee Payment Penalty",
    amount: 50000,
    transactionType: "Debit",
  },
  {
    key: "11",
    date: "2022-06-01",
    description: "Library Fine",
    amount: 20000,
    transactionType: "Debit",
  },
  {
    key: "12",
    date: "2022-07-01",
    description: "Internship Stipend",
    amount: 1000000,
    transactionType: "Credit",
  },
  {
    key: "13",
    date: "2022-09-01",
    description: "Tuition Fee - Semester 3",
    amount: 2500000,
    transactionType: "Debit",
  },
  {
    key: "14",
    date: "2022-10-01",
    description: "Sports Fee",
    amount: 100000,
    transactionType: "Debit",
  },
  {
    key: "15",
    date: "2022-11-01",
    description: "Accommodation Fee",
    amount: 1200000,
    transactionType: "Debit",
  },
  {
    key: "16",
    date: "2022-12-01",
    description: "Exam Fee",
    amount: 300000,
    transactionType: "Debit",
  },
  {
    key: "17",
    date: "2023-01-01",
    description: "Research Grant",
    amount: 1500000,
    transactionType: "Credit",
  },
  {
    key: "18",
    date: "2023-02-01",
    description: "Tuition Fee - Semester 4",
    amount: 2500000,
    transactionType: "Debit",
  },
  {
    key: "19",
    date: "2023-03-01",
    description: "Laboratory Fee",
    amount: 200000,
    transactionType: "Debit",
  },
  {
    key: "20",
    date: "2023-04-01",
    description: "Health Insurance Fee",
    amount: 100000,
    transactionType: "Debit",
  },
  {
    key: "21",
    date: "2023-05-01",
    description: "Exam Fee",
    amount: 300000,
    transactionType: "Debit",
  },
  {
    key: "22",
    date: "2023-06-01",
    description: "Scholarship - Community Service",
    amount: 500000,
    transactionType: "Credit",
  },
  {
    key: "23",
    date: "2023-07-01",
    description: "Internship Stipend",
    amount: 1000000,
    transactionType: "Credit",
  },
  {
    key: "24",
    date: "2023-09-01",
    description: "Tuition Fee - Semester 5",
    amount: 2500000,
    transactionType: "Debit",
  },
  {
    key: "25",
    date: "2023-10-01",
    description: "Sports Fee",
    amount: 100000,
    transactionType: "Debit",
  },
  {
    key: "26",
    date: "2023-11-01",
    description: "Accommodation Fee",
    amount: 1200000,
    transactionType: "Debit",
  },
  {
    key: "27",
    date: "2023-12-01",
    description: "Exam Fee",
    amount: 300000,
    transactionType: "Debit",
  },
];

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Amount (UGX)",
    dataIndex: "amount",
    key: "amount",
    render: (text) => <span>{text.toLocaleString()}</span>,
  },
  {
    title: "Transaction Type",
    dataIndex: "transactionType",
    key: "transactionType",
  },
];

const TrePayTransactionsTable = () => {
  return (
    <Table
      className="custom-table"
      size="small"
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export default TrePayTransactionsTable;
