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

import { gql, useMutation, useQuery } from "@apollo/client";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { ADD_NEW_USER } from "../../gql/mutations";
import { selectSelectedUser } from "../../store/systemAccessSlice";

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
    schools {
      id
      school_code
      school_title
    }
  }
`;

function AddNewUserForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { error, loading, data } = useQuery(LOAD_REQS);
  const selectedUser = useSelector(selectSelectedUser);
  const [addNewUser, { error: addErr, loading: addingUser, data: addRes }] =
    useMutation(ADD_NEW_USER, {
      refetchQueries: ["loadUsers"],
    });

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
    if (selectedUser) {
      form.setFieldsValue({
        staff: selectedUser?.biodata?.id,
        user_id: selectedUser?.email,
        role: selectedUser?.role?.role_id,
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (addErr) {
      dispatch(
        showMessage({
          message: addErr.message,
          variant: "error",
        })
      );
    }
  }, [error, addErr]);

  // useEffect(() => {
  //   if (selectedRow) {
  //     form.setFieldsValue({
  //       designation_name: selectedRow.designation_name,
  //     });
  //   }
  // }, [selectedRow]);

  const onFinish = async (values) => {
    const payload = {
      payload: {
        role_id: values.role,
        user_id: values.user_id,
        employee_id: values.staff,
        school_id: values.school,
      },
    };

    const res = await addNewUser({
      variables: payload,
    });

    form.resetFields();
    // // dispatch(setSelectedDesignation(null));
    // // dispatch(setDesignationModalVisible(false));

    dispatch(
      showMessage({
        message: res.data.addNewUser.message,
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
            {"Add New User"}
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
                label="Staff"
                name="staff"
                rules={[
                  {
                    required: true,
                    message: "Please select Staff",
                  },
                ]}
              >
                <Select
                  showSearch
                  // loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data
                      ? data?.employees?.map((emp) => ({
                          label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                          value: emp.id,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Email or any other user id"
                name="user_id"
                rules={[
                  {
                    required: true,
                    message: "This is required",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="User Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select user role",
                  },
                ]}
              >
                <Select
                  showSearch
                  // loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data
                      ? data?.all_roles?.map((role) => ({
                          label: `${role.role_name}`,
                          value: role.role_id,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Faculty/Schools"
                name="school"
                initialValue={null}
              >
                <Select
                  showSearch
                  // loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data
                      ? [
                          {
                            label: "ALL SCHOOLS",
                            value: null,
                          },
                          ...data?.schools?.map((school) => ({
                            label: `(${school.school_code}) ${school.school_title}`,
                            value: school.id,
                          })),
                        ]
                      : []
                  }
                />
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
                    loading={addingUser}
                    disabled={addingUser}
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

export default AddNewUserForm;
