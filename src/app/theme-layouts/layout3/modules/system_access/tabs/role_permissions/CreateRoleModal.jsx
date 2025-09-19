import React, { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCreateRoleModalVisible,
  setCreateRoleModalVisible,
} from "../../store/systemAccessSlice";
import { useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { gql } from "@apollo/client";

const { TextArea } = Input;

const SAVE_ROLE = gql`
  mutation SaveRole($payload: RoleInput!) {
    saveRole(payload: $payload) {
      success
      message
    }
  }
`;

const LOAD_ROLES = gql`
  query All_roles {
    all_roles {
      id
      name
      description
      _modules {
        id
        title
        description
        route
        logo
      }
      permissions
    }
  }
`;

const CreateRoleModal = () => {
  const dispatch = useDispatch();
  const modalVisible = useSelector(selectCreateRoleModalVisible);
  const [form] = Form.useForm();

  const [saveRole, { loading, error }] = useMutation(SAVE_ROLE, {
    refetchQueries: [{ query: LOAD_ROLES }],
  });

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.message ||
        error.message ||
        "Unknown error occurred";
      dispatch(
        showMessage({
          message: `Failed to save role: ${errorMessage}`,
          variant: "error",
        })
      );
    }
  }, [error, dispatch]);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    dispatch(setCreateRoleModalVisible(false));
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        payload: {
          role_name: values.role_name,
          description: values.description || "",
        },
      };
      console.log("Sending payload:", payload);

      const res = await saveRole({ variables: payload });

      console.log("Server response:", res);
      if (res.data?.saveRole?.success) {
        dispatch(
          showMessage({
            message: res.data.saveRole.message,
            variant: "success",
          })
        );
        dispatch(setCreateRoleModalVisible(false));
        form.resetFields();
      } else {
        dispatch(
          showMessage({
            message: res.data?.saveRole?.message || "Failed to save role",
            variant: "error",
          })
        );
      }
    } catch (err) {
      console.error("Save role error:", err);
    }
  };

  return (
    <Modal
      title="Create New Role"
      open={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText="Create Role"
      okButtonProps={{
        loading: loading,
        disabled: loading,
      }}
    >
      <Form
        form={form}
        name="roleForm"
        labelCol={{ span: 8 }}
        initialValues={{ remember: true, description: "" }}
        preserve={false}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Role Name"
          name="role_name"
          rules={[
            {
              required: true,
              message: "Please input the role name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoleModal;
