import React, { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US"; // Import English locale
import "./styles.css";

const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const waitTime = async (time = 100) => {
  await waitTimePromise(time);
};

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    width: 120,
    ellipsis: true,
    tooltip: "The unique code of the program.",
  },
  {
    title: "Program",
    dataIndex: "program",
    width: 200,
    tooltip: "The name of the academic program.",
  },
  {
    title: "Year",
    dataIndex: "year",
    width: 100,
    ellipsis: true,
    tooltip: "The academic year.",
  },
  {
    title: "Students Billed",
    dataIndex: "studentsBilled",
    width: 150,
    ellipsis: true,
    tooltip: "The number of students who were billed.",
  },
  {
    title: "Total Bill",
    dataIndex: "totalBill",
    width: 150,
    ellipsis: true,
    tooltip: "The total amount billed.",
    render: (text) => <span style={{ color: "blue" }}>{text}</span>,
  },
  {
    title: "Paid",
    dataIndex: "paid",
    width: 150,
    ellipsis: true,
    tooltip: "The amount paid by the students.",
    render: (text) => <span style={{ color: "green" }}>{text}</span>,
  },
  {
    title: "Due",
    dataIndex: "due",
    width: 150,
    ellipsis: true,
    tooltip: "The amount still due.",
    render: (text) => <span style={{ color: "red" }}>{text}</span>,
  },

  {
    title: "Gross Paid",
    dataIndex: "grossPaid",
    width: 150,
    ellipsis: true,
    tooltip: "The gross amount paid.",
  },
  {
    title: "Running Balance",
    dataIndex: "runningBalance",
    width: 150,
    ellipsis: true,
    tooltip: "The current running balance.",
  },
  {
    title: "Total Credit",
    dataIndex: "totalCredit",
    width: 150,
    tooltip: "The total credit available.",
    ellipsis: true,
  },
  {
    title: "Tuition Bill",
    dataIndex: "tuitionBill",
    width: 150,
    ellipsis: true,
    tooltip: "The amount billed for tuition.",
  },
  {
    title: "Tuition Paid",
    dataIndex: "tuitionPaid",
    width: 150,
    ellipsis: true,
    tooltip: "The amount of tuition paid.",
  },
  {
    title: "Tuition Due",
    dataIndex: "tuitionDue",
    width: 150,
    ellipsis: true,
    tooltip: "The amount of tuition still due.",
  },
  {
    title: "Functional Bill",
    dataIndex: "functionalBill",
    width: 150,
    ellipsis: true,
    tooltip: "The amount billed for functional fees.",
  },
  {
    title: "Functional Paid",
    dataIndex: "functionalPaid",
    width: 150,
    ellipsis: true,
    tooltip: "The amount of functional fees paid.",
  },
  {
    title: "Functional Due",
    dataIndex: "functionalDue",
    width: 150,
    ellipsis: true,
    tooltip: "The amount of functional fees still due.",
  },
  {
    title: "Prepayment Balance",
    dataIndex: "prepaymentBalance",
    width: 150,
    ellipsis: true,
    tooltip: "The balance of prepayments made.",
  },
];

const initialData = [
  {
    id: 1,
    code: "CSE2024",
    program: "BSc Computer Science",
    year: "2024",
    studentsBilled: 100,
    totalBill: "UGX 1,000,000",
    paid: "UGX 800,000",
    due: "UGX 200,000",
    grossPaid: "UGX 800,000",
    runningBalance: "UGX 200,000",
    totalCredit: "UGX 50,000",
    tuitionBill: "UGX 700,000",
    tuitionPaid: "UGX 600,000",
    tuitionDue: "UGX 100,000",
    functionalBill: "UGX 300,000",
    functionalPaid: "UGX 200,000",
    functionalDue: "UGX 100,000",
    prepaymentBalance: "UGX 50,000",
  },
  {
    key: "1",
    code: "CS101",
    program: "B.Sc. Computer Science",
    year: "2024",
    studentsBilled: 100,
    totalBill: "UGX 15,000,000",
    paid: "UGX 12,000,000",
    due: "UGX 3,000,000",
    grossPaid: "UGX 12,000,000",
    runningBalance: "UGX 3,000,000",
    totalCredit: "UGX 500,000",
    tuitionBill: "UGX 10,000,000",
    tuitionPaid: "UGX 8,000,000",
    tuitionDue: "UGX 2,000,000",
    functionalBill: "UGX 5,000,000",
    functionalPaid: "UGX 4,000,000",
    functionalDue: "UGX 1,000,000",
    prepaymentBalance: "UGX 2,000,000",
  },
  {
    key: "2",
    code: "IT102",
    program: "B.IT",
    year: "2024",
    studentsBilled: 80,
    totalBill: "UGX 12,000,000",
    paid: "UGX 9,000,000",
    due: "UGX 3,000,000",
    grossPaid: "UGX 9,000,000",
    runningBalance: "UGX 3,000,000",
    totalCredit: "UGX 400,000",
    tuitionBill: "UGX 8,000,000",
    tuitionPaid: "UGX 6,000,000",
    tuitionDue: "UGX 2,000,000",
    functionalBill: "UGX 4,000,000",
    functionalPaid: "UGX 3,000,000",
    functionalDue: "UGX 1,000,000",
    prepaymentBalance: "UGX 1,500,000",
  },
  {
    key: "3",
    code: "DCS103",
    program: "DCS",
    year: "2024",
    studentsBilled: 60,
    totalBill: "UGX 8,000,000",
    paid: "UGX 6,000,000",
    due: "UGX 2,000,000",
    grossPaid: "UGX 6,000,000",
    runningBalance: "UGX 2,000,000",
    totalCredit: "UGX 300,000",
    tuitionBill: "UGX 5,000,000",
    tuitionPaid: "UGX 4,000,000",
    tuitionDue: "UGX 1,000,000",
    functionalBill: "UGX 3,000,000",
    functionalPaid: "UGX 2,000,000",
    functionalDue: "UGX 1,000,000",
    prepaymentBalance: "UGX 1,000,000",
  },
  {
    key: "4",
    code: "DIT104",
    program: "DIT",
    year: "2024",
    studentsBilled: 50,
    totalBill: "UGX 6,000,000",
    paid: "UGX 4,000,000",
    due: "UGX 2,000,000",
    grossPaid: "UGX 4,000,000",
    runningBalance: "UGX 2,000,000",
    totalCredit: "UGX 200,000",
    tuitionBill: "UGX 4,000,000",
    tuitionPaid: "UGX 3,000,000",
    tuitionDue: "UGX 1,000,000",
    functionalBill: "UGX 2,000,000",
    functionalPaid: "UGX 1,000,000",
    functionalDue: "UGX 1,000,000",
    prepaymentBalance: "UGX 800,000",
  },
  {
    key: "5",
    code: "CIT105",
    program: "CIT",
    year: "2024",
    studentsBilled: 40,
    totalBill: "UGX 4,000,000",
    paid: "UGX 3,000,000",
    due: "UGX 1,000,000",
    grossPaid: "UGX 3,000,000",
    runningBalance: "UGX 1,000,000",
    totalCredit: "UGX 100,000",
    tuitionBill: "UGX 2,500,000",
    tuitionPaid: "UGX 2,000,000",
    tuitionDue: "UGX 500,000",
    functionalBill: "UGX 1,500,000",
    functionalPaid: "UGX 1,000,000",
    functionalDue: "UGX 500,000",
    prepaymentBalance: "UGX 500,000",
  },
  {
    key: "6",
    code: "EE106",
    program: "BSc Electrical Engineering",
    year: "2024",
    studentsBilled: 30,
    totalBill: "UGX 3,500,000",
    paid: "UGX 2,500,000",
    due: "UGX 1,000,000",
    grossPaid: "UGX 2,500,000",
    runningBalance: "UGX 1,000,000",
    totalCredit: "UGX 150,000",
    tuitionBill: "UGX 2,000,000",
    tuitionPaid: "UGX 1,500,000",
    tuitionDue: "UGX 500,000",
    functionalBill: "UGX 1,500,000",
    functionalPaid: "UGX 1,000,000",
    functionalDue: "UGX 500,000",
    prepaymentBalance: "UGX 300,000",
  },
  {
    key: "7",
    code: "MBA107",
    program: "MBA",
    year: "2024",
    studentsBilled: 70,
    totalBill: "UGX 7,000,000",
    paid: "UGX 5,000,000",
    due: "UGX 2,000,000",
    grossPaid: "UGX 5,000,000",
    runningBalance: "UGX 2,000,000",
    totalCredit: "UGX 400,000",
    tuitionBill: "UGX 4,500,000",
    tuitionPaid: "UGX 3,500,000",
    tuitionDue: "UGX 1,000,000",
    functionalBill: "UGX 2,500,000",
    functionalPaid: "UGX 1,500,000",
    functionalDue: "UGX 1,000,000",
    prepaymentBalance: "UGX 600,000",
  },
];

const RevenueTableComponent = () => {
  const [data, setData] = useState(initialData);

  const fetchData = async (params) => {
    console.log("fetchData params:", params);
    await waitTime(2000);
    return {
      data: initialData,
      success: true,
    };
  };

  return (
    <ConfigProvider locale={enUS}>
      <ProTable
        className="custom-table"
        columns={columns}
        request={fetchData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content", y: 400 }} // Scroll settings for horizontal and vertical scroll
        search={false} // Disable the search bar
        dateFormatter="string"
        // rowSelection={{}}
      />
    </ConfigProvider>
  );
};

export default RevenueTableComponent;
