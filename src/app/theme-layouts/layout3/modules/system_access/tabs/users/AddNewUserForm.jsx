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
  Radio,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";

// import { gql, useMutation, useQuery } from "@apollo/client";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
// import { ADD_NEW_USER } from "../../gql/mutations";
import {
  selectSelectedUser,
  selectUsers,
  setUsers,
} from "../../store/systemAccessSlice";
import api from "app/configs/api";

const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

// const LOAD_REQS = gql`
//   query Query {
//     employees {
//       id
//       salutation
//       surname
//       other_names
//     }
//     all_roles {
//       role_id
//       role_name
//     }
//     schools {
//       id
//       school_code
//       school_title
//     }
//   }
// `;

function AddNewUserForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const users = useSelector(selectUsers);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [savingUsers, setSavingUsers] = useState(false);
  // const { error, loading, data } = useQuery(LOAD_REQS);
  const selectedUser = useSelector(selectSelectedUser);
  // const [addNewUser, { error: addErr, loading: addingUser, data: addRes }] =
  //   useMutation(ADD_NEW_USER, {
  //     refetchQueries: ["loadUsers"],
  //   });

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

  const onFinish = async (values) => {
    const payload = {
      first_name: values.first_name,
      other_names: values.other_names,
      email: values.email,
      gender: values.gender,
    };

    setSavingUsers(true);

    try {
      const response = await api.post("/api/users", payload);

      if (response.data?.success) {
        // Fetch updated users list
        const usersResponse = await api.get("/api/users");
        
        // Update Redux store with new users list
        dispatch(setUsers(usersResponse.data.result));

        dispatch(
          showMessage({
            message: response.data.message,
            variant: "success",
          })
        );

        // Clear the form
        handleClear();
      } else {
        dispatch(
          showMessage({
            message: response.data.message,
            variant: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error adding user",
          variant: "error",
        })
      );
    } finally {
      setSavingUsers(false);
    }}

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
            {"Add Login Details"}
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
                label="First Name"
                name="first_name"
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
                label="Other Names"
                name="other_names"
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
                label="Email"
                name="email"
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
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "This is required",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="M">Male</Radio>
                  <Radio value="F">Female</Radio>
                </Radio.Group>
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
                    loading={savingUsers}
                    disabled={savingUsers}
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
