import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { Input, Typography, Table as AntTable, ConfigProvider } from "antd";
import "./rowStyles.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  selectApplicantSelectedRowKey,
  selectApplicantsSummary,
  setApplicantSelectedRowKey,
  setApplications,
  setLoadingApplications,
  setSelectedApplicantSummary,
} from "src/app/theme-layouts/layout3/modules/admissions/admissionsSlice.js";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

// Dummy data to replace GraphQL query
const dummyApplications = [
  {
    id: "1",
    admissions_id: "ADM001",
    course_id: "CRS001",
    campus_id: "CAMP001",
    applicant: {
      surname: "Doe",
      other_names: "John",
      email: "john.doe@example.com",
    },
    program_choices: [
      {
        id: "PC001",
        course: { course_code: "CS101", course_title: "Computer Science" },
      },
    ],
  },
  {
    id: "2",
    admissions_id: "ADM002",
    course_id: "CRS002",
    campus_id: "CAMP001",
    applicant: {
      surname: "Smith",
      other_names: "Jane",
      email: "jane.smith@example.com",
    },
    program_choices: [
      {
        id: "PC002",
        course: {
          course_code: "ME201",
          course_title: "Mechanical Engineering",
        },
      },
    ],
  },
  {
    id: "3",
    admissions_id: "ADM003",
    course_id: "CRS003",
    campus_id: "CAMP002",
    applicant: {
      surname: "Brown",
      other_names: "Alice",
      email: "alice.brown@example.com",
    },
    program_choices: [
      {
        id: "PC003",
        course: {
          course_code: "BUS101",
          course_title: "Business Administration",
        },
      },
    ],
  },
];

function getUniqueCampuses(applicantsSummary) {
  const uniqueCampuses = [];
  const seenCampuses = new Set();

  applicantsSummary.forEach(({ campus_id, campus_title }) => {
    if (!seenCampuses.has(campus_id)) {
      seenCampuses.add(campus_id);
      uniqueCampuses.push({ campus_id, campus_title, unique: true });
    }
  });

  return uniqueCampuses;
}

const _columns = [
  {
    title: "#",
    key: "index",
    width: "15%",
    render: (text, record, index) => {
      if (record.unique) {
        return (
          <span className="font-semibold text-blue-600">
            {`${record.campus_title} CAMPUS`}
          </span>
        );
      }
      return index + 1;
    },
    onCell: (record) => {
      if (record.unique) {
        return { colSpan: 3 };
      }
      return {};
    },
  },
  {
    title: "Course code",
    dataIndex: "course_code",
    key: "course_code",
    onCell: (record) => {
      if (record.unique) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: "No. Of Stds",
    dataIndex: "student_count",
    key: "student_count",
    render: (text, record, index) => {
      return <span className="font-semibold text-blue-600">{text}</span>;
    },
    onCell: (record) => {
      if (record.unique) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
];

const DemoSidebar = React.memo(() => {
  const selectedRowKey = useSelector(selectApplicantSelectedRowKey);
  const applicantsSummary = useSelector(selectApplicantsSummary);
  const dispatch = useDispatch();
  const uniqueCampuses = getUniqueCampuses(applicantsSummary);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    setExpandedRowKeys(uniqueCampuses.map((c) => c.campus_id));
  }, [applicantsSummary]);

  const handleRowClick = (row) => {
    dispatch(setSelectedApplicantSummary(row));
    // Filter dummy applications based on the selected row
    const filteredApplications = dummyApplications.filter(
      (app) =>
        app.admissions_id === row.admissions_id &&
        app.course_id === row.course_id &&
        app.campus_id === row.campus_id
    );
    dispatch(setApplications(filteredApplications));
    dispatch(setLoadingApplications(false));
  };

  const expandedRowRender = (record) => {
    const expandedData = applicantsSummary.filter(
      (summary) => summary.campus_id === record.campus_id
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderRadius: 0,
              borderRadiusLG: 0,
              rowHoverBg: "#cce5ff",
            },
          },
        }}
      >
        <AntTable
          columns={[
            {
              title: "#",
              key: "index",
              width: "16%",
              render: (text, record, index) => {
                if (record.key === "MAIN") {
                  return (
                    <span className="font-semibold text-blue-600">MAIN</span>
                  );
                }
                return index + 1;
              },
            },
            {
              title: "Course code",
              dataIndex: "course_code",
              key: "course_code",
            },
            {
              title: "No. Of Stds",
              dataIndex: "student_count",
              key: "student_count",
              render: (text, record, index) => {
                return (
                  <span className="font-semibold text-blue-600">{text}</span>
                );
              },
              width: "41%",
            },
          ]}
          dataSource={expandedData}
          rowKey={(row) => `${row.campus_id}-${row.course_id}`}
          pagination={false}
          className="nested-table"
          showHeader={false}
          onRow={(record) => ({
            onClick: () => {
              dispatch(
                setApplicantSelectedRowKey(
                  `${record.campus_id}-${record.course_id}`
                )
              );
              handleRowClick(record);
            },
          })}
          rowClassName={(record) =>
            `${record.campus_id}-${record.course_id}` === selectedRowKey
              ? "custom-selected-row"
              : ""
          }
          bordered
          size="small"
          summary={(pageData) => {
            let totalStds = 0;
            pageData.forEach((data) => {
              totalStds += parseInt(data.student_count);
            });
            return (
              <AntTable.Summary.Row style={{ borderBottom: "none" }}>
                <AntTable.Summary.Cell
                  colSpan={1}
                  style={{ borderBottom: "none" }}
                ></AntTable.Summary.Cell>
                <AntTable.Summary.Cell style={{ borderBottom: "none" }}>
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    TOTAL
                  </span>
                </AntTable.Summary.Cell>
                <AntTable.Summary.Cell style={{ borderBottom: "none" }}>
                  <span style={{ fontWeight: "bold" }}>{totalStds}</span>
                </AntTable.Summary.Cell>
              </AntTable.Summary.Row>
            );
          }}
        />
      </ConfigProvider>
    );
  };

  return (
    <div className="px-0 py-0">
      <Box
        sx={{ backgroundColor: "#2f405d" }}
        className="p-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          padding: "4px 10px",
        }}
      >
        <Typography.Text strong style={{ color: "#fff" }}>
          Applicants Summary
        </Typography.Text>
        <div>
          <Tooltip title="Reload">
            <Refresh
              onClick={() => {
                dispatch(
                  showMessage({
                    message: "Reload clicked",
                    variant: "info",
                  })
                );
              }}
              fontSize=""
              color="white"
              style={{ color: "white", fontSize: 25, cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      </Box>
      <div style={{ padding: 7 }}>
        <Input size="small" placeholder="Search..." />
      </div>
      <AntTable
        columns={_columns}
        dataSource={uniqueCampuses}
        rowKey={"campus_id"}
        expandable={{
          expandedRowRender,
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys((prevKeys) => {
              if (!expanded) {
                return prevKeys.filter((id) => id !== record.campus_id);
              } else {
                return [...new Set([...prevKeys, record.campus_id])];
              }
            });
          },
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <ChevronDown
                className="cursor-pointer"
                onClick={(e) => onExpand(record, e)}
              />
            ) : (
              <ChevronRight
                className="cursor-pointer"
                onClick={(e) => onExpand(record, e)}
              />
            ),
        }}
        size="small"
        pagination={false}
        scroll={{ y: "calc(100vh - 260px)" }}
      />
    </div>
  );
});

export default DemoSidebar;
