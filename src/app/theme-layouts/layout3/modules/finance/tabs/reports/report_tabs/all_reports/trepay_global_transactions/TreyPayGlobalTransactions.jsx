import React, { useState } from "react";
import {
  Table,
  Space,
  DatePicker,
  Input,
  Button,
  Form,
  Tooltip,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
// import "jspdf-autotable";

const { RangePicker } = DatePicker;

const TreypayGlobalReport = () => {
  const [form] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      paymentDate: "2023-09-01",
      refNo: "TXN123456",
      amount: 1500000,
      bank: "Stanbic Bank",
      branch: "Kampala",
      payerName: "John Doe",
      payerID1: "2000100121",
      payerID2: "NIN123456",
      paymentType: "Tuition",
      xeroInvoiceNo: "INV12345",
    },
    {
      key: "2",
      paymentDate: "2023-10-01",
      refNo: "TXN123457",
      amount: 200000,
      bank: "ABSA Bank",
      branch: "Entebbe",
      payerName: "Jane Smith",
      payerID1: "2000100122",
      payerID2: "NIN123457",
      paymentType: "Library Fee",
      xeroInvoiceNo: "INV12346",
    },
  ];

  const [data, setData] = useState(dataSource);

  const columns = [
    {
      title: "Payment Date",
      ellipsis: true,
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "REF No",
      ellipsis: true,
      dataIndex: "refNo",
      key: "refNo",
    },
    {
      title: "Amount (UGX)",
      ellipsis: true,
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span>{text.toLocaleString()}</span>,
    },
    {
      title: "Bank",
      ellipsis: true,
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "Branch",
      ellipsis: true,
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Payer's Name",
      ellipsis: true,
      dataIndex: "payerName",
      key: "payerName",
    },
    {
      title: "Payer's ID 1",
      ellipsis: true,
      dataIndex: "payerID1",
      key: "payerID1",
    },
    {
      title: "Payer's ID 2",
      ellipsis: true,
      dataIndex: "payerID2",
      key: "payerID2",
    },
    {
      title: "Payment Type",
      ellipsis: true,
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Xero Invoice No",
      ellipsis: true,
      dataIndex: "xeroInvoiceNo",
      key: "xeroInvoiceNo",
    },
  ];

  const handleSearch = (values) => {
    const { dateRange, studentNumber } = values;
    // Apply filtering logic here based on dateRange and studentNumber
    console.log(dateRange, studentNumber);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Receivables");
    XLSX.writeFile(wb, "receivables.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Receivables Data", 20, 20);
    doc.autoTable({
      head: [columns.map((column) => column.title)],
      body: data.map((row) => columns.map((column) => row[column.dataIndex])),
    });
    doc.save("receivables.pdf");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Space wrap>
          <Form form={form} layout="inline" onFinish={handleSearch}>
            <Form.Item name="dateRange">
              <RangePicker />
            </Form.Item>
            <Form.Item name="studentNumber">
              <Input placeholder="Enter Student Number" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Space>

        <Space>
          <Tooltip title="Visualise Data">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              icon={<DashboardOutlined />}
            />
          </Tooltip>
          <Tooltip title="Export Excel">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              onClick={exportToExcel}
              icon={<FileExcelOutlined />}
            />
          </Tooltip>
          <Tooltip title="Export PDF">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              onClick={exportToPDF}
              icon={<FilePdfOutlined />}
            />
          </Tooltip>
          <Tooltip title="Print report">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              icon={<PrinterOutlined />}
            />
          </Tooltip>
        </Space>
      </div>

      <Table dataSource={data} columns={columns} />
      {/* <Divider
        style={{
          borderColor: "#00008B",
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      >
        DATA VISUALISATION
      </Divider> */}
    </div>
  );
};

export default TreypayGlobalReport;
