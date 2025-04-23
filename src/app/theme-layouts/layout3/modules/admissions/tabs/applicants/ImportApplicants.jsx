import React, { useEffect, useState } from "react";
import {
  Select,
  Col,
  Form,
  Modal,
  Row,
  Typography,
  theme,
  Flex,
  Splitter,
  Input,
  Button,
  Divider,
  Switch,
  Tree,
  Table,
  ConfigProvider,
  Upload,
  Progress,
  Space,
} from "antd";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  selectImportApplicantsModalVisible,
  setImportApplicantsModalVisible,
} from "../../admissionsSlice";
import { Close, Download } from "@mui/icons-material";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { CarryOutOutlined } from "@ant-design/icons";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { url2 } from "app/configs/apiConfig";
import { UPLOAD_APPLICANTS } from "../../graphql/mutations";
import { UPLOAD_APPLICANTS_PROGRESS } from "../../graphql/subscriptions";

// const excelDateToJSDate = (serial) => {
//   if (typeof serial === "number") {
//     const utc_days = serial - 25569;
//     const date_info = new Date(utc_days * 86400 * 1000);
//     return date_info.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
//   }
//   return serial; // Return as is if it's already a string
// };

const excelDateToJSDate = (dob) => {
  if (typeof dob === "number") {
    // Convert Excel serial number to JavaScript date
    const utc_days = dob - 25569;
    const date_info = new Date(utc_days * 86400 * 1000);
    return date_info.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
  } else if (typeof dob === "string" && dob.includes("/")) {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = dob.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return dob; // Return as is if already in correct format
};

const LOAD_REQS = gql`
  query loadReqs {
    acc_yrs {
      id
      acc_yr_title
      added_by
      added_on
    }
    schemes {
      id
      scheme_title
    }
    intakes {
      id
      intake_title
    }
  }
`;

const columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "index",
    width: 50,
    render: (text, record, index) => index + 1,
  },
  {
    title: "Surname",
    dataIndex: "surname",
    ellipsis: true,
    width: 150,
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "Other Names",
    dataIndex: "other_names",
    ellipsis: true,
    width: 150,
    // width: 1,
  },
  {
    title: "Gender",
    dataIndex: "gender",
    width: 80,
  },
  {
    title: "Entry Study Yr",
    dataIndex: "entry_study_yr",
    width: 120,
  },
  {
    title: "Study Time",
    dataIndex: "study_time",
    width: 120,
  },
  {
    title: "Campus",
    dataIndex: "campus",
    width: 120,
  },
  {
    title: "Nationality",
    dataIndex: "nationality",
    width: 120,
  },
  {
    title: "Course Code",
    dataIndex: "progcode",
    width: 100,
  },
  {
    title: "Sponsorship",
    dataIndex: "sponsorship",
    width: 100,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 120,
    ellipsis: true,
  },
  {
    title: "Phone No",
    dataIndex: "phone_no",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Dob",
    dataIndex: "dob",
    width: 100,
    ellipsis: true,
  },
  {
    title: "District",
    dataIndex: "district",
    width: 100,
    ellipsis: true,
  },
  {
    title: "oq_institution",
    dataIndex: "oq_institution",
    width: 100,
    ellipsis: true,
  },
  {
    title: "oq_awarding_body",
    dataIndex: "oq_awarding_body",
    width: 140,
    ellipsis: true,
  },
  {
    title: "oq_yr_of_award",
    dataIndex: "oq_yr_of_award",
    width: 150,
    ellipsis: true,
  },
  {
    title: "oq_duration",
    dataIndex: "oq_duration",
    width: 100,
    ellipsis: true,
  },
  {
    title: "oq_class",
    dataIndex: "oq_class",
    width: 100,
    ellipsis: true,
  },
  {
    title: "oq_cgpa",
    dataIndex: "oq_cgpa",
    width: 100,
    ellipsis: true,
  },
];

const ImportApplicants = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectImportApplicantsModalVisible);
  const { token } = theme.useToken();
  const { error, loading, data } = useQuery(LOAD_REQS);
  const [form] = Form.useForm();
  const [showIcon, setShowIcon] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [workbook, setWorkbook] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [sheetError, setError] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [selectedSheet, setSelectedSheet] = useState("");

  const [uploadApplicants, { error: uploadErr, loading: uploadingApplicants }] =
    useMutation(UPLOAD_APPLICANTS);
  const { data: uploadApplicantsProgress } = useSubscription(
    UPLOAD_APPLICANTS_PROGRESS
  );

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

          setSheetData(jsonData);
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

  useEffect(() => {
    if (uploadApplicantsProgress) {
      setPercentage(uploadApplicantsProgress.uploadApplicantsProgress.progress);
    }
  }, [uploadApplicantsProgress]);

  console.log("percentage", uploadApplicantsProgress);

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

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: "0px 15px",
    paddingTop: 10,
    paddingBottom: 4,
    // backgroundColor: "red",
  };

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

  const handleOk = () => {
    dispatch(setImportApplicantsModalVisible(false));
  };
  const handleCancel = () => {
    dispatch(setImportApplicantsModalVisible(false));
  };

  const handleDownload = () => {
    const downloadUrl = `${url2}/templates/applicants_template.xlsx`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "applicants-template.xlsx"); // Optional, browser may still download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleImport = async () => {
    try {
      const valid = await form.validateFields();

      const values = form.getFieldsValue();

      const _applicants = sheetData.map((d, index) => {
        const requiredFields = [
          "surname",
          "other_names",
          "progcode",
          "study_time",
          "sponsorship",
          "campus",
          "gender",
          "nationality",
          "entry_study_yr",
        ];

        const missingFields = requiredFields.filter((field) => !d[field]);

        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields in row ${index + 1}: ${missingFields.join(", ")}`
          );
        }

        return {
          surname: d.surname,
          other_names: d.other_names,
          progcode: d.progcode,
          study_time: d.study_time,
          telno: String(d.telno) || null,
          sponsorship: d.sponsorship || null,
          campus: d.campus,
          district: d.district || null,
          dob: d?.dob ? excelDateToJSDate(d.dob) : null,
          email: d.email || null,
          gender: d.gender || null,
          nationality: d.nationality,
          entry_study_yr: String(d.entry_study_yr),
          choice_2: null,
          oq_award: d.oq_institution,
          oq_awarding_body: d.oq_awarding_body || null,
          oq_class: d.oq_class || null,
          oq_duration: d.oq_duration ? String(d.oq_duration) : null,
          oq_start_date: d.oq_start_date || null,
          oq_end_date: d.oq_end_date || null,
          oq_grade: d.oq_grade || null,
          oq_institution: d.oq_institution,
        };
      });

      const payload = {
        payload: {
          admission_details: {
            acc_yr_id: values.acc_yr,
            intake_id: values.intake,
            scheme_id: values.scheme,
          },
          applicants: _applicants,
        },
      };

      console.log("payload", payload);
      const res = await uploadApplicants({
        variables: payload,
      });

      // console.log("response", res.data);
      if (res.data) {
        dispatch(
          showMessage({
            message: res.data.uploadApplicants.message,
          })
        );
        dispatch(setSheetData([]));
      }
    } catch (error) {
      console.log("invalid", error);
      dispatch(
        showMessage({
          message: "Please Fill in all the required fields!",
          variant: "info",
        })
      );
    }
  };

  return (
    <Modal
      title={
        <Typography.Text
          style={{
            color: "#fff",
          }}
        >
          {`IMPORT APPLICANTS`}
        </Typography.Text>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={850}
      style={{
        top: 50,
      }}
      closeIcon={
        <Close
          style={{
            color: "#fff",
          }}
        />
      }
      styles={{
        body: {
          paddingLeft: 10,
          paddingRight: 10,
          height: "auto",

          // Ensure the content is not clipped
        },
        content: {
          padding: 0,
          height: "auto",
          // Ensure the content is not clipped
        },
        footer: {
          padding: 10,
        },
        header: {
          backgroundColor: "#2f405d",
          padding: "7px 10px",
        },
      }}
      footer={
        <div>
          <Space size="large">
            <ConfigProvider
              theme={{
                components: {
                  Progress: {
                    lineBorderRadius: 0,
                  },
                },
              }}
            >
              <Progress
                percent={percentage}
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={[500, 30]}
                style={{
                  borderRadius: 0,
                }}
              />
            </ConfigProvider>
            <Button
              type="primary"
              loading={uploadingApplicants}
              disabled={uploadingApplicants || sheetData.length == 0}
              onClick={handleImport}
            >
              UPLOAD APPLICANTS
            </Button>
          </Space>
        </div>
      }
      // okText={"Upload Applicants"}
    >
      <div>
        <Form
          form={form}
          name="advanced_search"
          style={formStyle}
          // onFinish={onFinish}
        >
          <Row gutter={24} align="middle">
            <Col
              span={8}
              style={{
                //   backgroundColor: "green",
                paddingBottom: 0,
              }}
            >
              <Form.Item
                name={`acc_yr`}
                label={`Academic Year`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select
                  loading={loading}
                  placeholder="Accademic Year"
                  // size="small"
                >
                  {data
                    ? data.acc_yrs.map((acc_yr) => (
                        <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
                      ))
                    : []}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={`scheme`}
                label={`Scheme`}
                rules={[
                  {
                    required: true,
                    message: "Select a scheme",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loading} placeholder="Scheme">
                  {data
                    ? data.schemes.map((scheme) => (
                        <Option value={scheme.id}>{scheme.scheme_title}</Option>
                      ))
                    : []}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={`intake`}
                label={`Intake`}
                rules={[
                  {
                    required: true,
                    message: "Select an intake",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loading} placeholder="Intake">
                  {data
                    ? data.intakes.map((intake) => (
                        <Option value={intake.id}>{intake.intake_title}</Option>
                      ))
                    : []}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Splitter
          style={{
            marginTop: 5,
            height: 400,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Splitter.Panel defaultSize="25%" min="20%" max="30%">
            <div>
              <div
                style={{
                  padding: "10px 5px",
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
                }}
              >
                <Tree
                  showLine={true}
                  showIcon={showIcon}
                  defaultExpandedKeys={["0-0"]}
                  onSelect={onSelect}
                  treeData={treeData}
                />
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div
              style={{
                padding: "10px 10px",
                height: "400px",
                overflow: "hidden",
              }}
            >
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
                  // rowSelection={{
                  //   type: selectionType,
                  //   ...rowSelection,
                  // }}
                  title={() => (
                    <Typography.Title
                      level={5}
                      style={{
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      Applicants Preview{" "}
                      {selectedSheet &&
                        `- ${selectedSheet} (${sheetData.length} Applicants)`}
                    </Typography.Title>
                  )}
                  columns={columns}
                  dataSource={sheetData}
                  // pagination={false}
                  showHeader={true}
                  loading={loadingData}
                  // tableLayout="fixed"
                  // sticky
                  size="small"
                  // style={{
                  //   // backgroundColor: "red",
                  //   height: 300,
                  //   overflow: "scroll",
                  // }}
                  scroll={{
                    y: 320,
                  }}
                  // footer={() => <Typography.Text>100 Records</Typography.Text>}
                  bordered
                  // scroll={{
                  //   // y: "calc(100vh - 200px)", // Set the same height as in the style to ensure content scrolls
                  //   // x: "100vw",

                  // }}
                />
              </ConfigProvider>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
    </Modal>
  );
};
export default ImportApplicants;
