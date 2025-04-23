import { Button } from "antd";
import React from "react";

const CourseUnitsExport = ({ courseUnits }) => {
  const exportToCSV = () => {
    // Sort data by year and semester
    const sortedData = [...courseUnits].sort((a, b) => {
      if (a.course_unit_year !== b.course_unit_year) {
        return a.course_unit_year - b.course_unit_year;
      }
      return a.course_unit_sem - b.course_unit_sem;
    });

    // Create CSV header
    const csvRows = [
      "Year,Semester,Course Code,Course Title,Credit Units,Course Level",
    ];

    let currentYear = null;
    let currentSem = null;

    sortedData.forEach((unit) => {
      // Add empty line before new year for better visual separation
      if (currentYear !== unit.course_unit_year) {
        currentYear = unit.course_unit_year;
        csvRows.push("");
        csvRows.push(`Year ${currentYear},,,,,'`);
      }

      // Add semester group if new semester
      if (
        currentSem !== unit.course_unit_sem ||
        currentYear !== unit.course_unit_year
      ) {
        currentSem = unit.course_unit_sem;
        csvRows.push(`Year ${currentYear},Semester ${currentSem},,,,`);
      }

      // Add course unit data
      // Escape any commas in the text fields
      const escapedTitle = unit.course_unit_title.includes(",")
        ? `"${unit.course_unit_title}"`
        : unit.course_unit_title;

      csvRows.push(
        `Year ${currentYear},` +
          `Semester ${currentSem},` +
          `${unit.course_unit_code},` +
          `${escapedTitle},` +
          `${unit.credit_units},` +
          `${unit.course_unit_level}`
      );
    });

    // Create blob and download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "course_units.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={exportToCSV}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Export Course Units
    </Button>
  );
};

export default CourseUnitsExport;
