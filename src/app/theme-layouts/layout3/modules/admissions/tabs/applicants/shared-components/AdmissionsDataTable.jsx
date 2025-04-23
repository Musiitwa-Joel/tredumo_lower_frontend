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
} from "../../../admissionsSlice";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  LOAD_APPLICATIONS,
  LOAD_APPLICATION_DETAILS,
} from "../../../graphql/queries";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import { useEffect, useState } from "react";
import Add from "@mui/icons-material/Add";
import AdmitStudentsModal from "./AdmitStudentsModal";
import { ADMIT_STDS } from "../../../graphql/mutations";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import CheckIcon from "@mui/icons-material/Check";
import FormPreview from "./FormPreview";
import AddStdToAdmissionModal from "./AddStdToAdmissionModal";
import ApplicantAdmissionList from "../ApplicantsAdmissionList";
import ImportApplicants from "../ImportApplicants";

const { Search } = Input;

const renderRow = (record, text) => {
  const color = record.is_admitted
    ? "blue"
    : parseInt(record.is_paid)
      ? "green"
      : "red"; // Conditional color based on `paid` field

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
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, record.applicant.gender),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 150,
    ellipsis: true,
    // render: (text, record, index) => <span>{`${record.applicant.email}`}</span>,
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
    // render: (text, record, index) => <>{`${record.applicant.email}`}</>,
  },
  {
    title: "Admitted",
    dataIndex: "admitted",
    ellipsis: true,
    // render: (text, record, index) => <>{`_`}</>,
    render: (text, record, index) => {
      if (record.is_admitted) {
        return (
          <CheckIcon
            style={{
              color: "blue",
            }}
          />
        );
      } else {
        return renderRow(record, "...");
      }
    },
    width: 80,
  },
  {
    title: "1st Choice",
    // dataIndex: "",
    ellipsis: true,
    width: 100,
    children: [
      {
        title: "Progcode",
        dataIndex: "street",
        key: "code",
        ellipsis: true,
        // render: (text, record, index) => (
        //   <>{`${record.program_choices[0].course.course_code}`}</>
        // ),
        render: (text, record, index) =>
          renderRow(record, record.program_choices[0].course.course_code),
        width: 100,
      },
      {
        title: "Alias",
        dataIndex: "street",
        ellipsis: true,
        key: "street",
        // render: (text, record, index) => (
        //   <>{`${record.program_choices[0].course.course_code}`}</>
        // ),
        render: (text, record, index) =>
          renderRow(record, record.program_choices[0].course.course_code),
        width: 100,
      },
    ],
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

const handleButtonClick = (e) => {
  // message.info("Click on left button.");
  console.log("click left button", e);
};

const items = [
  {
    label: "Add Application",
    key: "1",
    icon: (
      <AddCircleSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  // {
  //   label: "Edit Application",
  //   key: "2",
  //   icon: (
  //     <EditNoteSharp
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  // },
  // {
  //   label: "Edit Campus",
  //   key: "3",
  //   icon: (
  //     <HouseSidingSharp
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  //   // danger: true,
  // },
  // {
  //   label: "Edit Study Time",
  //   key: "4",
  //   icon: (
  //     <AccessTimeFilledSharp
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  // },
  {
    label: "Import Applicants",
    key: "import_applicants",
    icon: (
      <PublishSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Export Applicants",
    key: "6",
    icon: (
      <GetAppSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  // {
  //   label: "Administratively Admit",
  //   key: "7",
  //   icon: (
  //     <DownloadDone
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  // },
];

const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.address}</p>,
};

function AdmissionsDataTable() {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

  const onChange = (value) => {
    // console.log(`selected ${value}`);
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

  const [admitStudents, { error, loading, data }] = useMutation(ADMIT_STDS, {
    refetchQueries: ["loadApplications"],
  });

  // console.log("applications", applications);
  const completedApplications = applications.filter(
    (form) => form.is_completed
  );
  const inCompletedApplications = applications.filter(
    (form) => !form.is_completed
  );

  const [
    loadApplicationDetails,
    {
      error: loadErr,
      data: applicationRes,
      loading: loadingApplicationDetails,
    },
  ] = useLazyQuery(LOAD_APPLICATION_DETAILS);

  if (loadErr) {
    dispatch({
      message: loadErr.message,
      variant: "error",
    });
  }

  if (error) {
    dispatch({
      message: error.message,
      variant: "error",
    });
  }

  const handleMenuClick = (e) => {
    // message.info("Click on menu item.");
    console.log("click", e);
    if (e.key == "7") {
      // admiministrative admit
      dispatch(setAdmitStdsModalVisible(true));
    }

    if (e.key == "import_applicants") {
      dispatch(setImportApplicantsModalVisible(true));
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys, selectedRows);
    // setSelectedRowKeys(newSelectedRowKeys);
    dispatch(setSelectedRowKeys(newSelectedRowKeys));
    dispatch(setSelectedApplications(selectedRows));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleAdmit = async () => {
    // console.log("selected applications", selectedApplications);

    const _applications = selectedApplications.map((application) => ({
      application_id: application.id,
      prog_choice_id: application.program_choices[0].id,
      std_id: application.std_id,
    }));

    const data = {
      applicants: _applications,
      admittedBy: userObj.user.user_id,
    };

    // console.log("data", data);

    const res = await admitStudents({
      variables: data,
    });

    dispatch(
      showMessage({
        message: res.data.admit_students.message,
        variant: "success",
      })
    );

    dispatch(setAdmitStdsModalVisible(false));
    dispatch(setSelectedApplications([]));
  };

  const handleOpenPreview = async () => {
    // console.log("selected app", selectedApplications);
    if (selectedApplications.length > 0) {
      let latestAppSelected =
        selectedApplications[selectedApplications.length - 1];
      // console.log("application", latestAppSelected);
      const payload = {
        admissionsId: latestAppSelected.running_admissions.id,
        applicantId: latestAppSelected.applicant.id,
        formNo: latestAppSelected.form_no,
        admissionLevelId:
          latestAppSelected.running_admissions.admission_level.id,
      };

      // console.log("application", payload);
      const res = await loadApplicationDetails({
        variables: payload,
      });

      // console.log("response", res.data);
      dispatch(setApplicationForm(res.data));
      dispatch(setApplicationPreviewModalOpen(true));
    }
    // setIsOpen(true);
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
          backgroundColor: "#2f405d",
        }}
        className="p-5"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
        }}
      >
        <Typography.Text
          strong
          style={{
            color: "#fff",
          }}
        >
          {selectedCourseGroup
            ? `${selectedCourseGroup.course_title} - (${selectedCourseGroup.course_code})`
            : null}
        </Typography.Text>

        <div>
          <Space>
            <Tooltip title="Reload">
              <Refresh
                onClick={async () => {
                  await refetch();
                  console.log("refetch...");
                  // if (networkStatus === NetworkStatus.refetch) {
                  //   console.log("Refetching...");
                  // }
                }}
                fontSize=""
                color="white"
                style={{
                  color: "white",
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
          <Space size="large">
            <Select
              showSearch
              placeholder="Select Criteria"
              optionFilterProp="label"
              size="small"
              style={{
                width: 200,
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
              style={{
                width: 200,
              }}
            />

            <Dropdown menu={menuProps} trigger={["click"]}>
              <Button size="small">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Button size="small">Download All Applicants</Button>
            <Button size="small" disabled={inCompletedApplications.length == 0}>
              View Incomplete Forms
            </Button>
          </Space>

          <Button
            disabled={
              selectedApplications.length == 0 || loadingApplicationDetails
            }
            loading={loadingApplicationDetails}
            onClick={handleOpenPreview}
            size="small"
          >
            View Form
          </Button>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                // headerBg: "rgba(0, 0, 0, 0.04)",
                borderColor: "lightgray",
                // borderWidth: 10,
                // headerColor: "dodgerblue",
                borderRadius: 0,
                headerBorderRadius: 0,
                // colorBorderBg: "black",
                // cellFontSize: 10,
                // fontSize: 13,
                // controlHeight: 12
                lineHeight: 0.8,

                // backgroundColor: "red",

                // headerColor: "red",
                // headerSplitColor: "red",
                // borderColor: "red",
                // padding: 0,
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={
              searchResults.length > 0 ? searchResults : completedApplications
            }
            loading={loadingApplications}
            rowKey="id"
            bordered
            sticky
            rowSelection={rowSelection}
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
              y: "calc(100vh - 302px)", // Set the same height as in the style to ensure content scrolls
              // x: "100vw",
            }}

            // scroll={{
            //   y: "calc(100vh - 370px)",
            //   x: "100vw",
            // }}
          />
        </ConfigProvider>
      </div>

      <FormPreview />
      <AddStdToAdmissionModal />
      <ApplicantAdmissionList />
      <ImportApplicants />
      <Modal
        title="ADMIT STUDENTS"
        // centered
        open={admitStdsModalVisible}
        // style={{
        //   top: 0,
        //   //   overflow: "auto",
        // }}
        onOk={() => handleAdmit()}
        onCancel={() => dispatch(setAdmitStdsModalVisible(false))}
        okButtonProps={{
          danger: true,
          loading: loading,
          disabled: loading || selectedApplications == 0,
        }}
        okType="primary"
        width={1000}
        zIndex={10000}
        okText="Admit Students"
      >
        {/* <ApplicationPreview form_details={selectedApplication} /> */}
        <AdmitStudentsModal />
      </Modal>

      <FloatButton.Group
        shape="circle"
        style={{
          insetInlineEnd: 30,
          insetBlockEnd: 70,
        }}
      >
        <FloatButton
          // href="https://ant.design/index-cn"
          tooltip={<div>Applicant Admission List</div>}
          shape="square"
          type="primary"
          badge={{
            count: applicantsAdmissionList.length,
            overflowCount: 999,
          }}
          onClick={() => dispatch(setApplicanntsAdmissionListModal(true))}
        />
      </FloatButton.Group>
    </div>
  );
}

export default AdmissionsDataTable;
