import { Box, Tooltip } from "@mui/material";
import {
  AccessTimeFilledSharp,
  AddCircleSharp,
  DownloadDone,
  EditNoteSharp,
  GetAppSharp,
  HouseSidingSharp,
  PublishSharp,
  Refresh,
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
  Modal,
  Typography,
  FloatButton,
} from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmitStdsModalVisible,
  selectApplicantsAdmissionList,
  selectApplicationPreviewModalOpen,
  selectApplications,
  selectLoadingApplications,
  selectSelectedApplicantSummary,
  selectSelectedApplications,
  selectSelectedRowKeys,
  setAdmitStdsModalVisible,
  setApplicanntsAdmissionListModal,
  setApplicationForm,
  setApplicationPreviewModalOpen,
  setImportApplicantsModalVisible,
  setSelectedApplications,
  setSelectedRowKeys,
} from "src/app/theme-layouts/layout3/modules/admissions/admissionsSlice.js";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import CheckIcon from "@mui/icons-material/Check";
import TimeTablePreview from "./TimeTablePreview";
// import FormPreview from "./FormPreview";
// import AddStdToAdmissionModal from "./AddStdToAdmissionModal";
// import ApplicantAdmissionList from "../ApplicantsAdmissionList";
// import ImportApplicants from "../ImportApplicants";
import { useEffect, useState } from "react";

const { Search } = Input;

// Dummy data to replace GraphQL queries
const dummyApplications = [
  {
    id: "1",
    creation_date: "1694131200000", // Sept 8, 2023
    form_no: "APP001",
    applicant: {
      surname: "Doe",
      other_names: "John",
      gender: "M",
      email: "john.doe@example.com",
    },
    is_paid: "1",
    is_admitted: false,
    is_completed: true,
    std_id: "STD001",
    running_admissions: {
      id: "RA001",
      admission_level: { id: "AL001" },
    },
    program_choices: [
      {
        id: "PC001",
        course: {
          course_code: "CS101",
          course_title: "Computer Science",
        },
      },
    ],
  },
  {
    id: "2",
    creation_date: "1694217600000", // Sept 9, 2023
    form_no: "APP002",
    applicant: {
      surname: "Smith",
      other_names: "Jane",
      gender: "F",
      email: "jane.smith@example.com",
    },
    is_paid: "1",
    is_admitted: true,
    is_completed: true,
    std_id: "STD002",
    running_admissions: {
      id: "RA002",
      admission_level: { id: "AL002" },
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
];

const dummyApplicationDetails = {
  applicationDetails: {
    id: "1",
    form_no: "APP001",
    applicant: {
      surname: "Doe",
      other_names: "John",
      email: "john.doe@example.com",
    },
    program_choices: [
      {
        course: {
          course_code: "CS101",
          course_title: "Computer Science",
        },
      },
    ],
  },
};

const formatDateString = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderRow = (record, text) => {
  const color = record.is_admitted
    ? "blue"
    : parseInt(record.is_paid)
      ? "green"
      : "red";
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
    dataIndex: "creation_date",
    ellipsis: true,
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
    title: "Name",
    width: 210,
    dataIndex: "full_name",
    ellipsis: true,
    sorter: (a, b) => {
      const nameA = `${a.applicant.surname || ""} ${a.applicant.other_names || ""}`;
      const nameB = `${b.applicant.surname || ""} ${b.applicant.other_names || ""}`;
      return nameA.localeCompare(nameB);
    },
    render: (text, record, index) =>
      renderRow(
        record,
        `${record.applicant.surname} ${record.applicant.other_names}`
      ),
  },
  {
    title: "Sex",
    dataIndex: "gender",
    width: 50,
    render: (text, record, index) => renderRow(record, record.applicant.gender),
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 150,
    ellipsis: true,
    render: (text, record, index) => renderRow(record, record.applicant.email),
  },
  {
    title: "Paid",
    dataIndex: "is_paid",
    ellipsis: true,
    width: 50,
    render: (text, record, index) => {
      if (Boolean(parseInt(text))) {
        return (
          <CheckIcon
            style={{
              color: record.is_admitted
                ? "blue"
                : parseInt(record.is_paid)
                  ? "green"
                  : "red",
            }}
          />
        );
      } else {
        return renderRow(record, "...");
      }
    },
  },
  {
    title: "Admitted",
    dataIndex: "is_admitted",
    ellipsis: true,
    width: 80,
    render: (text, record, index) => {
      if (record.is_admitted) {
        return <CheckIcon style={{ color: "blue" }} />;
      } else {
        return renderRow(record, "...");
      }
    },
  },
  {
    title: "1st Choice",
    ellipsis: true,
    width: 100,
    children: [
      {
        title: "Progcode",
        dataIndex: "program_choices",
        key: "code",
        ellipsis: true,
        render: (text, record, index) =>
          renderRow(record, record.program_choices[0].course.course_code),
        width: 100,
      },
      {
        title: "Alias",
        dataIndex: "program_choices",
        ellipsis: true,
        key: "alias",
        render: (text, record, index) =>
          renderRow(record, record.program_choices[0].course.course_code),
        width: 100,
      },
    ],
  },
];

const items = [
  {
    label: "Add Timetable",
    key: "1",
    icon: <AddCircleSharp style={{ fontSize: 18 }} />,
  },
  {
    label: "Edit Timetable",
    key: "import_applicants",
    icon: <PublishSharp style={{ fontSize: 18 }} />,
  },
  // {
  //   label: "Export Applicants",
  //   key: "6",
  //   icon: <GetAppSharp style={{ fontSize: 18 }} />,
  // },
];

const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.applicant.email}</p>,
};

function AdmissionsDataTable() {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(20);
  const [current, setCurrent] = useState(1);
  const [selectedCriteria, setSelectedCriteria] = useState("name");
  const userObj = useSelector(selectUser);
  const selectedCourseGroup = useSelector(selectSelectedApplicantSummary);
  const loadingApplications = useSelector(selectLoadingApplications);
  const applications = useSelector(selectApplications);
  const selectedApplications = useSelector(selectSelectedApplications);
  const applicantsAdmissionList = useSelector(selectApplicantsAdmissionList);
  const admitStdsModalVisible = useSelector(selectAdmitStdsModalVisible);
  const selectedRowKeys = useSelector(selectSelectedRowKeys);
  const [searchResults, setSearchResults] = useState([]);

  // Load dummy applications on mount
  useEffect(() => {
    dispatch(setSelectedApplications(dummyApplications));
  }, [dispatch]);

  const onChange = (value) => {
    setSelectedCriteria(value);
  };

  const onSearch = (value) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    let filteredResults = [];
    if (selectedCriteria === "name") {
      filteredResults = applications.filter((app) => {
        const fullName = `${app.applicant.surname} ${app.applicant.other_names}`;
        return fullName.toLowerCase().includes(value.toLowerCase());
      });
    } else if (selectedCriteria === "program_code") {
      filteredResults = applications.filter((app) =>
        app.program_choices.some((choice) =>
          choice.course.course_code.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    setSearchResults(filteredResults);
  };

  const handleMenuClick = (e) => {
    console.log("click", e);
    if (e.key === "import_applicants") {
      dispatch(setImportApplicantsModalVisible(true));
    }
    if (e.key === "1") {
      // Simulate adding application
      dispatch(
        showMessage({
          message: "Add application clicked",
          variant: "info",
        })
      );
    }
    if (e.key === "6") {
      // Simulate export
      dispatch(
        showMessage({
          message: "Export applicants clicked",
          variant: "info",
        })
      );
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    dispatch(setSelectedRowKeys(newSelectedRowKeys));
    dispatch(setSelectedApplications(selectedRows));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleAdmit = async () => {
    const _applications = selectedApplications.map((application) => ({
      application_id: application.id,
      prog_choice_id: application.program_choices[0].id,
      std_id: application.std_id,
    }));

    dispatch(
      showMessage({
        message: "Students admitted successfully",
        variant: "success",
      })
    );
    dispatch(setAdmitStdsModalVisible(false));
    dispatch(setSelectedApplications([]));
  };

  const handleOpenPreview = async () => {
    if (selectedApplications.length > 0) {
      dispatch(setApplicationForm(dummyApplicationDetails));
      dispatch(setApplicationPreviewModalOpen(true));
    }
  };

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <Box
        sx={{ backgroundColor: "#2f405d" }}
        className="p-5"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
        }}
      >
        <Typography.Text strong style={{ color: "#fff" }}>
          {selectedCourseGroup
            ? `${selectedCourseGroup.course_title} - (${selectedCourseGroup.course_code})`
            : null}
        </Typography.Text>
        <div>
          <Space>
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
          </Space>
        </div>
      </Box>
      <div
        style={{
          maxHeight: "calc(100vh - 288px)",
          minHeight: "calc(100vh - 288px)",
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
            marginBottom: 8,
          }}
        >
          <Space size="large">
            <Select
              showSearch
              placeholder="Select Criteria"
              optionFilterProp="label"
              size="small"
              style={{ width: 200 }}
              onChange={onChange}
              value={selectedCriteria}
              options={[
                { value: "name", label: "Name" },
                { value: "program_code", label: "Program Code" },
              ]}
            />
            <Search
              placeholder="Global Search"
              onSearch={onSearch}
              size="small"
              style={{ width: 200 }}
            />
            <Dropdown menu={menuProps} trigger={["click"]}>
              <Button size="small">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Button size="small">Download Timetable(s)</Button>
          </Space>
          <Button
            disabled={selectedApplications.length === 0}
            onClick={handleOpenPreview}
            size="small"
          >
            Teacher Timetable
          </Button>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
                lineHeight: 0.8,
              },
            },
          }}
        >
          <TimeTablePreview />
        </ConfigProvider>
      </div>
      {/* <FormPreview /> */}
      {/* <AddStdToAdmissionModal />
      <ApplicantAdmissionList />
      <ImportApplicants /> */}
      <Modal
        title="ADMIT STUDENTS"
        open={admitStdsModalVisible}
        onOk={handleAdmit}
        onCancel={() => dispatch(setAdmitStdsModalVisible(false))}
        okButtonProps={{
          danger: true,
          disabled: selectedApplications.length === 0,
        }}
        okType="primary"
        width={1000}
        zIndex={10000}
        okText="Admit Students"
      >
        {/* <AdmitStudentsModal /> */}
      </Modal>
      <FloatButton.Group
        shape="circle"
        style={{ insetInlineEnd: 30, insetBlockEnd: 70 }}
      >
        <FloatButton
          tooltip={<div>Applicant Admission List</div>}
          shape="square"
          type="primary"
          badge={{ count: applicantsAdmissionList.length, overflowCount: 999 }}
          onClick={() => dispatch(setApplicanntsAdmissionListModal(true))}
        />
      </FloatButton.Group>
    </div>
  );
}

export default AdmissionsDataTable;
