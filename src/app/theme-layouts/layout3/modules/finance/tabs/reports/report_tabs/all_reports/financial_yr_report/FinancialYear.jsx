import React, { useState } from "react";
import { Select, Space, Button, Tooltip, Divider, Card } from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import "./styles.css";
import FinancialYearTable from "./FinancialYearTable.jsx";
import FinancialYearVisualisation from "./FinancialYearVisualisation";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import FinancialDashboard from "./FinancialDashboard";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

function SchoolRevenue() {
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
            size="middle"
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
          <Select
            size="middle"
            placeholder="Select School"
            style={{ width: 350 }}
            onChange={(value) => {
              setSemester(value);
              handleChange(value);
            }}
            options={[
              { value: "SBA", label: "School of Business Administration" },
              { value: "SOL", label: "School of Law" },
              {
                value: "SEHS",
                label: "School of Education, Humanities, and Sciences",
              },
              { value: "SSS", label: "School of Social Sciences" },
              {
                value: "SCIAD",
                label: "School of Commercial Industrial Art and Design",
              },
              { value: "SCI", label: "School of Computing and Informatics" },
              {
                value: "SGSR",
                label: "School of Graduate Studies and Research",
              },
            ]}
          />
          <Button
            size="middle"
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
              size="middle"
              shape="circle"
              type="dashed"
              style={{ marginLeft: 10 }}
              icon={<DashboardOutlined />}
            />
          </Tooltip>
          <Tooltip title="Export Excel">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              onClick={exportToExcel}
              style={{ marginLeft: 5 }}
              icon={<FileExcelOutlined />}
            />
          </Tooltip>
          <Tooltip title="Export PDF">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              onClick={exportToPDF}
              style={{ marginLeft: 5 }}
              icon={<FilePdfOutlined />}
            />
          </Tooltip>
          <Tooltip title="Print report">
            <Button
              size="middle"
              shape="circle"
              type="dashed"
              style={{ marginLeft: 5 }}
              icon={<PrinterOutlined />}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Financial Dashboard */}
      <FinancialDashboard
        totalRevenue={12000000000}
        totalExpenses={8000000}
        netProfit={4000000}
        cashFlow={500000}
      />

      {/* Table */}
      <div>
        <FinancialYearTable />
      </div>

      {/* <Divider
        style={{
          borderColor: "#00008B",
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      >
        DATA VISUALISATION OF REVENUE FROM EACH SCHOOL
      </Divider>

      <div style={{ marginTop: 0 }}>
        <FinancialYearVisualisation />
      </div> */}
    </div>
  );
}

export default SchoolRevenue;
