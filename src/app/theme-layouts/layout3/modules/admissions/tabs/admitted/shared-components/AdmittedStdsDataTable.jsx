import { Box, Typography, Tooltip } from "@mui/material";
import {
  Cancel,
  ChangeCircle,
  Close,
  EditNoteSharp,
  Refresh,
  Send,
} from "@mui/icons-material";
import {
  Form,
  Select,
  Table,
  Input,
  Row,
  Col,
  Space,
  Dropdown,
  Button,
  ConfigProvider,
  Typography as AntTypography,
} from "antd";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmitStdsModalVisible,
  selectAdmittedStds,
  selectAdmittedStdsSummary,
  selectApplicationPreviewModalOpen,
  selectApplications,
  selectLoadingAdmittedStds,
  selectSelectedAdmittedStds,
  selectSelectedAdmittedStdsRowKeys,
  selectSelectedAdmittedStdsSummary,
  setAdmissionLetterModalVisible,
  setAdmissionLetters,
  setAdmittedStds,
  setApplicationForm,
  setApplicationPreviewModalOpen,
  setEditStudentRecordsModalVisible,
  setRefetchAdmittedStudents,
  setSelectedAdmittedStds,
  setSelectedAdmittedStdsRowKeys,
  setSelectedAdmittedStudent,
  setSelectedRowKeys,
} from "../../../admissionsSlice";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GLOBAL_SEARCH_APPLICATIONS,
  LOAD_APPLICATION_DETAILS,
  PRINT_ADMISSION_LETTERS,
} from "../../../graphql/queries";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import {
  ADMIT_STDS,
  PUSH_TO_STD_INFO_CENTER,
} from "../../../graphql/mutations";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import AdmissionLetterPreview from "./AdmissionLetterPreview";
import { useEffect, useState } from "react";
import EditStudentRecordsModal from "./EditStudentRecordsModal";
import { Check, CircleCheck } from "lucide-react";

const { Search } = Input;

const renderRow = (record, text) => {
  const color = parseInt(record.is_std_verified) ? "blue" : "black"; // Conditional color based on `verified` field

  return <span style={{ color }}>{text}</span>;
};

const columns = [
  {
    title: "#",
    dataIndex: "no",
    key: "index",
    width: 40,
    render: (text, record, index) => renderRow(record, index + 1),
  },
  {
    title: "Date",
    dataIndex: "admitted_on",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 150,
  },
  {
    title: "Form No",
    ellipsis: true,
    dataIndex: "form_no",
    render: (text, record, index) => renderRow(record, text),
    width: 140,
  },
  {
    title: "Student No",
    ellipsis: true,
    dataIndex: "student_no",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
  {
    title: "Name",
    width: 210,
    dataIndex: "full_name",
    ellipsis: true,
    sorter: (a, b) => {
      const nameA = a.biodata
        ? `${a.biodata.surname || ""} ${a.biodata.other_names || ""}`
        : "";
      const nameB = b.biodata
        ? `${b.biodata.surname || ""} ${b.biodata.other_names || ""}`
        : "";
      return nameA.localeCompare(nameB);
    },
    render: (text, record) =>
      renderRow(
        record,
        record.biodata
          ? `${record.biodata.surname} ${record.biodata.other_names}`
          : ""
      ),
  },
  {
    title: "Sex",
    dataIndex: "gender",
    width: 50,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, record.biodata.gender),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Course Code",
    dataIndex: "course_code",
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) =>
      renderRow(record, record.course.course_code),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Campus",
    dataIndex: "campus_title",
    width: 80,
    render: (text, record, index) => renderRow(record, text),
  },
  {
    title: "Study Time",
    dataIndex: "study_time_title",
    width: 100,
    render: (text, record, index) => renderRow(record, text),
    sorter: (a, b) => {
      return a.study_time_title.localeCompare(b.study_time_title);
    },
  },
  {
    title: "Intake",
    dataIndex: "intake_title",
    width: 80,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Nationality",
    dataIndex: "nationality",
    width: 120,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) =>
      renderRow(record, record.biodata.nationality.nationality_title),
    ellipsis: true,
    // sorter: (a, b) => a.age - b.age,
  },

  {
    title: "Entry Study Year",
    dataIndex: "entry_study_yr",
    width: 130,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
];

const handleButtonClick = (e) => {
  // message.info("Click on left button.");
  console.log("click left button", e);
};

const items = [
  {
    label: "Push to Student Information Center",
    key: "push_std_to_sic",
    icon: (
      <Send
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Edit Student Details",
    key: "edit_student_details",
    icon: (
      <EditNoteSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Change of Program Request",
    key: "3",
    icon: (
      <ChangeCircle
        style={{
          fontSize: 18,
        }}
      />
    ),
    // danger: true,
  },
  {
    label: "Cancel Admission",
    key: "4",
    icon: (
      <Cancel
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
];

const filterItems = [
  {
    label: "Students Pushed to Hub",
    key: "stds_pushed_to_hub",
    icon: <CircleCheck size={18} />,
  },
  {
    label: "Students Not in Hub",
    key: "stds_not_in_hub",
    icon: (
      <Cancel
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
];

const defaultExpandable = {
  expandedRowRender: (record) => (
    <>
      <Row
        gutter={24}
        style={{
          padding: 5,
        }}
      >
        <Col>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Space
              style={{
                padding: "5px 0px",
              }}
            >
              <AntTypography.Text strong>ADMITTED BY:</AntTypography.Text>
              <AntTypography.Text>{record.admitted_by_user}</AntTypography.Text>
            </Space>

            <Space>
              <AntTypography.Text strong>ADMITTED ON:</AntTypography.Text>
              <AntTypography.Text>
                {formatDateString(parseInt(record.admitted_on))}
              </AntTypography.Text>
            </Space>
          </div>
        </Col>
        {/* <Col>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Space
              style={{
                padding: "5px 0px",
              }}
            >
              <AntTypography.Text strong>REGISTERED BY:</AntTypography.Text>
              <AntTypography.Text></AntTypography.Text>
            </Space>

            <Space>
              <AntTypography.Text strong>RESGISTERED ON:</AntTypography.Text>
              <AntTypography.Text>""</AntTypography.Text>
            </Space>
          </div>
        </Col> */}
        <Col>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Space
              style={{
                padding: "5px 0px",
              }}
            >
              <AntTypography.Text strong>REGISTRATION NO:</AntTypography.Text>
              <AntTypography.Text>{record.registration_no}</AntTypography.Text>
            </Space>
          </div>
        </Col>
      </Row>
    </>
  ),
};

function AdmittedStdsDataTable() {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [current, setCurrent] = useState(1);
  const dispatch = useDispatch();
  const userObj = useSelector(selectUser);
  const selectedCourseGroup = useSelector(selectSelectedAdmittedStdsSummary);
  const loadingApplications = useSelector(selectLoadingAdmittedStds);
  const applications = useSelector(selectAdmittedStds);
  const [admittedStudents, setAdmittedStudents] = useState([]);
  const selectedAdmittedStds = useSelector(selectSelectedAdmittedStds);
  const selectedRowKeys = useSelector(selectSelectedAdmittedStdsRowKeys);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("name");
  const [
    pushToStdInfoCenter,
    { error: pushErr, loading: pushingStds, data: pushRes },
  ] = useMutation(PUSH_TO_STD_INFO_CENTER, {
    refetchQueries: ["loadAdmittedStudents"],
  });

  const [
    globalSearchApplications,
    { error: globalErr, loading: searchingGlobally },
  ] = useLazyQuery(GLOBAL_SEARCH_APPLICATIONS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (applications.length > 0) {
      setAdmittedStudents(applications);
    }
  }, [applications]);

  const onChange = (value) => {
    // console.log(`selected ${value}`);
    setSelectedCriteria(value);
  };

  const onSearch = async (value) => {
    if (!value) {
      return;
    }

    const response = await globalSearchApplications({
      variables: {
        searchCriteria: selectedCriteria,
        searchValue: value,
        admissionsId: null,
      },
    });

    // console.log("response", response.data);
    dispatch(setAdmittedStds(response.data.global_search_applications));
  };

  // console.log("applications----", applications);
  const [
    loadApplicationDetails,
    {
      error: loadErr,
      data: applicationRes,
      loading: loadingApplicationDetails,
    },
  ] = useLazyQuery(LOAD_APPLICATION_DETAILS);

  const [printAdmissionLetters, { error: printErr, loading: printingLetters }] =
    useLazyQuery(PRINT_ADMISSION_LETTERS, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    });

  // console.log("print error", printErr?.message);

  useEffect(() => {
    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (pushErr) {
      dispatch(
        showMessage({
          message: pushErr.message,
          variant: "error",
        })
      );
    }

    if (printErr) {
      dispatch(
        showMessage({
          message: printErr.message,
          variant: "error",
        })
      );
    }

    if (globalErr) {
      dispatch(
        showMessage({
          message: globalErr.message,
          variant: "error",
        })
      );
    }
  }, [printErr, pushErr, loadErr, globalErr]);

  const handleMenuClick = async (e) => {
    // message.info("Click on menu item.");

    if (e.key == "push_std_to_sic") {
      // Push to student information center

      if (selectedAdmittedStds.length == 0)
        return dispatch(
          showMessage({
            message: "Please select at least one student",
            variant: "info",
          })
        );
      const std_ids = selectedAdmittedStds.map((std) => std.std_id);

      // console.log("the ids", std_ids);

      const res = await pushToStdInfoCenter({
        variables: {
          stdIds: std_ids,
          pushedBy: userObj.user.user_id,
        },
      });

      dispatch(
        showMessage({
          message: res.data.push_to_std_info_center.message,
          variant: "success",
        })
      );
    }

    if (e.key == "edit_student_details") {
      if (selectedAdmittedStds.length > 0) {
        let latestStudentSelected =
          selectedAdmittedStds[selectedAdmittedStds.length - 1];

        dispatch(setSelectedAdmittedStudent(latestStudentSelected));
        dispatch(setEditStudentRecordsModalVisible(true));
      } else {
        dispatch(
          showMessage({
            message: "Please select a student!",
            variant: "info",
          })
        );
      }
    }
  };

  const handleFilterMenuClick = async (e) => {
    // message.info("Click on menu item.");
    // console.log("applications", applications);
    if (e.key == "stds_pushed_to_hub") {
      // View pushed students only
      const newArr = applications.filter(
        (application) => application.is_std_verified == true
      );

      setAdmittedStudents(newArr);
    } else if (e.key == "stds_not_in_hub") {
      // View pushed students only
      const newArr = applications.filter(
        (application) => application.is_std_verified == false
      );

      setAdmittedStudents(newArr);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const filterMenuProps = {
    items: filterItems,
    onClick: handleFilterMenuClick,
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys, selectedRows);
    // setSelectedRowKeys(newSelectedRowKeys);
    dispatch(setSelectedAdmittedStdsRowKeys(newSelectedRowKeys));
    dispatch(setSelectedAdmittedStds(selectedRows));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleOpenPreview = async () => {
    const stds = selectedAdmittedStds.map((std) => ({
      applicant_id: std.biodata.id,
      form_no: std.form_no,
    }));

    const payload = {
      students: stds,
    };

    // console.log("selected applications", selectedAdmittedStds);
    const res = await printAdmissionLetters({
      variables: payload,
    });

    console.log("responsse", res.data);
    if (res.data?.print_admission_letters) {
      dispatch(setAdmissionLetters(res.data.print_admission_letters));

      dispatch(setAdmissionLetterModalVisible(true));
    }
  };

  const handleExport = () => {
    console.log("applications", applications);

    if (applications.length == 0) {
      dispatch(
        showMessage({
          message: "Please first load admitted students",
          variant: "info",
        })
      );
    }

    const data = applications.map((application) => ({
      name: `${application.biodata.surname} ${application.biodata.other_names}`,
      student_number: application.student_no,
      regno: application.registration_no,
      email: application.biodata.email,
      gender: application.biodata.gender,
      nationality: application.biodata.nationality.nationality_title,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "admitted-student.csv");
  };

  return (
    <div
      style={{
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
        <AntTypography.Text strong>
          {selectedCourseGroup
            ? `${selectedCourseGroup.course_title} - (${selectedCourseGroup.course_code})`
            : null}
        </AntTypography.Text>

        <div>
          <Space>
            <Tooltip title="Reload">
              <Refresh
                onClick={async () => {
                  dispatch(setRefetchAdmittedStudents(true));
                }}
                fontSize=""
                color="#000"
                style={{
                  // color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                }}
              />
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
            backgroundColor: "#fff",
            padding: 8,
            display: "flex",
            justifyContent: "space-between",
            borderColor: "lightgray",

            borderWidth: 1,
            // marginTop: 5,
            marginBottom: 8,
          }}
        >
          <Space size="middle">
            <Select
              showSearch
              placeholder="Select"
              optionFilterProp="label"
              size="small"
              style={{
                width: 140,
              }}
              onChange={onChange}
              onSearch={onSearch}
              value={selectedCriteria}
              options={[
                {
                  value: "name",
                  label: "Name",
                },
                {
                  value: "program_code",
                  label: "Program Code",
                },
              ]}
            />

            <Search
              placeholder="Global Search"
              onSearch={onSearch}
              size="small"
            />

            <Dropdown menu={menuProps}>
              <Button size="small">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Button size="small" onClick={handleExport}>
              Export to Excel
            </Button>

            <Dropdown menu={filterMenuProps}>
              <Button size="small">
                <Space>
                  Filters
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>

          <Button
            disabled={selectedAdmittedStds.length == 0 || printingLetters}
            loading={printingLetters}
            onClick={handleOpenPreview}
            size="small"
          >
            Print Admission Letter(s)
          </Button>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
                // lineHeight: 0.8,
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={
              searchResults.length > 0 ? searchResults : admittedStudents
            }
            loading={loadingApplications || pushingStds || searchingGlobally}
            rowKey="std_id"
            bordered
            sticky
            rowSelection={rowSelection}
            onRow={(record, index) => ({
              onDoubleClick: () => {
                dispatch(setSelectedAdmittedStudent(record));
                dispatch(setEditStudentRecordsModalVisible(true));
              },
            })}
            expandable={defaultExpandable}
            showHeader={true}
            tableLayout="fixed"
            size="small"
            pagination={{
              position: ["bottomLeft"],
              pageSize: pageSize,
              // current: current,
              onShowSizeChange: (current, pageSize) => {
                setCurrent(current);
                setPageSize(pageSize);
              },
            }}
            scroll={{
              y: "calc(100vh - 305px)", // Set the same height as in the style to ensure content scrolls
              // x: "100vw",
            }}
          />
        </ConfigProvider>
      </div>

      <AdmissionLetterPreview />
      <EditStudentRecordsModal />
    </div>
  );
}

export default AdmittedStdsDataTable;
