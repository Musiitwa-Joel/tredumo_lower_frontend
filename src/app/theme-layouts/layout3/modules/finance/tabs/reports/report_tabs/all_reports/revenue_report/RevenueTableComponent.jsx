import React, { useRef, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag, ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US"; // Import English locale

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
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "Revenue Category",
    dataIndex: "category",
    // copyable: true,
    ellipsis: true,
    tooltip:
      "The category of revenue, such as tuition fees or accommodation fees.",
  },
  {
    title: "Revenue Code",
    dataIndex: "code",
    copyable: true,
    ellipsis: true,
    tooltip: "A unique code assigned to each revenue category.",
  },
  {
    title: "IFMS COA Code",
    dataIndex: "ifmsCoaCode",
    copyable: true,
    ellipsis: true,
    tooltip:
      "The Integrated Financial Management System Chart of Accounts code.",
  },
  {
    title: "Opening Balance",
    dataIndex: "openingBalance",
    // copyable: true,
    ellipsis: true,
    tooltip: "The balance at the beginning of the period.",
  },
  {
    title: "Total Revenue for this Period",
    dataIndex: "totalRevenue",
    // copyable: true,
    ellipsis: true,
    tooltip: "The total amount of revenue generated during this period.",
  },
  {
    title: "Collections for this Period",
    dataIndex: "collections",
    // copyable: true,
    ellipsis: true,
    tooltip: "The total amount collected during this period.",
  },
  {
    title: "Prior Year Receipts",
    dataIndex: "priorYearReceipts",
    // copyable: true,
    ellipsis: true,
    tooltip: "Receipts from the previous year carried over to this period.",
  },
];

const initialData = [
  {
    id: 1,
    category: "Tuition Fees",
    code: "TF001",
    ifmsCoaCode: "IFMS12345",
    openingBalance: "UGX 10,000",
    totalRevenue: "UGX 50,000",
    collections: "UGX 40,000",
    priorYearReceipts: "UGX 5,000",
    url: "https://example.com/1",
  },
  {
    id: 2,
    category: "Accommodation Fees",
    code: "AF002",
    ifmsCoaCode: "IFMS12346",
    openingBalance: "UGX 5,000",
    totalRevenue: "UGX 20,000",
    collections: "UGX 15,000",
    priorYearReceipts: "UGX 2,000",
    url: "https://example.com/2",
  },
  {
    id: 3,
    category: "Library Fees",
    code: "LF003",
    ifmsCoaCode: "IFMS12347",
    openingBalance: "UGX 3,000",
    totalRevenue: "UGX 12,000",
    collections: "UGX 9,000",
    priorYearReceipts: "UGX 1,500",
    url: "https://example.com/3",
  },
  {
    id: 4,
    category: "Sports Fees",
    code: "SF004",
    ifmsCoaCode: "IFMS12348",
    openingBalance: "UGX 2,500",
    totalRevenue: "UGX 10,000",
    collections: "UGX 7,500",
    priorYearReceipts: "UGX 1,000",
    url: "https://example.com/4",
  },
  {
    id: 5,
    category: "Medical Fees",
    code: "MF005",
    ifmsCoaCode: "IFMS12349",
    openingBalance: "UGX 4,000",
    totalRevenue: "UGX 15,000",
    collections: "UGX 10,000",
    priorYearReceipts: "UGX 2,000",
    url: "https://example.com/5",
  },
  {
    id: 6,
    category: "Lab Fees",
    code: "LB006",
    ifmsCoaCode: "IFMS12350",
    openingBalance: "UGX 6,000",
    totalRevenue: "UGX 18,000",
    collections: "UGX 12,000",
    priorYearReceipts: "UGX 3,000",
    url: "https://example.com/6",
  },
  {
    id: 7,
    category: "Development Fees",
    code: "DF007",
    ifmsCoaCode: "IFMS12351",
    openingBalance: "UGX 8,000",
    totalRevenue: "UGX 25,000",
    collections: "UGX 17,000",
    priorYearReceipts: "UGX 4,000",
    url: "https://example.com/7",
  },
  {
    id: 8,
    category: "Exam Fees",
    code: "EF008",
    ifmsCoaCode: "IFMS12352",
    openingBalance: "UGX 7,000",
    totalRevenue: "UGX 20,000",
    collections: "UGX 14,000",
    priorYearReceipts: "UGX 3,500",
    url: "https://example.com/8",
  },
  {
    id: 9,
    category: "Graduation Fees",
    code: "GF009",
    ifmsCoaCode: "IFMS12353",
    openingBalance: "UGX 5,000",
    totalRevenue: "UGX 16,000",
    collections: "UGX 11,000",
    priorYearReceipts: "UGX 2,500",
    url: "https://example.com/9",
  },
  {
    id: 10,
    category: "Transport Fees",
    code: "TF010",
    ifmsCoaCode: "IFMS12354",
    openingBalance: "UGX 4,500",
    totalRevenue: "UGX 14,000",
    collections: "UGX 9,000",
    priorYearReceipts: "UGX 2,000",
    url: "https://example.com/10",
  },
  {
    id: 11,
    category: "Activity Fees",
    code: "AF011",
    ifmsCoaCode: "IFMS12355",
    openingBalance: "UGX 6,500",
    totalRevenue: "UGX 19,000",
    collections: "UGX 13,000",
    priorYearReceipts: "UGX 3,000",
    url: "https://example.com/11",
  },
  {
    id: 12,
    category: "ICT Fees",
    code: "IF012",
    ifmsCoaCode: "IFMS12356",
    openingBalance: "UGX 5,500",
    totalRevenue: "UGX 17,000",
    collections: "UGX 11,000",
    priorYearReceipts: "UGX 2,500",
    url: "https://example.com/12",
  },
  {
    id: 13,
    category: "Utility Fees",
    code: "UF013",
    ifmsCoaCode: "IFMS12357",
    openingBalance: "UGX 3,500",
    totalRevenue: "UGX 11,000",
    collections: "UGX 7,000",
    priorYearReceipts: "UGX 1,500",
    url: "https://example.com/13",
  },
  {
    id: 14,
    category: "Miscellaneous Fees",
    code: "MF014",
    ifmsCoaCode: "IFMS12358",
    openingBalance: "UGX 2,000",
    totalRevenue: "UGX 8,000",
    collections: "UGX 5,000",
    priorYearReceipts: "UGX 1,000",
    url: "https://example.com/14",
  },
  {
    id: 15,
    category: "Student Welfare Fees",
    code: "SWF015",
    ifmsCoaCode: "IFMS12359",
    openingBalance: "UGX 4,000",
    totalRevenue: "UGX 13,000",
    collections: "UGX 9,000",
    priorYearReceipts: "UGX 2,000",
    url: "https://example.com/15",
  },
];

const RevenueTableComponent = () => {
  const actionRef = useRef();
  const [data, setData] = useState(initialData);

  return (
    <ConfigProvider locale={enUS}>
      <ProTable
        size="small"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(2000);

          // Directly return your initialData without fetching from an API
          return {
            data: initialData,
            success: true,
          };
        }}
        editable={{
          type: "multiple",
        }}
        columnsState={{
          persistenceKey: "pro-table-singe-demos",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true },
          },
          onChange(value) {
            console.log("value: ", value);
          },
        }}
        rowKey="id"
        search={false} // Disable the top form
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 8,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="Revenue Report for Nkumba University"
        dataSource={data} // Provide the initial data source here
      />
    </ConfigProvider>
  );
};

export default RevenueTableComponent;
