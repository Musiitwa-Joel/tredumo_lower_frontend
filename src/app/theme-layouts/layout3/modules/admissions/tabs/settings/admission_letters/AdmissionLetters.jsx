import { Close, Delete, Edit, ListAlt, Preview } from "@mui/icons-material";
import {
  ConfigProvider,
  Table,
  Space,
  Button,
  Popconfirm,
  Typography,
  Tooltip,
  FloatButton,
  Modal,
} from "antd";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import clsx from "clsx";
import { Download, List, ListCheck, RefreshCcw, Upload } from "lucide-react";
import { Add } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_ADMISSION_LETTERS } from "../../../graphql/queries";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectAdmissionLetters,
  selectSelectedAdmissionLetter,
  selectSelectedAdmissionTemplate,
  setAdmissionLetterModalVisible,
  setAdmissionLetters,
  setAdmissionTemplatePreview,
  setManageProgramsModalVisible,
  setSelectedAdmissionLetter,
  setSelectedAdmissionTemplate,
  setStartAdmissionsModalVisible,
} from "../../../admissionsSlice";
import { darken, useTheme } from "@mui/material/styles";
import { FileWordFilled, SyncOutlined } from "@ant-design/icons";
// import StartAdmissionsModal from "./StartAdmissionsModal";
import { DELETE_RUNNING_ADMISSION } from "../../../graphql/mutations";
import styled from "styled-components";
import CreateAdmissionLetterModal from "./CreateAdmissionLetterModal";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { url2 } from "app/configs/apiConfig";
import toast from "react-hot-toast";
import AdmissionTemplatePreview from "./AdmissionTemplatePreview";
// import ManageProgramsModal from "./ManageProgramsModal";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 2px 10px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
    color: #1a4b96;
    font-weight: bold;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const fields_ref = [
  {
    field_name: "Student Number",
    ref: "student_number",
  },
  {
    field_name: "Student Name",
    ref: "student_name",
  },
  {
    field_name: "Nationality",
    ref: "nationality",
  },
  {
    field_name: "Scheme",
    ref: "scheme",
  },
  {
    field_name: "Study Session",
    ref: "study_session",
  },
  {
    field_name: "Date",
    ref: "date",
  },
  {
    field_name: "Intake",
    ref: "intake",
  },
  {
    field_name: "Course Duration",
    ref: "course_duration",
  },
  {
    field_name: "Campus",
    ref: "campus",
  },
  {
    field_name: "Course",
    ref: "course",
  },
];

const _data = [
  {
    description: "ALL STUDY SESSIONS",
    scheme: "DIRECT ENTRY",
    creation_date: "2024-08-08",
    last_modified_by: "AKAMPEREZA DARLINGTON",
    last_modified_on: "2024-08-08",
    template: "ADMISSION LETTER.docx",
    intake: "AUGUST",
  },
];

function AdmissionLetters() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const admissionLetters = useSelector(selectAdmissionLetters);
  const selectedTemplate = useSelector(selectSelectedAdmissionTemplate);
  const [
    deleteRunningAdmission,
    { error: deleteErr, loading: deletingAdmission, data: deleteResponse },
  ] = useMutation(DELETE_RUNNING_ADMISSION, {
    refetchQueries: ["getRunningAdmissions"],
  });

  const {
    error,
    loading: loadingAdmissionLetters,
    data,
    refetch,
  } = useQuery(LOAD_ADMISSION_LETTERS, {
    notifyOnNetworkStatusChange: true,
  });

  const handleDownload = (record) => {
    const fileUrl = `${url2}/templates/admission_letters/${record.template_id}`;

    // Create an invisible anchor element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "admission_template.docx"); // Suggested filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (record) => {
    // console.log("record", record);
    dispatch(setAdmissionTemplatePreview(true));
    dispatch(setSelectedAdmissionTemplate(record));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      // width: "20%",
      key: "name",
      ellipsis: true,
      //   render: (text, record, index) => record.intake.intake_title,
    },
    {
      title: "Scheme",
      dataIndex: "scheme_title",
      // width: "20%",
      //   render: (text, record, index) => record.scheme.scheme_title,
      key: "scheme_title",
    },
    {
      title: "Intake",
      dataIndex: "intake_title",
      // width: "20%",
      //   render: (text, record, index) => record.scheme.scheme_title,
      key: "intake_title",
    },
    {
      title: "Creation Date",
      dataIndex: "created_on",
      key: "created_on",
      // width: "10%",
      render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      ellipsis: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "last_modified_by_user",
      // width: "20%",
      //   render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      key: "last_modified_by_user",
    },
    {
      title: "Last Modified On",
      dataIndex: "last_modified_on",
      // width: "20%",
      render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      key: "last_modified_on",
    },
    // {
    //   title: "Template",
    //   dataIndex: "template",
    //   width: "20%",
    //   render: (text, record, index) => {
    //     return (
    //       <div
    //         style={{
    //           display: "flex",
    //           alignItems: "center",
    //           //   justifyContent: "center",
    //         }}
    //       >
    //         <FileWordFilled
    //           style={{
    //             fontSize: 40,
    //             color: "dodgerblue",
    //           }}
    //         />
    //         <Typography.Link
    //           style={{
    //             textDecoration: "none",
    //           }}
    //           onClick={() => handleDownload(record)}
    //         >
    //           {record.file_name}
    //         </Typography.Link>
    //       </div>
    //     );
    //   },
    //   key: "template",
    //   ellipsis: true,
    // },
    {
      title: "Action",
      key: "operation",
      render: (text, record, index) => (
        <Space size="large">
          <Button
            // size="small"
            type="primary"
            ghost
            onClick={() => {
              dispatch(setSelectedAdmissionLetter(record));
              dispatch(setAdmissionLetterModalVisible(true));
            }}
            icon={<Edit />}
          />

          <Tooltip title="Preview Template">
            <Button
              //   size="small"
              type="primary"
              ghost
              icon={<Preview size={18} />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Template"
            description="Are you sure to delete this template?"
            onConfirm={(e) => confirmDelete(e, record)}
            // onCancel={cancel}
            okText="Yes"
            okButtonProps={{
              style: {
                backgroundColor: "dodgerblue",
              },
            }}
            cancelText="No"
          >
            <Button
              //   size="small"
              danger
              // onClick={() => handleRowDelete(record)}
              icon={<Delete color="red" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const confirmDelete = async (e, record) => {
    // console.log("delete", record);
    const res = await deleteRunningAdmission({
      variables: {
        runningAdmissionId: record.id,
      },
    });

    dispatch(
      showMessage({
        message: res.data.deleteRunningAdmission.message,
        variant: "info",
      })
    );
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [error, deleteErr]);

  if (data) {
    dispatch(setAdmissionLetters(data.admission_letters));
  }

  return (
    <div
      style={{
        height: "calc(100vh - 185px)",
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Table: {
              // headerBg: "rgba(0, 0, 0, 0.04)",
              borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
              // cellFontSize: 10,
              // fontSize: 13,
              // lineHeight: 0.8,
            },
          },
        }}
      >
        <Table
          title={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                type="primary"
                icon={<Add />}
                onClick={() => {
                  dispatch(setSelectedAdmissionLetter(null));
                  dispatch(setAdmissionLetterModalVisible(true));
                }}
              >
                Add New Admission Letter
              </Button>

              <Button
                type="primary"
                ghost
                icon={<RefreshCcw size={13} />}
                loading={loadingAdmissionLetters}
                disabled={loadingAdmissionLetters}
                onClick={() => {
                  refetch();
                }}
              >
                Refresh
              </Button>
            </div>
          )}
          bordered
          size="small"
          columns={columns}
          dataSource={admissionLetters}
          loading={loadingAdmissionLetters}
          //   pagination={}
          //   footer={(data) => <Typography.Text>100 Records</Typography.Text>}
          scroll={{
            y: "calc(100vh - 250px)",
          }}
        />
      </ConfigProvider>

      <FloatButton
        description={
          <Typography.Text
            color="#fff"
            style={{
              color: "#fff",
            }}
          >
            FIELDS REFERENCE
          </Typography.Text>
        }
        shape="square"
        type="primary"
        onClick={() => setIsOpen(true)}
        style={{
          insetInlineEnd: 30,
          insetBlockEnd: 60,
          width: 150,
          backgroundColor: "blue",
        }}
      />

      <Modal
        open={isOpen}
        closable={false}
        styles={{
          body: {
            padding: 0,
            //   backgroundColor: "red",
          },
          content: {
            padding: 0,
            borderRadius: 20,
          },
        }}
        width={500}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <Card
          className={clsx("", "shadow")}
          sx={{
            backgroundColor: (theme) =>
              darken(
                theme.palette.background.paper,
                theme.palette.mode === "light" ? 0.01 : 0.1
              ),
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1e293b",
            }}
            className="p-10"
            id="draggable-dialog-title"
            style={{
              paddingLeft: 15,
              display: "flex",
              justifyContent: "space-between",
              cursor: "move",
            }}
          >
            <Typography.Title
              level={5}
              variant="h6"
              color="inherit"
              component="div"
              style={{
                //   opacity: 0.7,
                color: "white",
                margin: 0,
                padding: 0,
              }}
            >
              {"Fields References"}
            </Typography.Title>

            <Close
              style={{
                color: "white",
                fontSize: 25,
                cursor: "pointer",
                //  marginRight: 10,
              }}
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </Box>
          <div
            className="max-w-full relative"
            style={{
              width: 900,
              padding: 10,
            }}
          >
            <StyledTable>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Field</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {fields_ref.map((ref, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{ref.field_name}</td>
                    <td>{ref.ref}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 10,
              paddingBottom: 5,
            }}
          >
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </Card>
      </Modal>

      <CreateAdmissionLetterModal />
      <AdmissionTemplatePreview
        content={selectedTemplate ? selectedTemplate?.content : ""}
      />
    </div>
  );
}

export default AdmissionLetters;
