import React, { useState } from "react";
import {
  Select,
  Space,
  Button,
  Tooltip,
  Divider,
  DatePicker,
  Form,
  Input,
} from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import TreypayTransactionTable from "./TreypayTransactionTable";
import TrepayTransactionsVisualisation from "./TrepayTransactionsVisualisation";
import CardComponent from "./CardComponent";

const { RangePicker } = DatePicker;

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

function TreypayTransaction() {
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [position, setPosition] = useState("end");

  const [form] = Form.useForm();

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Search operation completed.");
    }, 2000);
  };

  // Function to handle Excel export
  const exportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.querySelector(".ant-table"));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Receivables");
    XLSX.writeFile(wb, "receivables.xlsx");
  };

  // Function to handle PDF export
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Receivables Data", 20, 20);
    const table = document.querySelector(".ant-table");
    const rows = [];
    table.querySelectorAll("tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      const rowData = [];
      cells.forEach((cell) => {
        rowData.push(cell.innerText);
      });
      rows.push(rowData);
    });
    doc.autoTable({
      head: [
        Array.from(table.querySelectorAll("th")).map((th) => th.innerText),
      ],
      body: rows,
    });
    doc.save("receivables.pdf");
  };

  return (
    <div>
      {/* Container for the selects, button and export buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space wrap>
          <Form form={form} layout="inline" onFinish={handleSearch}>
            <Form.Item
              name="dateRange"
              rules={[{ required: true, message: "Please select date range!" }]}
            >
              <RangePicker />
            </Form.Item>

            <Form.Item
              name="studentNumber"
              rules={[
                {
                  required: true,
                  message: "Please input student number!",
                },
              ]}
            >
              <Input placeholder="Enter Student Number" />
            </Form.Item>

            <Form.Item>
              <Button
                size="medium"
                icon={<SearchOutlined />}
                type="default"
                htmlType="submit"
                loading={loading}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Space>

        {/* Export buttons */}
        <Space>
          <Tooltip title="Visualise Data">
            <Button
              size="medium"
              shape="circle"
              type="dashed"
              // onClick={exportToExcel}
              style={{ marginLeft: 10 }}
              icon={<DashboardOutlined />}
            />
          </Tooltip>
          <Tooltip title="Export Excel">
            <Button
              size="medium"
              shape="circle"
              type="dashed"
              onClick={exportToExcel}
              style={{ marginLeft: 5 }}
              icon={<FileExcelOutlined />}
            />
          </Tooltip>

          <Tooltip title="Export PDF">
            <Button
              size="medium"
              shape="circle"
              type="dashed"
              onClick={exportToPDF}
              style={{ marginLeft: 5 }}
              icon={<FilePdfOutlined />}
            />
          </Tooltip>

          <Tooltip title="Print report">
            <Button
              size="medium"
              shape="circle"
              type="dashed"
              style={{ marginLeft: 5 }}
              icon={<PrinterOutlined />}
            />
          </Tooltip>
        </Space>
      </div>
      <CardComponent />
      {/* Table */}
      <div style={{ marginTop: 10 }}>
        <TreypayTransactionTable />
      </div>
      {/* <Divider
        style={{
          borderColor: "#00008B",
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      >
        DATA VISUALISATION
      </Divider>
      <div style={{ marginTop: 0 }}>
        <TrepayTransactionsVisualisation />
      </div> */}
    </div>
  );
}

export default TreypayTransaction;
