import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import _ from "lodash";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Button as Button2, Form, Input, Space, Checkbox, Select } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { GET_FEES_CATEGORIES } from "../../gql/queries";
import {
  selectFeesCategories,
  selectSelectedFeeItemRow,
  setFeesCategories,
  setSelectedFeeItemRow,
} from "../../store/feesMgtSlice";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_FEES_ITEM } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function FeeItemForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const feesCategories = useSelector(selectFeesCategories);
  const selectedRow = useSelector(selectSelectedFeeItemRow);

  const { error, loading, data } = useQuery(GET_FEES_CATEGORIES, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    saveFeesItems,
    { error: saveErr, loading: savingFeesItem, data: saveRes },
  ] = useMutation(SAVE_FEES_ITEM, {
    refetchQueries: ["getFeesItems"],
  });

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

    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }
  }, [error, saveErr]);

  if (data) {
    // console.log("response", data);
    dispatch(setFeesCategories(data.fees_categories));
  }

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        item_code: selectedRow.item_code,
        item_name: selectedRow.item_name,
        item_decription: selectedRow.item_description,
        category: selectedRow.category.id,
        is_mandatory: Boolean(selectedRow.mandatory),
      });
    }
  }, [selectedRow]);

  const onFinish = async (values) => {
    const payload = {
      itemCode: values.item_code,
      itemName: values.item_name,
      category: values.category,
      mandatory: values.is_mandatory ? Number(values.is_mandatory) : 0,
      itemDescription: values.item_decription ? values.item_decription : null,
      saveFeesItemId: selectedRow ? selectedRow.id : null,
    };

    // console.log("patload:", payload);

    const res = await saveFeesItems({
      variables: payload,
    });

    form.resetFields();
    dispatch(setSelectedFeeItemRow(null));

    dispatch(
      showMessage({
        message: res.data.saveFeesItem.message,
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
    dispatch(setSelectedFeeItemRow(null));
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
            {"Add Fee Item"}
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
                label="Item Code"
                name="item_code"
                rules={[
                  {
                    required: true,
                    message: "Please input the item code",
                  },
                ]}
              >
                <Input placeholder="Item Unique Code" />
              </Form.Item>
              <Form.Item
                label="Item Name"
                name="item_name"
                rules={[
                  {
                    required: true,
                    message: "Please input the item name",
                  },
                ]}
              >
                <Input placeholder="Name of the Item" />
              </Form.Item>

              <Form.Item label="Item Description" name="item_decription">
                <TextArea rows={3} placeholder="Item Description" />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Category is required",
                  },
                ]}
              >
                <Select
                  loading={loading}
                  // placeholder="Select a option and change input text above"
                  // onChange={onGenderChange}
                  allowClear
                  placeholder="Fees Category"
                >
                  {feesCategories.map((cat) => (
                    <Select.Option value={cat.id}>
                      {cat.category_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="is_mandatory"
                valuePropName="checked"
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
              >
                <Checkbox>Is Fee Mandatory?</Checkbox>
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
                    style={{
                      backgroundColor: savingFeesItem ? "" : "dodgerblue",
                    }}
                    loading={savingFeesItem}
                    disabled={savingFeesItem}
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

export default FeeItemForm;
