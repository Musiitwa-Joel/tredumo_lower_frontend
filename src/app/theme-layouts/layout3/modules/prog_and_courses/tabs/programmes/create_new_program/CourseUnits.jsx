import React from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCourseUnits,
  selectCreateNewCourse,
  selectSelectedCourseVersion,
  selectSelectedUnit,
  setUploadModulesModalOpen,
  updateCreateModuleModalOpen,
} from "../../../store/progAndCoursesSlice";
import { Table, Space, Input, Button, ConfigProvider, theme } from "antd";

import TestTable from "../TestTable";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";

const { Search } = Input;

function CourseUnits() {
  const createNewCourse = useSelector(selectCreateNewCourse);
  const dispatch = useDispatch();
  const courseUnits = useSelector(selectCourseUnits);
  const selectedCourseVersion = useSelector(selectSelectedCourseVersion);
  //   const selectedUnit = useSelector(selectSelectedP)

  const handleCreateNewModule = () => {
    dispatch(updateCreateModuleModalOpen(true));
  };

  const handleUploadModule = () => {
    dispatch(setUploadModulesModalOpen(true));
  };

  //   const exportToCSV = (courseUnits) => {
  //     // Sort data by year and semester
  //     const sortedData = [...courseUnits].sort((a, b) => {
  //       if (a.course_unit_year !== b.course_unit_year) {
  //         return a.course_unit_year - b.course_unit_year;
  //       }
  //       return a.course_unit_sem - b.course_unit_sem;
  //     });

  //     // Create CSV header
  //     const csvRows = [
  //       "Year,Semester,Course Code,Course Title,Credit Units,Course Level",
  //     ];

  //     let currentYear = null;
  //     let currentSem = null;

  //     sortedData.forEach((unit) => {
  //       // Add empty line before new year for better visual separation
  //       if (currentYear !== unit.course_unit_year) {
  //         currentYear = unit.course_unit_year;
  //         csvRows.push("");
  //         csvRows.push(`Year ${currentYear},,,,,'`);
  //       }

  //       // Add semester group if new semester
  //       if (
  //         currentSem !== unit.course_unit_sem ||
  //         currentYear !== unit.course_unit_year
  //       ) {
  //         currentSem = unit.course_unit_sem;
  //         csvRows.push(`Year ${currentYear},Semester ${currentSem},,,,`);
  //       }

  //       // Add course unit data
  //       // Escape any commas in the text fields
  //       const escapedTitle = unit.course_unit_title.includes(",")
  //         ? `"${unit.course_unit_title}"`
  //         : unit.course_unit_title;

  //       csvRows.push(
  //         `Year ${currentYear},` +
  //           `Semester ${currentSem},` +
  //           `${unit.course_unit_code},` +
  //           `${escapedTitle},` +
  //           `${unit.credit_units},` +
  //           `${unit.course_unit_level}`
  //       );
  //     });

  //     // Create blob and download
  //     const csvContent = csvRows.join("\n");
  //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //     const link = document.createElement("a");
  //     const url = URL.createObjectURL(blob);

  //     link.setAttribute("href", url);
  //     link.setAttribute("download", "course_units.csv");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   };

  const exportToCSV = (data) => {
    // Initialize an array to hold the structured data
    const formattedData = [
      [
        `COURSE UNITS FOR ${selectedCourseVersion?.course.course_title} ${selectedCourseVersion?.label}`,
        "",
        "",
        "",
        "",
        "",
      ], // Title row spanning multiple columns
      [
        "Code",
        "Title",
        "Credit Units",
        "Study Yr",
        "Semester",
        "Level",
        "Grading",
        "Added by",
        "Added on",
        "Last modified by",
        "Last modified on",
      ], // Column headers
    ];

    // Group data by year and semester
    const groupedData = data.reduce((acc, item) => {
      const year = `Year ${item.course_unit_year}`;
      const semester = `Sem ${item.course_unit_sem}`;

      if (!acc[year]) acc[year] = {};
      if (!acc[year][semester]) acc[year][semester] = [];

      acc[year][semester].push([
        item.course_unit_code,
        item.course_unit_title,
        item.credit_units,
        item.course_unit_year,
        item.course_unit_sem,
        item.course_unit_level,
        item.grading_id,
        item.added_user
          ? `${item.added_user.title} ${item.added_user.staff_name}`
          : null,
        item.added_on ? `${formatDateString(parseInt(item.added_on))}` : null,
        item.last_modified_user
          ? `${item.last_modified_user.title} ${item.last_modified_user.staff_name}`
          : null,
        item.last_modified_on
          ? `${formatDateString(parseInt(item.last_modified_on))}`
          : null,
      ]);

      return acc;
    }, {});

    // Prepare the data with merged cells for each grouping
    Object.entries(groupedData).forEach(([year, semesters]) => {
      Object.entries(semesters).forEach(([semester, courseUnits]) => {
        // Add the merged header row for the year and semester
        formattedData.push([`${year}, ${semester}`, "", "", "", "", ""]);

        // Add the course unit rows under the merged header
        courseUnits.forEach((unit) => formattedData.push(unit));

        // Add an empty row after each grouping for visual spacing
        formattedData.push([]);
      });
    });

    // Create the worksheet from formatted data
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

    // Define merges for title and grouped headers
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Merge cells for title
    ];

    // Additional merges for each grouped header
    let startRow = 2; // Start after title and headers
    Object.values(groupedData).forEach((semesters) => {
      Object.values(semesters).forEach((courseUnits) => {
        merges.push({ s: { r: startRow, c: 0 }, e: { r: startRow, c: 5 } });
        startRow += courseUnits.length + 2; // Move past the rows and empty row after each group
      });
    });
    worksheet["!merges"] = merges;

    // Apply bold and larger font size for the title
    worksheet["A1"].s = {
      font: { bold: true, sz: 16 }, // Bold and font size 16
      alignment: { horizontal: "center" }, // Center-align the title
    };

    // Adjust column widths for better readability
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 35 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
    ];

    // Create the workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

    // Export to Excel file
    XLSX.writeFile(
      workbook,
      `${selectedCourseVersion?.course.course_title} ${selectedCourseVersion?.label} MODDULES.xlsx`
    );
  };
  return (
    <div
      style={{
        backgroundColor: "#ededed",
      }}
    >
      <Space
        style={{
          // paddingLeft: 10,
          padding: "5px 10px",
        }}
        size={15}
      >
        <Button
          size="small"
          type="text"
          // style={{
          //   color: "#fff",
          // }}
          onClick={handleCreateNewModule}
        >
          Create New Module
        </Button>

        <Button
          size="small"
          type="text"
          // style={{
          //   color: "#fff",
          // }}
          onClick={handleUploadModule}
        >
          Upload Modules
        </Button>

        <Button
          size="small"
          type="text"
          onClick={() => exportToCSV(courseUnits)}
          // style={{
          //   color: "#fff",
          // }}
        >
          Download Modules
        </Button>
      </Space>
      <ConfigProvider
        theme={{
          algorithm: theme.compactAlgorithm,
        }}
      >
        {!createNewCourse ? <TestTable /> : <Table dataSource={[]} />}
      </ConfigProvider>
    </div>
  );
}

export default CourseUnits;
