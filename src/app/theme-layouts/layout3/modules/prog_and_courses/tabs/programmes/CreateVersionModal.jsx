import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddVersionModalOpen,
  selectCourseVersionToEdit,
  selectSelectedItem,
  updateAddVersionModalOpen,
} from "../../store/progAndCoursesSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useMutation } from "@apollo/client";
import { SAVE_COURSE_VERSION } from "../../gql/mutations";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const CreateVersionModal = () => {
  const dispatch = useDispatch();
  // const { addVersionModalOpen, selectedItem, courseVersionToEdit } =
  //   useSelector((state) => state.progAndCourses);

  const addVersionModalOpen = useSelector(selectAddVersionModalOpen);
  const selectedItem = useSelector(selectSelectedItem);
  const courseVersionToEdit = useSelector(selectCourseVersionToEdit);
  const user = useSelector((state) => state.user.user);
  const [form] = Form.useForm(); // Create form instance

  const [
    saveCourseVersion,
    {
      error: saveCourseVersionError,
      loading: savingCourseVersion,
      data: saveCourseVersionRes,
    },
  ] = useMutation(SAVE_COURSE_VERSION, {
    refetchQueries: ["getAllProgrammesCategorisedBySchools"],
  });

  useEffect(() => {
    if (saveCourseVersionError) {
      dispatch(
        showMessage({
          message: "Error saving course " + saveCourseVersionError.message,
          variant: "error",
        })
      );
    }
  }, [saveCourseVersionError]);

  const handleOk = () => {
    form.submit(); // Trigger form submission on OK button click
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    console.log("selected Item", selectedItem.key);
    let payload = null;

    if (courseVersionToEdit) {
      payload = {
        saveCourseVersionId: courseVersionToEdit.id,
        courseId: courseVersionToEdit.course.id,
        versionTitle: values.version_title,
        addedBy: user.biodata.id,
      };
    } else {
      payload = {
        courseId: selectedItem.key,
        versionTitle: values.version_title,
        addedBy: user.biodata.id,
      };
    }

    // console.log("payload", payload);

    const res = await saveCourseVersion({
      variables: payload,
    });

    dispatch(updateAddVersionModalOpen(false));
    form.resetFields();

    dispatch(
      showMessage({
        message: "Course version saved Succesfully",
        variant: "info",
      })
    );
  };

  useEffect(() => {
    if (courseVersionToEdit) {
      form.setFieldsValue({
        version_title: courseVersionToEdit.label,
      });
    } else {
      form.resetFields();
    }
  }, [form, courseVersionToEdit]);

  // console.log(courseVersionToEdit);

  return (
    <>
      <Modal
        title={
          courseVersionToEdit
            ? "Edit Course Version"
            : "Create New Course Version"
        }
        style={{
          top: 100,
        }}
        open={addVersionModalOpen}
        onOk={handleOk} // Call handleOk when OK button is clicked
        okText="Save"
        onCancel={() => dispatch(updateAddVersionModalOpen(false))}
        okButtonProps={{
          style: {
            backgroundColor: "dodgerblue",
          },
          loading: savingCourseVersion,
        }}
      >
        <Form
          form={form} // Associate form instance with the form
          layout="vertical"
          preserve={false}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Version Title"
            name="version_title"
            rules={[
              {
                required: true,
                message: "Please input the Version!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateVersionModal;
