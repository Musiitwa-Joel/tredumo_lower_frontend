import React, { useState } from "react";
import { Table, Modal } from "antd";
import ReactECharts from "echarts-for-react";
import "./styles.css";

const data = [
  {
    key: "1",
    category: "Salaries and Wages",
    description:
      "Payments to faculty, administrative staff, support staff, and other employees",
    estimatedAnnualCost: 5000000000,
    allocations: [
      { name: "Faculty", value: 3000000000 },
      { name: "Administrative Staff", value: 1500000000 },
      { name: "Support Staff", value: 500000000 },
    ],
  },
  {
    key: "2",
    category: "Utilities",
    description:
      "Costs for electricity, water, gas, internet, and other essential utilities",
    estimatedAnnualCost: 500000000,
    allocations: [
      { name: "Electricity", value: 200000000 },
      { name: "Water", value: 100000000 },
      { name: "Gas", value: 100000000 },
      { name: "Internet", value: 50000000 },
      { name: "Other Utilities", value: 50000000 },
    ],
  },
  // Add other categories similarly...
];

const OperationalExpensesTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);

  const handleRowClick = (record) => {
    setModalData(record.allocations);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Estimated Annual Cost (UGX)",
      dataIndex: "estimatedAnnualCost",
      key: "estimatedAnnualCost",
      render: (text) => <span>{text}</span>,
    },
  ];

  const getPieChartOptions = () => {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Allocation",
          type: "pie",
          radius: "50%",
          data: modalData.map((item) => ({
            value: item.value,
            name: item.name,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  };

  return (
    <>
      <Table
        className="custom-table"
        size="small"
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Allocation Breakdown"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <ReactECharts option={getPieChartOptions()} style={{ height: 400 }} />
      </Modal>
    </>
  );
};

export default OperationalExpensesTable;
