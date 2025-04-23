import { Box } from "@mui/material";
import * as XLSX from "xlsx";
import {
  Add,
  Delete,
  Download,
  RemoveRedEye,
  Send,
  Upload,
} from "@mui/icons-material";
import { Input, Space, Button, Tooltip, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TestTable2 from "./TestTable2";
import {
  selectCourseUnits,
  selectCourseVersionDetails,
  selectModuleSearchValue,
  selectSelectedCourseVersion,
  selectSelectedUnit,
  setCreateNewCourse,
  setEditModule,
  setModuleEdited,
  setModuleSearchValue,
  setSelectedUnit,
  setUploadModulesModalOpen,
  updateCreateModuleModalOpen,
  updatecreateProgrammeModalOpen,
  updateProgrammeFormDetails,
} from "../../store/progAndCoursesSlice";
import Edit from "@mui/icons-material/Edit";
import { useMutation } from "@apollo/client";
import { DELETE_COURSE_UNIT } from "../../gql/mutations";
import { useEffect } from "react";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
const { confirm } = Modal;

const { Search } = Input;

function CourseUnitsDatable({ panelWidth }) {
  // console.log("pannel width", panelWidth);
  const dispatch = useDispatch();
  const selectedCourseVersion = useSelector(selectSelectedCourseVersion);
  const courseVersionDetails = useSelector(selectCourseVersionDetails);
  const selectedUnit = useSelector(selectSelectedUnit);
  const courseunits = useSelector(selectCourseUnits);
  const moduleSearchValue = useSelector(selectModuleSearchValue);

  // console.log("selected course v", selectedCourseVersion);

  // console.log("selected Unit", selectedUnit);

  const onSearch = (value) => {
    // console.log("search:", value);
    dispatch(setModuleSearchValue(value));
  };

  const [deleteCourseUnit, { error, loading, data }] = useMutation(
    DELETE_COURSE_UNIT,
    {
      refetchQueries: ["getCourseUnits"],
    }
  );

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  const handleCreateNewModule = () => {
    dispatch(setModuleEdited(false));
    dispatch(updateCreateModuleModalOpen(true));
  };

  const handleEditModule = () => {
    dispatch(setModuleEdited(true));
    dispatch(setEditModule(true));
  };

  const handleDeleteModule = () => {
    // confirmation modal
    confirm({
      title: `${selectedUnit?.selectedRow.course_unit_title}`,
      // icon: <ExclamationCircleFilled />,
      content:
        "Are you sure you wamt to delete this course? \n Deleting this course unit will only be possible if no student has ever enrolled in it. \n Do you want to continue?",

      async onOk() {
        // console.log("OK");
        const res = await deleteCourseUnit({
          variables: {
            unitId: selectedUnit?.selectedRow.id,
          },
        });

        // console.log("response", res.data);
        dispatch(setSelectedUnit(null));
        dispatch(
          showMessage({
            message: res.data.deleteCourseUnit.message,
            variant: "success",
          })
        );
      },
      zIndex: 1000000,
      okText: "Yes",
    });
  };

  const exportToCSV = (data) => {
    // Initialize an array to hold the structured data
    const formattedData = [
      [
        `COURSE UNITS FOR ${selectedCourseVersion?.parent?.label} ${selectedCourseVersion?.selected?.label}`,
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
      `${selectedCourseVersion?.parent?.label} ${selectedCourseVersion?.selected.label} MODDULES.xlsx`
    );
  };

  return (
    <div
      style={{
        // marginTop: 9,
        marginLeft: 10,
        marginRight: 10,
        // backgroundColor: "red",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
          marginBottom: 7,
        }}
      >
        {selectedCourseVersion ? (
          <Typography.Text
            strong
            style={{
              //   opacity: 0.7,
              // color: "white",
              // fontSize: "1.7rem",
              fontWeight: "500",
            }}
          >
            {`(${selectedCourseVersion?.parent?.code}) ${selectedCourseVersion?.parent?.label} - ${selectedCourseVersion?.selected?.label}`}
          </Typography.Text>
        ) : (
          <div></div>
        )}

        <div>
          <Space>
            <Tooltip title="View Course Details">
              <Button
                size="small"
                icon={<RemoveRedEye />}
                disabled={!selectedCourseVersion}
                onClick={() => {
                  dispatch(setCreateNewCourse(false));
                  dispatch(updatecreateProgrammeModalOpen(true));

                  if (courseVersionDetails) {
                    const extractedData = {
                      id: courseVersionDetails.course.id,
                      course_code: courseVersionDetails.course.course_code,
                      course_title: courseVersionDetails.course.course_title,
                      course_version: courseVersionDetails.version_title,
                      course_duration:
                        courseVersionDetails.course.course_duration,
                      duration_measure:
                        courseVersionDetails.course.duration_measure,
                      course_head_id:
                        courseVersionDetails.course.course_head_id,
                      campuses: JSON.parse(
                        courseVersionDetails.course.campuses
                      )?.map((campus) => campus.value),
                      entry_yrs: JSON.parse(
                        courseVersionDetails.course.entry_yrs
                      )?.map((yr) => yr.value),
                      college_id: courseVersionDetails.course.college_id,
                      school_id: courseVersionDetails.course.school_id,
                      department_id: courseVersionDetails.course.department_id,
                      level: courseVersionDetails.course.level,
                      award: courseVersionDetails.course.award,
                      grading_id: courseVersionDetails.course.grading_id,
                      study_times: JSON.parse(
                        courseVersionDetails.course.study_times
                      )?.map((study_time) => study_time.value),
                      course_version_id: courseVersionDetails.id,
                      isShortCourse:
                        courseVersionDetails.course.is_short_course,
                      total_credit_units:
                        courseVersionDetails.total_credit_units,
                    };

                    // console.log("extractedData", extractedData);

                    dispatch(updateProgrammeFormDetails(extractedData));
                  }
                }}
              >
                View Course Details
              </Button>
            </Tooltip>
          </Space>
        </div>
      </Box>
      <div
        style={{
          // backgroundColor: "#fff",
          maxHeight: "calc(100vh - 188px)",
          minHeight: "calc(100vh - 188px)",
          //   height: 600,
        }}
      >
        <div
          style={{
            padding: 7,
            display: "flex",
            justifyContent: "space-between",
            borderColor: "lightgray",
            backgroundColor: "#fff",
            borderWidth: 1,
            // marginTop: 5,
            // marginBottom: 8,
          }}
        >
          <Space
            style={{
              overflow: "auto",
            }}
          >
            <Search
              placeholder="Search Module..."
              onSearch={onSearch}
              onChange={(e) => dispatch(setModuleSearchValue(e.target.value))}
              size="small"
              // value={moduleSearchValue}
              width={500}
              style={{
                width: 190,
              }}
            />

            <Button
              type="text"
              size="small"
              icon={<Add />}
              onClick={handleCreateNewModule}
            >
              Create New Module
            </Button>

            <Button
              size="small"
              type="text"
              icon={<Upload />}
              onClick={() => dispatch(setUploadModulesModalOpen(true))}
            >
              Upload Modules
            </Button>

            <Button
              onClick={() => exportToCSV(courseunits)}
              size="small"
              type="text"
              icon={<Download />}
            >
              Download Modules
            </Button>

            {/* <Dropdown menu={menuProps}>
              <Button size="small">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown> */}
          </Space>

          <Space>
            <Button
              ghost
              disabled={!selectedUnit}
              type="primary"
              size="small"
              icon={<Edit />}
              onClick={handleEditModule}
            ></Button>

            <Button
              size="small"
              danger
              disabled={!selectedUnit}
              onClick={handleDeleteModule}
              icon={<Delete />}
            ></Button>
          </Space>

          {/* <Button
            disabled={
              selectedApplications.length == 0 || loadingApplicationDetails
            }
            loading={loadingApplicationDetails}
            onClick={handleOpenPreview}
            size="small"
          >
            Print Admission Letter(s)
          </Button> */}
        </div>
        <TestTable2 panelWidth={panelWidth} deletingUnit={loading} />
      </div>
    </div>
  );
}

export default CourseUnitsDatable;
