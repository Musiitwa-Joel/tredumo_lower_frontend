import React, { useState } from "react";
import { Select, Space, Button, Tooltip, Divider } from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import OperationalExpensesTable from "./OperationalExpensesTable";
import OperationalExpensesVisualisation from "./OperationalExpensesVisualisation";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

function GrantsAndDonations() {
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [position, setPosition] = useState("end");

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
          <Select
            size="small"
            placeholder="Select Academic year"
            style={{ width: 200 }}
            onChange={(value) => {
              setAcademicYear(value);
              handleChange(value);
            }}
            options={[
              { value: "2024/2025", label: "2024-2025" },
              { value: "2023/2024", label: "2023-2023" },
              { value: "2022/2023", label: "2022-2023" },
              { value: "2021/2022", label: "2021-2022" },
            ]}
          />

          <Button
            size="small"
            icon={<SearchOutlined />}
            iconPosition={position}
            type="default"
            loading={loading}
            onClick={handleSearch}
            disabled={!academicYear || !semester}
          >
            Search
          </Button>
        </Space>

        {/* Export buttons */}

        <Space>
          <Tooltip title="Visualise Data">
            <Button
              size="small"
              shape="circle"
              type="dashed"
              // onClick={exportToExcel}
              style={{ marginLeft: 10 }}
              icon={<DashboardOutlined />}
            />
          </Tooltip>
          <Tooltip title="Export Excel">
            <Button
              size="small"
              shape="circle"
              type="dashed"
              onClick={exportToExcel}
              style={{ marginLeft: 5 }}
              icon={<FileExcelOutlined />}
            />
          </Tooltip>

          <Tooltip title="Export PDF">
            <Button
              size="small"
              shape="circle"
              type="dashed"
              onClick={exportToPDF}
              style={{ marginLeft: 5 }}
              icon={<FilePdfOutlined />}
            />
          </Tooltip>

          <Tooltip title="Print report">
            <Button
              size="small"
              shape="circle"
              type="dashed"
              style={{ marginLeft: 5 }}
              icon={<PrinterOutlined />}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Table */}
      <div style={{ marginTop: 5 }}>
        <OperationalExpensesTable />
      </div>
      <Divider
        style={{
          borderColor: "#00008B",
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      >
        DATA VISUALISATION FOR OPERATIONAL EXPENSES ()
      </Divider>
      <>
        <div style={{ marginTop: 0 }}>
          <OperationalExpensesVisualisation />{" "}
        </div>
      </>
    </div>
  );
}

export default GrantsAndDonations;
