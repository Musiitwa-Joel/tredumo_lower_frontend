import {
  Form,
  Modal,
  Button,
  Upload,
  Input,
  Select,
  Row,
  Col,
  Steps,
  theme,
  Divider,
  DatePicker,
  Space,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { InboxOutlined, SettingOutlined } from "@ant-design/icons";
import { darken, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmissionLetterModalVisible,
  selectAdmissionQuillValue,
  selectSelectedAdmissionLetter,
  setAdmissionLetterModalVisible,
  setAdmissionQuillValue,
} from "../../../admissionsSlice";
import Card from "@mui/material/Card";
import clsx from "clsx";
import { Add, Close } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_ADMISSION_TEMPLATE } from "../../../graphql/mutations";
import "./styles.css";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Dragger } = Upload;

// const modules = {
//   toolbar: [
//     [{ font: [] }, { size: [] }], // Font family & size
//     ["bold", "italic", "underline", "strike"], // Text styles
//     [{ color: [] }, { background: [] }], // Text color & background color
//     [{ script: "sub" }, { script: "super" }], // Subscript & superscript
//     [{ header: "1" }, { header: "2" }, "blockquote", "code-block"], // Headers, blockquote, code block
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ], // Lists & indentation
//     [{ align: [] }], // Alignment
//     ["link", "image", "video"], // Media
//     ["clean"], // Remove formatting
//   ],
// };

const BasicInfo = () => (
  <div
    style={{
      position: "relative",
      // backgroundColor: "red",
      // width: 900,
      // height: "calc(100vh - 430px)",
      overflowY: "scroll",
      overflowX: "hidden",
      padding: 0,
    }}
  >
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Only DOCX files/Word Docs are allowed</p>
    </Dragger>

    <div
      style={{
        marginTop: 10,
      }}
    >
      <Row gutter={0}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Intake"
            name="intake_id"
            rules={[
              {
                required: true,
                message: "Please Select intake!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Intake"
              loading={loadingRequirements}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                data?.intakes
                  ? data?.intakes.map((intake) => ({
                      value: intake.id,
                      label: intake.intake_title,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please Input the description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Describe the template" rows={2} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Scheme"
            name="scheme_id"
            rules={[
              {
                required: true,
                message: "Please select the scheme!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Scheme"
              loading={loadingRequirements}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                data?.schemes
                  ? data?.schemes.map((scheme) => ({
                      value: scheme.id,
                      label: scheme.scheme_title,
                    }))
                  : []
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  </div>
);

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
  {
    field_name: "Course Code",
    ref: "course_code",
  },
  {
    field_name: "Academic Year",
    ref: "academic_year",
  },
  {
    field_name: "Header",
    ref: "header",
  },
  {
    field_name: "Print Date",
    ref: "print_date",
  },
  {
    field_name: "Signature",
    ref: "signature",
  },
  {
    field_name: "Background",
    ref: "background_image",
  },
  {
    field_name: "Reporting Date",
    ref: "reporting_date",
  },
  {
    field_name: "Registration Start Date",
    ref: "registration_start_date",
  },
  {
    field_name: "Registration End Date",
    ref: "registration_end_date",
  },
  {
    field_name: "Lectures Start Date",
    ref: "lectures_start_date",
  },
  {
    field_name: "Lectures End Date",
    ref: "lectures_end_date",
  },
  {
    field_name: "Tuition Fee",
    ref: "tuition_fee",
  },
  {
    field_name: "Functional Fees",
    ref: "functional_fees",
  },
  {
    field_name: "Total Fees Amount",
    ref: "total_fees_amount",
  },
];

const LOAD_REQS = gql`
  query loadReqs {
    schemes {
      id
      scheme_title
    }
    intakes {
      id
      intake_title
    }
    study_times {
      id
      study_time_title
    }
  }
`;

function CreateAdmissionLetterModal() {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState(null);
  const value = useSelector(selectAdmissionQuillValue);
  const editor = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const selectedAdmissionLetter = useSelector(selectSelectedAdmissionLetter);
  const admissionLetterModalVisible = useSelector(
    selectAdmissionLetterModalVisible
  );
  const { loading: loadingRequirements, error, data } = useQuery(LOAD_REQS);
  const [saveAdmissionTemplate, { error: saveErr, loading }] = useMutation(
    SAVE_ADMISSION_TEMPLATE,
    {
      refetchQueries: "loadAdmissionLetters",
    }
  );
  const [signatureImg, setSignatureImg] = useState([]);
  const [backgroundImg, setBackgroundImg] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), study_time_id: "", date: "" },
  ]);
  const [registrationRows, setRegistrationsRows] = useState([
    { id: Date.now(), study_time_id: "", date: "" },
  ]);
  const [lectureRows, setLectureRows] = useState([
    { id: Date.now(), study_time_id: "", date: "" },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), study_time_id: "", date: "" }]);
  };

  const handleAddRegRow = () => {
    setRegistrationsRows([
      ...registrationRows,
      { id: Date.now(), study_time_id: "", date: "" },
    ]);
  };

  const handleAddLectureRow = () => {
    setLectureRows([
      ...lectureRows,
      { id: Date.now(), study_time_id: "", date: "" },
    ]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDeleteRegRow = (id) => {
    setRegistrationsRows(registrationRows.filter((row) => row.id !== id));
  };

  const handleDeleteLectureRow = (id) => {
    setLectureRows(lectureRows.filter((row) => row.id !== id));
  };

  useEffect(() => {
    if (editor.current) {
      setIsEditorReady(true);
    }
  }, [editor.current]);

  const insertColumns = () => {
    if (!editor.current) return;

    const columnsHTML = `
      <div style="display: flex; gap: 10px;">
        <div style="flex: 1; border: 1px solid #fff; padding: 0px;">
          <p>Column 1 Content</p>
        </div>
        <div style="flex: 1; border: 1px solid #fff; padding: 0px;">
          <p>Column 2 Content</p>
        </div>
      </div>
    `;

    editor.current.selection.insertHTML(columnsHTML);
  };

  const insertText = (text) => {
    if (editor.current) {
      // Insert the text at the current cursor position
      // editor.current.selection.focus();

      editor.current.selection.insertHTML(`{${text}}`);
    }
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

    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }
  }, [error, saveErr]);

  useEffect(() => {
    if (selectedAdmissionLetter) {
      form.setFieldsValue({
        intake_id: selectedAdmissionLetter.intake_id,
        scheme_id: selectedAdmissionLetter.scheme_id,
        template_name: selectedAdmissionLetter.name,
        page_layout_height: selectedAdmissionLetter.layout_height,
        page_layout_width: selectedAdmissionLetter.layout_width,
      });

      if (selectedAdmissionLetter.reporting_dates) {
        const reportingDates = JSON.parse(
          selectedAdmissionLetter.reporting_dates
        );
        setRows(reportingDates);

        const formattedValues = reportingDates.reduce((acc, item) => {
          acc[`study_time_${item.id}`] = item.study_time_id;
          acc[`date_${item.id}`] = dayjs(item.date); // Convert to DatePicker format
          return acc;
        }, {});
        form.setFieldsValue(formattedValues);
      } else {
        setRows([{ id: Date.now(), study_time_id: "", date: "" }]);
      }

      if (selectedAdmissionLetter.registration_dates) {
        const registrationDates = JSON.parse(
          selectedAdmissionLetter.registration_dates
        );
        setRegistrationsRows(registrationDates);

        const formattedValues = registrationDates.reduce((acc, item) => {
          acc[`study_time_reg_${item.id}`] = item.study_time_id;
          acc[`date_reg_${item.id}`] = item.dates.map((date) => dayjs(date)); // Convert each date to dayjs
          return acc;
        }, {});
        form.setFieldsValue(formattedValues);
      } else {
        setRegistrationsRows([{ id: Date.now(), study_time_id: "", date: "" }]);
      }

      if (selectedAdmissionLetter.lecture_dates) {
        const lectureDates = JSON.parse(selectedAdmissionLetter.lecture_dates);
        setLectureRows(lectureDates);

        const formattedValues = lectureDates.reduce((acc, item) => {
          acc[`study_time_lecture_${item.id}`] = item.study_time_id;
          acc[`date_lecture_${item.id}`] = item.dates.map((date) =>
            dayjs(date)
          ); // Convert each date to dayjs
          return acc;
        }, {});
        form.setFieldsValue(formattedValues);
      } else {
        setLectureRows([{ id: Date.now(), study_time_id: "", date: "" }]);
      }

      dispatch(setAdmissionQuillValue(selectedAdmissionLetter.content));
    } else {
      form.resetFields();
      dispatch(setAdmissionQuillValue(""));
      setRows([]);
      setRegistrationsRows([]);
    }
  }, [selectedAdmissionLetter]);

  const onFinish = async (_values) => {
    const formattedData = rows.map((row) => ({
      study_time_id: _values[`study_time_${row.id}`],
      date: _values[`date_${row.id}`]?.format("YYYY-MM-DD") || "",
      id: row.id,
    }));

    const formattedRegData = registrationRows.map((row) => ({
      study_time_id: _values[`study_time_reg_${row.id}`],
      dates: _values[`date_reg_${row.id}`]
        ? _values[`date_reg_${row.id}`].map((d) => d?.format("YYYY-MM-DD"))
        : [],
      id: row.id,
    }));

    const formattedLectureData = lectureRows.map((row) => ({
      study_time_id: _values[`study_time_lecture_${row.id}`],
      dates: _values[`date_lecture_${row.id}`]
        ? _values[`date_lecture_${row.id}`].map((d) => d?.format("YYYY-MM-DD"))
        : [],
      id: row.id,
    }));

    // console.log("formattedLectureData", formattedLectureData);

    const payload = {
      payload: {
        id: selectedAdmissionLetter ? selectedAdmissionLetter.id : null,
        header: fileList[0] ? fileList[0].originFileObj : null,
        background: backgroundImg[0] ? backgroundImg[0].originFileObj : null,
        signature: signatureImg[0] ? signatureImg[0].originFileObj : null,
        content: value,
        intake_id: values.intake_id,
        scheme_id: values.scheme_id,
        layout_height: values.page_layout_height,
        layout_width: values.page_layout_width,
        template_name: values.template_name,
        reporting_dates: JSON.stringify(formattedData) || null,
        registration_dates: JSON.stringify(formattedRegData) || null,
        lecture_dates: JSON.stringify(formattedLectureData) || null,
      },
    };

    // console.log("payload", payload);

    const res = await saveAdmissionTemplate({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.saveAdmissionTemplate.message,
        variant: "success",
      })
    );

    dispatch(setAdmissionLetterModalVisible(false));
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      height: 330,
    }),
    []
  );

  const props = {
    name: "file",
    multiple: false, // Restrict to one file
    accept: "image/*", // Accept only image files
    beforeUpload: (file) => {
      console.log(file);
      setFileList([file]); // Replace the fileList with the new file
      return false; // Prevent automatic upload
    },
    onChange(info) {
      let newFileList = [...info.fileList]; // Copy the fileList

      // Filter successfully uploaded files
      newFileList = newFileList.filter((file) => file.status !== "error");

      // Update the fileList state
      setFileList(newFileList);

      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file) => {
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== file.uid)
      );
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    fileList, // Control the fileList to only allow one file
  };

  const signatureProps = {
    name: "file",
    multiple: false, // Restrict to one file
    accept: "image/*", // Accept only image files
    beforeUpload: (file) => {
      setSignatureImg([file]); // Replace the fileList with the new file
      return false; // Prevent automatic upload
    },
    onChange(info) {
      let newFileList = [...info.fileList]; // Copy the fileList

      // Filter successfully uploaded files
      newFileList = newFileList.filter((file) => file.status !== "error");

      // Update the fileList state
      setSignatureImg(newFileList);

      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file) => {
      setSignatureImg((prevList) =>
        prevList.filter((item) => item.uid !== file.uid)
      );
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    signatureImg, // Control the fileList to only allow one file
  };

  const backgroundProps = {
    name: "file",
    multiple: false, // Restrict to one file
    accept: "image/*", // Accept only image files
    beforeUpload: (file) => {
      setBackgroundImg([file]); // Replace the fileList with the new file
      return false; // Prevent automatic upload
    },
    onChange(info) {
      let newFileList = [...info.fileList]; // Copy the fileList

      // Filter successfully uploaded files
      newFileList = newFileList.filter((file) => file.status !== "error");

      // Update the fileList state
      setBackgroundImg(newFileList);

      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file) => {
      setBackgroundImg((prevList) =>
        prevList.filter((item) => item.uid !== file.uid)
      );
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    backgroundImg, // Control the fileList to only allow one file
  };

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 300px)",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: 0,
          }}
        >
          <div
            style={{
              marginTop: 0,
            }}
          >
            <Row gutter={0}>
              <Col
                md={24}
                style={{
                  marginBottom: 30,
                }}
              >
                <Form.Item
                  label="Template Name"
                  name="template_name"
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                      message: "Please Input the template Name!",
                    },
                  ]}
                >
                  <Input placeholder="Template Name" />
                </Form.Item>
              </Col>
              <Col
                className="gutter-row"
                span={24}
                style={{
                  marginBottom: 30,
                }}
              >
                <Form.Item
                  label="Intake"
                  name="intake_id"
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                      message: "Please Select intake!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Intake"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.intakes
                        ? data?.intakes.map((intake) => ({
                            value: intake.id,
                            label: intake.intake_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>

              <Col
                className="gutter-row"
                span={24}
                style={{
                  marginBottom: 30,
                }}
              >
                <Form.Item
                  label="Scheme"
                  name="scheme_id"
                  layout="vertical"
                  rules={[
                    {
                      required: true,
                      message: "Please select the scheme!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Scheme"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.schemes
                        ? data?.schemes.map((scheme) => ({
                            value: scheme.id,
                            label: scheme.scheme_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>

              <Col
                className="gutter-row"
                span={24}
                style={{
                  marginBottom: 30,
                }}
              >
                <Form.Item
                  label="Page Layout"
                  name="page_layout"
                  layout="vertical"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please select the scheme!",
                  //   },
                  // ]}
                >
                  <Row gutter={12}>
                    <Col md={12}>
                      <Form.Item
                        label="Width"
                        name="page_layout_width"
                        layout="vertical"
                        rules={[
                          {
                            required: true,
                            message: "Please select the scheme!",
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        label="Height"
                        name="page_layout_height"
                        layout="vertical"
                        rules={[
                          {
                            required: true,
                            message: "Please select the scheme!",
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col
                className="gutter-row"
                span={24}
                style={{
                  marginTop: 20,
                }}
              >
                <Row gutter={12}>
                  <Col md={12}>
                    <Form.Item
                      label="Header Image"
                      name="header_image"
                      layout="vertical"
                    >
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Input
                          value={fileList[0]?.name}
                          placeholder="No file selected"
                          readOnly
                          addonAfter={
                            <Upload {...props} showUploadList={false}>
                              <Button variant="text" type="text" size="small">
                                Select File
                              </Button>
                            </Upload>
                          }
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Signature Img"
                      name="signature_image"
                      layout="vertical"
                    >
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Input
                          value={signatureImg[0]?.name}
                          placeholder="No file selected"
                          readOnly
                          addonAfter={
                            <Upload {...signatureProps} showUploadList={false}>
                              <Button variant="text" type="text" size="small">
                                Select File
                              </Button>
                            </Upload>
                          }
                        />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col
                className="gutter-row"
                span={24}
                style={{
                  marginTop: 30,
                }}
              >
                <Row gutter={12}>
                  <Col md={12}>
                    <Form.Item
                      label="Background"
                      name="background_image"
                      layout="vertical"
                    >
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Input
                          value={backgroundImg[0]?.name}
                          placeholder="No file selected"
                          readOnly
                          addonAfter={
                            <Upload {...backgroundProps} showUploadList={false}>
                              <Button variant="text" type="text" size="small">
                                Select File
                              </Button>
                            </Upload>
                          }
                        />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      ),
    },
    {
      title: "Template Content",
      content: (
        <div
          style={{
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 220px)",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: 0,
          }}
        >
          <div style={{ marginTop: 0 }}>
            <Form.Item
              name="template_content"
              layout="vertical"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please select the scheme!",
              //   },
              // ]}
            >
              <div style={{ height: 350 }}>
                {/* <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={value}
                  onChange={(value) => dispatch(setAdmissionQuillValue(value))}
                  preserveWhitespace={true}
                  modules={modules}
                  style={{ height: "270px", whiteSpace: "pre-wrap" }}
                /> */}
                <JoditEditor
                  // editorRef={handleEditorInit}
                  ref={editor}
                  value={value}
                  onBlur={(newContent) =>
                    dispatch(setAdmissionQuillValue(newContent))
                  }
                  onChange={(newContent) => {}}
                  config={config}
                />

                {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
              </div>
              <Space wrap>
                {fields_ref.map((field) => (
                  <Button key={field.ref} onClick={() => insertText(field.ref)}>
                    {`{${field.ref}}`}
                  </Button>
                ))}
              </Space>
              <Button onClick={insertColumns}>Insert Two Columns</Button>
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      title: "Dates",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 240px)",
            overflowY: "scroll",
            overflowX: "hidden",
            // padding: 10,
          }}
        >
          <Divider orientation="left" orientationMargin="0">
            Reporting Dates
          </Divider>
          {rows.map((row, index) => (
            <Row key={row.id} gutter={16} align="middle">
              <Col span={11}>
                <Form.Item
                  label="Study Time"
                  name={`study_time_${row.id}`}
                  rules={[
                    { required: true, message: "Please select study time!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Study Time"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.study_times
                        ? data.study_times.map((st) => ({
                            value: st.id,
                            label: st.study_time_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item
                  label="Date"
                  name={`date_${row.id}`}
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {rows.length > 1 && (
                <Col
                  span={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRow(row.id)}
                  />
                </Col>
              )}
            </Row>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
            >
              Add
            </Button>
          </div>
          {/* <div>
            <Row gutter={0}>
              <Col className="gutter-row" span={12}>
                <Form.Item label="Study Time" name="study_time">
                  <Select
                    showSearch
                    placeholder="Select Study Time"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.study_times
                        ? data?.study_times.map((st) => ({
                            value: st.id,
                            label: st.study_time_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item label="Date" name="date">
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Study Time"
                  name="study_time"
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "Please Select intake!",
                  //     },
                  //   ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Study Time"
                    // loading={loadingRequirements}

                    options={[]}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Date"
                  name="date"
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "Please select the scheme!",
                  //     },
                  //   ]}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button color="primary" variant="text" icon={<Add />}>
                Add
              </Button>
            </div>
          </div> */}

          <Divider orientation="left" orientationMargin="0">
            Registration Dates
          </Divider>
          {registrationRows.map((row, index) => (
            <Row key={row.id} gutter={16} align="middle">
              <Col span={11}>
                <Form.Item
                  label="Study Time"
                  name={`study_time_reg_${row.id}`}
                  rules={[
                    { required: true, message: "Please select study time!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Study Time"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.study_times
                        ? data.study_times.map((st) => ({
                            value: st.id,
                            label: st.study_time_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item
                  label="Date"
                  name={`date_reg_${row.id}`}
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker.RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {registrationRows.length > 1 && (
                <Col
                  span={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRegRow(row.id)}
                  />
                </Col>
              )}
            </Row>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddRegRow}
            >
              Add
            </Button>
          </div>

          <Divider orientation="left" orientationMargin="0">
            Lectures Start And End Dates
          </Divider>
          {lectureRows.map((row, index) => (
            <Row key={row.id} gutter={16} align="middle">
              <Col span={11}>
                <Form.Item
                  label="Study Time"
                  name={`study_time_lecture_${row.id}`}
                  rules={[
                    { required: true, message: "Please select study time!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Study Time"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.study_times
                        ? data.study_times.map((st) => ({
                            value: st.id,
                            label: st.study_time_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item
                  label="Date"
                  name={`date_lecture_${row.id}`}
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker.RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {lectureRows.length > 1 && (
                <Col
                  span={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteLectureRow(row.id)}
                  />
                </Col>
              )}
            </Row>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddLectureRow}
            >
              Add
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 10,
    paddingTop: 10,
  };

  return (
    <div>
      <Modal
        open={admissionLetterModalVisible}
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
        width={700}
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
        style={{
          top: 10,
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
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              style={{
                //   opacity: 0.7,
                color: "white",
              }}
            >
              {"Admission Letter Setup"}
            </Typography>

            <Close
              style={{
                color: "white",
                fontSize: 25,
                cursor: "pointer",
                //  marginRight: 10,
              }}
              onClick={() => {
                dispatch(setAdmissionLetterModalVisible(false));
                //   handleClose();
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
            <Steps size="small" current={current} items={items} />
            <Form
              name="admissionLetterForm"
              form={form}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 32,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              //  onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <div style={contentStyle}>{steps[current].content}</div>

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* {current === 2 && (
                               <Button
                                 type="primary"
                                 style={{
                                   alignSelf: "flex-start",
                                 }}
                                 // onClick={addQualification}
                                 icon={<Add />}
                               >
                                 Add Academic Information
                               </Button>
                             )} */}
                </div>

                <div>
                  {current > 0 && (
                    <Button
                      style={{
                        margin: "0 8px",
                      }}
                      onClick={() => prev()}
                    >
                      Previous
                    </Button>
                  )}
                  {current < steps.length - 1 && (
                    <Button
                      type="primary"
                      onClick={async () => {
                        // first validate before going next
                        const form1Valid = await form.validateFields();
                        if (form1Valid) {
                          // console.log("values so far", form1.getFieldsValue());
                          next();
                          setValues({ ...values, ...form.getFieldsValue() });
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </Card>
      </Modal>
    </div>
  );
}

export default CreateAdmissionLetterModal;
