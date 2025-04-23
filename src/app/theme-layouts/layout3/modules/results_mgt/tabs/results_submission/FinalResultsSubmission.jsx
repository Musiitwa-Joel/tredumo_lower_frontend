import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Input,
  Modal,
  Splitter,
  Table,
  Tree,
  Typography,
  Upload,
} from "antd";
import * as XLSX from "xlsx";
import { CarryOutOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Download } from "@mui/icons-material";
import { url2 } from "app/configs/apiConfig";
import UploadConfirmationModal from "../UploadConfirmationModal";
import { useMutation } from "@apollo/client";
import {
  SEND_RESULTS_UPLOAD_SECURITY_CODE,
  UPLOAD_COURSE_WORK_MARKS,
  UPLOAD_FINAL_EXAM_MARKS,
} from "../../gql/mutations";
import { useDispatch } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const instructions = [
  {
    title: "First row: empty or column names only.",
    crucial: false,
  },
  {
    title: "Required fields must exist",
    crucial: false,
  },
  {
    title: "Coursework mark can't exceed 30",
    crucial: false,
  },
  {
    title: "Coursework submission Deadline: \n 10-03-2024",
    crucial: true,
  },
];

const Desc = (props) => (
  <Flex
    justify="center"
    align="center"
    style={{
      height: "100%",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);

const columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "index",
    width: 50,
    render: (text, record, index) => {
      if (record.error) {
        return (
          <Typography.Text
            style={{
              color: "red",
            }}
          >
            {index + 1}
          </Typography.Text>
        );
      } else {
        return <Typography.Text>{index + 1}</Typography.Text>;
      }
    },
  },
  {
    title: "Student Number",
    dataIndex: "student_no",
    ellipsis: true,
    width: 150,
    render: (text, record, index) => {
      if (record.error) {
        return (
          <Typography.Text
            style={{
              color: "red",
            }}
          >
            {text}
          </Typography.Text>
        );
      } else {
        return <Typography.Text>{text}</Typography.Text>;
      }
    },
  },
  {
    title: "Registration Number",
    dataIndex: "registration_no",
    ellipsis: true,
    width: 150,
    render: (text, record, index) => {
      if (record.error) {
        return (
          <Typography.Text
            style={{
              color: "red",
            }}
          >
            {text}
          </Typography.Text>
        );
      } else {
        return <Typography.Text>{text}</Typography.Text>;
      }
    },
  },
  {
    title: "Course Unit Code",
    dataIndex: "course_unit_code",
    ellipsis: true,
    width: 150,
    render: (text, record, index) => {
      if (record.error) {
        return (
          <Typography.Text
            style={{
              color: "red",
            }}
          >
            {text}
          </Typography.Text>
        );
      } else {
        return <Typography.Text>{text}</Typography.Text>;
      }
    },
  },
  {
    title: "Final Exam Marks",
    dataIndex: "exam_marks",
    ellipsis: true,
    width: 150,
    render: (text, record, index) => {
      if (record.error) {
        return (
          <Typography.Text
            style={{
              color: "red",
            }}
          >
            {text}
          </Typography.Text>
        );
      } else {
        return <Typography.Text>{text}</Typography.Text>;
      }
    },
  },
];

function FinalResultsSubmission() {
  const dispatch = useDispatch();
  const [workbook, setWorkbook] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [sheetError, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [verifyCodeModalVisible, setVerifyCodeMoodalVisible] = useState(false);
  const [securityCode, setSecurityCode] = useState("");

  const [sendResultsUploadSecurityCode, { error, loading }] = useMutation(
    SEND_RESULTS_UPLOAD_SECURITY_CODE
  );

  const [uploadFinalExamMarks, { error: uploadErr, loading: uploadingMarks }] =
    useMutation(UPLOAD_FINAL_EXAM_MARKS);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (uploadErr) {
      dispatch(
        showMessage({
          message: uploadErr.message,
          variant: "error",
        })
      );
    }
  }, [error, uploadErr]);

  const treeData = [
    {
      title: "Root",
      key: "0-0",
      icon: <CarryOutOutlined />,
      children: sheetNames.map((sheet_name, i) => ({
        title: sheet_name,
        key: i,
        icon: <CarryOutOutlined />,
      })),
    },
  ];

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      setWorkbook(workbook);

      // Get all sheet names
      const sheetNames = workbook.SheetNames;
      setSheetNames(sheetNames);
    };

    reader.readAsArrayBuffer(file);
    setSelectedFile(file);
    return false; // Prevent default upload behavior
  };

  const onSelect = (selectedKeys, info) => {
    setLoadingData(true); // Set loading state immediately
    setError(null);

    const sheetName = info.node.title;
    setSelectedSheet(sheetName);

    setTimeout(() => {
      // Delay processing slightly to allow UI update
      try {
        if (workbook && workbook.Sheets && workbook.Sheets[sheetName]) {
          const sheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(sheet);

          console.log("jsonData", jsonData);
          let _data;
          let data;

          const newArr = jsonData.map((record) => {
            // figure out records with the wrong data
            // the records we need
            const { stdno, regno, module_code, exam_marks } = record;

            data = {
              student_no: stdno,
              registration_no: regno,
              course_unit_code: module_code,
              exam_marks: exam_marks,
            };

            if (!stdno || !regno || !module_code || !exam_marks) {
              _data = { ...data, error: true };
            } else {
              _data = { ...data, error: false };
            }

            return _data;
          });

          setSheetData(newArr);
        } else {
          throw new Error("Sheet not found");
        }
      } catch (err) {
        setError("Failed to load sheet data. Please try again.");
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }, 100); // Small delay to let loading state render
  };

  const handleDownload = () => {
    const downloadUrl = `${url2}/templates/final_exam_submission_template.xlsx`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "applicants-template.xlsx"); // Optional, browser may still download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    // send code to user's email/sms
    const res = await sendResultsUploadSecurityCode();

    if (res.data?.sendResultsUploadVerificationCode?.success) {
      setVerifyCodeMoodalVisible(true);
    }
  };

  const handleConfirm = async (securityCode) => {
    const cw_marks = sheetData
      .filter((record) => record.error === false)
      .map((mk) => ({
        course_unit_code: mk.course_unit_code,
        marks: mk.exam_marks,
        registration_no: mk.registration_no,
        student_no: `${mk.student_no}`,
      }));

    const payload = {
      securityCode: parseInt(securityCode),
      payload: cw_marks,
    };

    console.log(
      "to be upload",
      sheetData.filter((record) => record.error === false)
    );

    const res = await uploadFinalExamMarks({
      variables: payload,
    });

    if (res.data?.uploadFinalExamMarks?.success) {
      Modal.success({
        content: res.data?.uploadFinalExamMarks?.message,
        centered: true,
      });
    } else {
      Modal.error({
        title: "Results Upload Errors",
        content: res.data?.uploadFinalExamMarks?.message,
        centered: true,
      });
    }
    setVerifyCodeMoodalVisible(false);
    setSecurityCode("");
  };

  return (
    <div>
      <Splitter
        style={{
          height: "calc(100vh - 175px)",
          padding: 0,
          //   boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Splitter.Panel
          defaultSize="25%"
          min="20%"
          max="30%"
          style={{
            padding: 0,
          }}
        >
          <div>
            <Typography.Title level={5} className="font-medium text-20 bold">
              Upload Final Exam Marks
            </Typography.Title>

            <div>
              <div
                style={{
                  padding: "10px 0px",
                  // backgroundColor: "green",
                }}
              >
                <Upload
                  beforeUpload={handleFileUpload}
                  accept=".xlsx, .xls"
                  showUploadList={false}
                >
                  <Input
                    addonAfter={
                      <Button type="text" size="small">
                        Browse
                      </Button>
                    }
                    value={selectedFile ? selectedFile.name : "Select File"}
                    readOnly
                    placeholder="Select File"
                  />
                </Upload>
              </div>
              <Divider
                style={{
                  backgroundColor: "#eeee",
                  padding: 0,
                  margin: 0,
                }}
              />
              <div
                style={{
                  padding: "5px 5px",
                }}
              >
                <Button
                  type="primary"
                  size="small"
                  ghost
                  icon={
                    <Download
                      style={{
                        fontSize: 13,
                      }}
                    />
                  }
                  onClick={handleDownload}
                >
                  Download Template
                </Button>
              </div>

              <Divider
                style={{
                  backgroundColor: "#eeee",
                  padding: 0,
                  margin: 0,
                }}
              />
              <div
                style={{
                  padding: "5px 5px",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Data Extract
                </Typography.Title>
              </div>
              <Divider
                style={{
                  backgroundColor: "#eeee",
                  padding: 0,
                  margin: 0,
                }}
              />

              <div
                style={{
                  padding: "5px 5px",
                  height: "calc(100vh - 520px)",
                }}
              >
                <Tree
                  showLine={true}
                  // showIcon={showIcon}
                  defaultExpandedKeys={["0-0"]}
                  onSelect={onSelect}
                  treeData={treeData}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          {/* Main Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%", // Ensure it takes full height
            }}
          >
            {/* Table Container - Takes available space */}
            <div style={{ flexGrow: 1, padding: 10, overflow: "auto" }}>
              <ConfigProvider
                theme={{
                  components: {
                    Table: {
                      borderColor: "lightgray",
                      borderRadius: 0,
                      headerBorderRadius: 0,
                    },
                  },
                }}
              >
                <Table
                  title={() => (
                    <Typography.Title
                      level={5}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Final Exam Results Preview
                    </Typography.Title>
                  )}
                  columns={columns}
                  dataSource={sheetData}
                  showHeader={true}
                  size="small"
                  scroll={{ y: 320 }}
                  bordered
                />
              </ConfigProvider>
            </div>

            {/* Button Container - Sticks to Bottom */}
            <div
              style={{
                paddingTop: 5,
                paddingLeft: 5,
                borderTop: "1px solid lightgray",
                background: "#fff",
                // textAlign: "right",
              }}
            >
              <Button
                onClick={handleUpload}
                disabled={
                  sheetData.filter((record) => record.error === false)
                    .length === 0 || loading
                }
                loading={loading}
              >
                Upload Final Exam Results
              </Button>
            </div>
          </div>
          <UploadConfirmationModal
            visible={verifyCodeModalVisible}
            onConfirm={handleConfirm}
            onCancel={() => setVerifyCodeMoodalVisible(false)}
            loading={uploadingMarks}
            securityCode={securityCode}
            setSecurityCode={setSecurityCode}
          />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}

export default FinalResultsSubmission;
