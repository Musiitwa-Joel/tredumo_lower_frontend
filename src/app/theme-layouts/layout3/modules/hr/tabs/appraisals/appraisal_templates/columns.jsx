import React from "react";
import { Form, Radio } from "antd";
import { tableStyles } from "./styles";

export const getTableColumns = () => [
  {
    title: "",
    dataIndex: "label",
    key: "label",
    width: "50%",
    render: (text, record) => (
      <div className="py-2">
        <div className="font-bold">{text}</div>
        {record.description && (
          <div style={{ marginLeft: "20px" }}>{record.description}</div>
        )}
      </div>
    ),
    onCell: tableStyles.cell,
  },
  {
    title: () => (
      <div style={tableStyles.columnHeader}>
        Exceeds
        <br />
        Requirements
      </div>
    ),
    dataIndex: "rating",
    key: "exceeds",
    width: "12.5%",
    align: "center",
    onCell: tableStyles.cell,
    onHeaderCell: tableStyles.headerCell,
    render: (_, record) => (
      <p></p>
      // <Form.Item
      //   name={["ratings", record.key]}
      //   rules={[
      //     {
      //       required: true,
      //       message: "Required",
      //     },
      //   ]}
      //   noStyle
      // >
      //   <Radio.Group>
      //     <Radio value="exceeds" style={{ margin: 0 }} />
      //   </Radio.Group>
      // </Form.Item>
    ),
  },
  {
    title: () => (
      <div style={tableStyles.columnHeader}>
        Meets
        <br />
        Requirements
      </div>
    ),
    dataIndex: "rating",
    key: "meets",
    width: "12.5%",
    align: "center",
    onCell: tableStyles.cell,
    onHeaderCell: tableStyles.headerCell,
    render: (_, record) => (
      <p></p>
      // <Form.Item
      //   name={["ratings", record.key]}
      //   rules={[
      //     {
      //       required: true,
      //       message: "Required",
      //     },
      //   ]}
      //   noStyle
      // >
      //   <Radio.Group>
      //     <Radio value="meets" style={{ margin: 0 }} />
      //   </Radio.Group>
      // </Form.Item>
    ),
  },
  {
    title: () => (
      <div style={tableStyles.columnHeader}>
        Needs
        <br />
        Improvement
      </div>
    ),
    dataIndex: "rating",
    key: "needs",
    width: "12.5%",
    align: "center",
    onCell: tableStyles.cell,
    onHeaderCell: tableStyles.headerCell,
    render: (_, record) => (
      <p></p>
      // <Form.Item
      //   name={["ratings", record.key]}
      //   rules={[
      //     {
      //       required: true,
      //       message: "Required",
      //     },
      //   ]}
      //   noStyle
      // >
      //   <Radio.Group>
      //     <Radio value="needs" style={{ margin: 0 }} />
      //   </Radio.Group>
      // </Form.Item>
    ),
  },
  {
    title: () => (
      <div style={tableStyles.columnHeader}>
        Not
        <br />
        Applicable
      </div>
    ),
    dataIndex: "rating",
    key: "na",
    width: "12.5%",
    align: "center",
    onCell: tableStyles.cell,
    onHeaderCell: tableStyles.headerCell,
    render: (_, record) => (
      <p></p>
      // <Form.Item
      //   name={["ratings", record.key]}
      //   rules={[
      //     {
      //       required: true,
      //       message: "Required",
      //     },
      //   ]}
      //   noStyle
      // >
      //   <Radio.Group>
      //     <Radio value="na" style={{ margin: 0 }} />
      //   </Radio.Group>
      // </Form.Item>
    ),
  },
];
