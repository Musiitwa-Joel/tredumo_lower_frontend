import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCreateRoleModalVisible,
  selectSelectedRole,
  setCreateRoleModalVisible,
} from "../../store/systemAccessSlice";
import { useMutation } from "@apollo/client";
import { SAVE_ROLE } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
const { TextArea } = Input;

const CreateRoleModal = () => {
  const dispatch = useDispatch();
  const modalVisible = useSelector(selectCreateRoleModalVisible);

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

  const handleOk = () => {
    form.submit();
    // dispatch(setCreateRoleModalVisible(false));
  };

  const handleCancel = () => {
    dispatch(setCreateRoleModalVisible(false));
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);
    const payload = {
      payload: {
        role_name: values.role_name,
        description: values.description,
        id: null,
      },
    };

    const res = await saveRole({ variables: payload });

    dispatch(setCreateRoleModalVisible(false));
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
          labelCol={{
            span: 8,
          }}
          initialValues={{
            remember: true,
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

export default CreateRoleModal;
