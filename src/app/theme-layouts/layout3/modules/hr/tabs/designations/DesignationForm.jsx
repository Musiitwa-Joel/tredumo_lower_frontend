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

import { useMutation, useQuery } from "@apollo/client";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_DESIGNATION } from "../../gql/mutations";
import {
  selectDesignationModalVisible,
  selectSelectedDesignation,
  setDesignationModalVisible,
  setSelectedDesignation,
} from "../../store/hrSlice";
const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function DesignationForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const selectedRow = useSelector(selectSelectedDesignation);
  const designationModalVisible = useSelector(selectDesignationModalVisible);
  const [saveDesignation, { error, loading, data }] = useMutation(
    SAVE_DESIGNATION,
    {
      refetchQueries: ["loadDesignations"],
    }
  );

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
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        designation_name: selectedRow.designation_name,
      });
    }
  }, [selectedRow]);

  const onFinish = async (values) => {
    const payload = {
      payload: {
        id: selectedRow ? selectedRow.id : null,
        name: values.designation_name,
        description: null,
      },
    };

    const res = await saveDesignation({
      variables: payload,
    });

    form.resetFields();
    dispatch(setSelectedDesignation(null));
    dispatch(setDesignationModalVisible(false));

    dispatch(
      showMessage({
        message: res.data.saveDesignation.message,
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
    dispatch(setSelectedDesignation(null));
  };

  if (designationModalVisible) {
    return (
      <Modal
        open={designationModalVisible}
        onCancel={() => dispatch(setDesignationModalVisible(false))}
        footer={false}
      >
        <Form
          name="basic"
          form={form}
          layout="vertical"
          initialValues={{
            has_amount: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Designation Name"
            name="designation_name"
            rules={[
              {
                required: true,
                message: "Please input the designation title",
              },
            ]}
          >
            <Input />
          </Form.Item>

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
                loading={loading}
                disabled={loading}
              >
                Save
              </Button2>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    );
  } else {
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
              {"Add Designation"}
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
                initialValues={{
                  has_amount: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Designation Name"
                  name="designation_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the designation title",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

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
                      loading={loading}
                      disabled={loading}
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
}

export default DesignationForm;
