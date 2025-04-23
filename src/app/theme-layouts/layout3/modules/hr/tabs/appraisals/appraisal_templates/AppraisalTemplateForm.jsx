import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import _ from "lodash";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import {
  Button as Button2,
  Form,
  Input,
  Space,
  Checkbox,
  Select,
  Modal,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { gql, useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_APPRAISAL_TEMPLATE } from "../../../gql/mutations";
import {
  selectSelectedTemplate,
  setSelectedTemplate,
} from "../../../store/hrSlice";

const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LOAD_REQS = gql`
  query Query {
    employees {
      id
      salutation
      surname
      other_names
    }
    all_roles {
      role_id
      role_name
    }
  }
`;

function AppraisalTemplateForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [pdfFile, setPdfFile] = useState(null);
  const selectedTemplate = useSelector(selectSelectedTemplate);
  const [
    saveAppraisalTemplate,
    { error: saveErr, loading: savingTemplate, data: saveRes },
  ] = useMutation(SAVE_APPRAISAL_TEMPLATE, {
    refetchQueries: ["loadEvaluationTemplates"],
  });

  useEffect(() => {
    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }
  }, [saveErr]);

  // console.log("user", selectedUser);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      form.setFieldsValue({
        name: selectedTemplate.template_name,
        description: selectedTemplate?.description,
      });
    }
  }, [selectedTemplate]);

  // useEffect(() => {
  //   if (error) {
  //     dispatch(
  //       showMessage({
  //         message: error.message,
  //         variant: "error",
  //       })
  //     );
  //   }

  //   if (addErr) {
  //     dispatch(
  //       showMessage({
  //         message: addErr.message,
  //         variant: "error",
  //       })
  //     );
  //   }
  // }, [error, addErr]);

  // useEffect(() => {
  //   if (selectedRow) {
  //     form.setFieldsValue({
  //       designation_name: selectedRow.designation_name,
  //     });
  //   }
  // }, [selectedRow]);

  const onFinish = async (values) => {
    // console.log("the values", values);

    const payload = {
      payload: {
        template_id: selectedTemplate ? selectedTemplate?.template_id : null,
        template_name: values.name,
        description: values.description,
      },
    };

    const res = await saveAppraisalTemplate({
      variables: payload,
    });

    form.resetFields();
    dispatch(setSelectedTemplate(null));

    dispatch(
      showMessage({
        message: res.data.saveEvaluationTemplate.message,
        variant: "success",
      })
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      has_amount: true,
      // item_name: "jsdjkdj",
    });
  }, []);

  const handleClear = () => {
    form.resetFields();
    // dispatch(setSelectedDesignation(null));
  };

  return (
    <div
      className="p-16"
      // ref={scrollContainerRef}
      // style={{
      //   height: 100,
      // }}
    >
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: "#fff",
          marginRight: 10,
          overflow: "hidden",
          borderColor: "lightgray",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
            marginBottom: 10,
            // color: "red",
            borderColor: "red",
          }}
        >
          <Typography className="font-medium text-20 bold">
            {"Appraisal Template"}
          </Typography>
        </Divider>

        <div className="max-w-full relative">
          <Box
            // component="form"
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 8,
              //   backgroundColor: "red",
            }}
          >
            <Form
              name="basic"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Description is required",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              {/* <Form.Item
                label="Template"
                name="template"
                rules={[
                  {
                    required: true,
                    message: "Template is required",
                  },
                ]}
              >
                <Input
                  type="file"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </Form.Item> */}

              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Form.Item
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
                >
                  <Button2 onClick={handleClear}>Clear</Button2>
                </Form.Item>
                <Form.Item
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
                >
                  <Button2
                    type="primary"
                    htmlType="submit"
                    loading={savingTemplate}
                    disabled={savingTemplate}
                  >
                    Save
                  </Button2>
                </Form.Item>
              </Space>
            </Form>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default AppraisalTemplateForm;
