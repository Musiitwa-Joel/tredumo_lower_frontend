import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

import { Box, Typography } from "@mui/material";
import { Space, Input, Button, ConfigProvider, Table, Dropdown } from "antd";
import { GET_COURSE_UNITS } from "app/theme-layouts/layout3/modules/prog_and_courses/gql/queries";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRegistrationReport,
  selectRegistrationReportLoading,
  selectRegReportInput,
  selectStudentData,
  setRegReportInput,
  setSelecttion,
  setStudentsModalVisible,
} from "../../../store/registrationSlice";
import {
  Delete,
  Download,
  DownloadOutlined,
  Edit,
  OpenInNew,
} from "@mui/icons-material";
import { DOWNLOAD_STDS_REG_REPORT } from "../../../gql/queries";
import { url2 } from "app/configs/apiConfig";

const { Search } = Input;

const handleButtonClick = (e) => {
  message.info("Click on left button.");
  console.log("click left button", e);
};

const items = [
  {
    label: "Students Report",
    key: "download_std_report",
    icon: (
      <Download
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Registration Report",
    key: "2",
    icon: (
      <Download
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
];

const _groupedData = [
  {
    id: 1,
    key: 1,
    school_code: "SBA",
    school_name: "SCHOOL OF BUSINESS ADMINISTRATION",
  },
  {
    id: 2,
    key: 2,
    school_code: "SCI",
    school_name: "SCHOOL OF COMPUTING AND INFORMATICS",
  },
];

function getUniqueSchools(reportSummaries) {
  const uniqueSchools = new Map();

  reportSummaries.forEach(({ school_id, school_code, school_title }) => {
    const key = `${school_code}-${school_title}`;
    if (!uniqueSchools.has(key)) {
      uniqueSchools.set(key, { school_id, school_code, school_title });
    }
  });

  return Array.from(uniqueSchools.values());
}

function ReportTable() {
  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const regReportLoading = useSelector(selectRegistrationReportLoading);
  const regReport = useSelector(selectRegistrationReport);
  const regReportInput = useSelector(selectRegReportInput);

  // console.log("unique", getUniqueSchools(regReport?.report_summary || []));
  const [
    getCourseUnits,
    { error: loadErr, loading: loadingCourseUnits, data: cuRes },
  ] = useLazyQuery(GET_COURSE_UNITS, {
    notifyOnNetworkStatusChange: true,
  });

  const [groupedData, setGroupedData] = useState(_groupedData);
  const [courseUnits, setCourseUnits] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [moduleSearchValue, setModuleSearchValue] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }
  }, [loadErr]);

  useEffect(() => {
    // First, dispatch the full list of course units

    // dispatch(setFilteredCourseUnits(courseUnits));
    let newArr = courseUnits;

    if (moduleSearchValue) {
      // Filter the course units based on the search value
      newArr = courseUnits.filter(
        (cu) =>
          cu.course_unit_title
            .toLowerCase()
            .includes(moduleSearchValue.toLowerCase()) // Use strict equality
      );
    }

    const grouped = {};

    // Use newArr instead of filteredCourseUnits
    newArr.forEach((course) => {
      const yearSemKey = `${course.course_unit_year}-${course.course_unit_sem}`;

      if (!grouped[yearSemKey]) {
        grouped[yearSemKey] = {
          course_unit_year: course.course_unit_year,
          course_unit_sem: course.course_unit_sem,
          courses: [],
        };
      }

      grouped[yearSemKey].courses.push(course);
    });

    // Convert the grouped data to an array
    let data = Object.values(grouped);

    // Sort the data based on course_unit_year and course_unit_sem
    data.sort((a, b) => {
      if (a.course_unit_year === b.course_unit_year) {
        return a.course_unit_sem - b.course_unit_sem; // Compare by semester if years are the same
      }
      return a.course_unit_year - b.course_unit_year; // Compare by year
    });

    // Dispatch the grouped data
    setGroupedData(data);

    // Set default expanded row keys based on the available data
    const expandedKeys = data.map(
      (group) => `${group.course_unit_year}-${group.course_unit_sem}`
    );
    // dispatch(setDefaultExpandedModuleRowKeys(c));
    setExpandedKeys(expandedKeys);
  }, [courseUnits, moduleSearchValue, dispatch]);

  // useEffect(() => {
  //   groupBySchools(regReport?.report_summary || []);
  // }, [regReport]);

  const loadCourseUnits = async () => {
    const res = await getCourseUnits({
      variables: {
        courseVersionId: studentFile?.course_details.id,
      },
    });

    // console.log("course units", res.data.course_units);
    if (res.data?.course_units) {
      setCourseUnits(res.data.course_units);
    }
  };

  useEffect(() => {
    if (studentFile) {
      loadCourseUnits();
    }
  }, [studentFile]);

  const onRowSelect = (selectedKeys, selectedRows, rowKey) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedUnit(selectedRows[0]);
    setIsVisible(true);
  };

  // console.log("defaultExpandedRowKeys", defaultExpandedRowKeys);

  const innerColumns = [
    {
      title: "Code",
      dataIndex: "course_code",
      key: "course_code",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Course Title",
      dataIndex: "course_title",
      key: "course_title",
      width: "40%",
      ellipsis: true,
    },
    {
      title: "Study Year",
      dataIndex: "study_yr",
      key: "study_yr",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Enrolled",
      dataIndex: "total_enrolled",
      key: "total_enrolled",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Provisional",
      dataIndex: "total_provisional",
      key: "total_provisional",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Registered",
      dataIndex: "total_registered",
      key: "total_registered",
      width: "10%",
      ellipsis: true,
    },
  ];

  // Expanded row render function: reuses the same columns for inner table
  const expandedRowRender = (record) => {
    // const data = [];
    // for (let i = 0; i < 6; ++i) {
    //   data.push({
    //     key: i.toString(),
    //     course_code: "BSCSS",
    //     course_title: "BACHELOR OF SCIENCE IN SOFTWARE SYSTEMS",
    //     study_yr: "2",
    //     enrolled: "20",
    //     provisional: "2",
    //     registered: "30",
    //   });
    // }

    const data = regReport?.report_summary
      ? regReport?.report_summary.filter(
          (_d) => record.school_id == _d.school_id
        )
      : [];
    return (
      <Table
        columns={innerColumns} // Use the same columns as outer table
        dataSource={data}
        pagination={false}
        size="small"
        // rowKey="course_id"
        loading={regReportLoading}
        // rowSelection={{
        //   type: "radio",
        //   selectedRowKeys: selectedRowKeys, // Select row only if it's part of the current table
        //   onChange: (selectedKeys, selectedRows) =>
        //     onRowSelect(selectedKeys, selectedRows, record.key), // Handle row selection
        //   columnWidth: "5%",
        // }}
        onRow={(record) => ({
          onClick: () => {
            // console.log("clicked", record);
            setSelectedRowKeys([record.id]); // select row on click
            setSelectedUnit(record);
            setIsVisible(true);
          },
        })}
        bordered
        style={{
          //   minWidth: panelWidth * 16.25,
          borderRadius: 0,
        }}
        tableLayout="fixed"
        summary={(pageData) => {
          // console.log("page data", pageData);
          let totalEnrolled = 0;
          let totalProvisional = 0;
          let totalRegistered = 0;

          pageData.map((data) => {
            totalEnrolled += parseInt(data.total_enrolled);
            totalProvisional += parseInt(data.total_provisional);
            totalRegistered += parseInt(data.total_registered);
          });
          return (
            <>
              <Table.Summary.Row
                style={{
                  borderBottom: "none",
                }}
              >
                <Table.Summary.Cell
                  colSpan={3}
                  style={{
                    borderBottom: "none",
                  }}
                ></Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "dodgerblue",
                    }}
                  >
                    {totalEnrolled}
                  </span>{" "}
                  {/* Place the total value in the fifth column */}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "orange",
                    }}
                  >
                    {totalProvisional}
                  </span>{" "}
                  {/* Place the total value in the fifth column */}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "green",
                    }}
                  >
                    {totalRegistered}
                  </span>{" "}
                  {/* Place the total value in the fifth column */}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    );
  };

  const handleMenuClick = (e) => {
    // message.info("Click on menu item.");
    // console.log("click", e);
    if (e.key == "download_std_report") {
      handleDownloadStdsReport();
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  // Outer table data, each row is just a sentence like "Study Year 1"
  const outerData = [];
  for (let i = 0; i < 3; ++i) {
    outerData.push({
      key: i.toString(),
      name: `Year ${i + 1}, Semester ${i + 1}`, // This will span across all columns
    });
  }

  const outerColumns = [
    {
      title: "School",
      dataIndex: "name",
      key: "year",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span
            style={{
              color: "#3b3bff",
              fontWeight: "600",
            }}
          >
            {" "}
            {`${record.school_code} - ${record.school_title}`}
          </span>

          <Space size="small">
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => handleDownloadStdsReport(record.school_id)}
              icon={<Download />}
            />

            <Button
              size="small"
              danger
              onClick={() => {
                const payload = {
                  ...regReportInput,
                  school_id: record.school_id,
                };
                dispatch(
                  setSelecttion({
                    type: "school",
                    details: record,
                  })
                );
                dispatch(setRegReportInput(payload));
                dispatch(setStudentsModalVisible(true));
              }}
              icon={<OpenInNew color="red" />}
            />
          </Space>
        </div>
      ),
    },
  ];

  const handleDownloadStdsReport = (school_id = null) => {
    // let downloadUrl = `http://localhost:2222/download-student-reg-report?campus_id=${regReportInput?.campus_id}&college=${regReportInput?.college_id}&acc_yr_id=${regReportInput?.acc_yr_id}&intake_id=${regReportInput?.intake_id}&sem=${regReportInput?.sem}&study_time_id=${regReportInput?.study_time_id}`;
    let downloadUrl = `${url2}/download-student-reg-report?campus_id=${regReportInput?.campus_id}&college=${regReportInput?.college_id}&acc_yr_id=${regReportInput?.acc_yr_id}&intake_id=${regReportInput?.intake_id}&sem=${regReportInput?.sem}&study_time_id=${regReportInput?.study_time_id}`;

    if (school_id) {
      downloadUrl += `&school_id=${school_id}`;
    }
    const link = document.createElement("a");
    link.href = downloadUrl;
    // link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 10,
          marginBottom: 0,
          padding: 4,
          paddingLeft: 10,
          // backgroundColor: "red",

          // height: 40,
        }}
      >
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          style={{
            //   opacity: 0.7,
            color: "#000",
            fontSize: "1.8rem",
          }}
        >
          Courses Per Faculty{" "}
          <span
            style={{
              color: "#bb0000",
            }}
          >
            (Click on course to view details)
          </span>
        </Typography>

        <div>
          <Space>
            <Dropdown menu={menuProps} arrow disabled={!regReport}>
              <Button ghost type="primary" size="middle">
                <Space>
                  Download
                  <Download />
                </Space>
              </Button>
            </Dropdown>

            <Search
              placeholder="Search Course..."
              // onSearch={onSearch}
              onChange={(e) => setModuleSearchValue(e.target.value)}
              //   size="small"
              width={500}
              style={{
                width: 250,
              }}
            />
          </Space>
        </div>
      </Box>

      <div
        style={{
          position: "relative",
          // backgroundColor: "green",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#f9f9f9",
                headerBorderRadius: 0,
                borderRadius: 0,
              },
            },
          }}
        >
          <Table
            columns={outerColumns} // Outer table has only one column with colSpan
            dataSource={getUniqueSchools(regReport?.report_summary || [])}
            bordered
            pagination={false}
            showHeader={false}
            loading={regReportLoading}
            size="small"
            expandable={{
              expandedRowRender, // Inner table will appear when expanded
              // defaultExpandedRowKeys, // Expand rows by default
              //   expandedRowKeys: expandedKeys,
              onExpand: (expanded, record) => {
                // console.log("key", record);
                // dispatch(
                //   setDefault(
                //     expanded
                //       ? [
                //           ...expandedKeys,
                //           `${record.course_unit_year}-${record.course_unit_sem}`,
                //         ]
                //       : expandedKeys.filter(
                //           (key) =>
                //             key !==
                //             `${record.course_unit_year}-${record.course_unit_sem}`
                //         )
                //   )
                // );
              },
            }}
            rowKey={"school_code"}
            style={{
              width: "100%",
              borderColor: "lightgray",
              //   borderTopColor: "gray",
              borderWidth: 1,
              borderTopWidth: 0.5,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
            }}
            scroll={{
              y: "calc(100vh - 53.8rem)",
              //   y: "38rem",
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}

export default ReportTable;
