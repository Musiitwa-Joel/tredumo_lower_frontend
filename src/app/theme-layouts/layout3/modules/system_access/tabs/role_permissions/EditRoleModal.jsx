import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEditRoleModalVisible,
  selectSelectedRole,
  setCreateRoleModalVisible,
  setEditRoleModalVisible,
} from "../../store/systemAccessSlice";
import { useMutation } from "@apollo/client";
import { SAVE_ROLE } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
const { TextArea } = Input;

const EditRoleModal = () => {
  const dispatch = useDispatch();
  const modalVisible = useSelector(selectEditRoleModalVisible);
  const selectedRole = useSelector(selectSelectedRole);
  const [form] = Form.useForm();

  const [saveRole, { loading, error, data }] = useMutation(SAVE_ROLE, {
    refetchQueries: ["loadRoles"],
  });

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
    form.setFieldsValue({
      role_name: selectedRole?.role_name,
      description: selectedRole?.description,
    });
  }, [selectedRole]);

  const handleOk = () => {
    form.submit();
    // dispatch(setCreateRoleModalVisible(false));
  };

  const handleCancel = () => {
    dispatch(setEditRoleModalVisible(false));
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);
    const payload = {
      payload: {
        role_name: values.role_name,
        description: values.description,
        id: selectedRole.role_id ? selectedRole.role_id : null,
      },
    };

    // console.log("payload", payload);

    const res = await saveRole({ variables: payload });

    dispatch(setEditRoleModalVisible(false));
    form.resetFields();

    dispatch(
      showMessage({
        message: res.data.saveRole.message,
        variant: "success",
      })
    );
  };

  return (
    <>
      <Modal
        title="Edit Role"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        okText="Update Role"
        okButtonProps={{
          loading: loading,
          disabled: loading,
        }}
      >
        <Form
          form={form}
          name="editRoleForm"
          labelCol={{
            span: 8,
          }}
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

          <Form.Item label="Description" name="description" initialValue={""}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditRoleModal;
