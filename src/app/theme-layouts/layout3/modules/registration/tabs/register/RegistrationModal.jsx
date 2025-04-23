import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Modal } from "antd";
import {
  selectRegistrationModalVisible,
  selectStudentData,
  setRegistrationModalVisible,
} from "../../store/registrationSlice";
import { REGISTER_STUDENT } from "../../gql/mutations";
import { useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { TextArea } = Input;

function RegistrationModal() {
  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const registrationmodalVisible = useSelector(selectRegistrationModalVisible);
  const [form] = Form.useForm();

  const [registerStudent, { error, loading, data }] = useMutation(
    REGISTER_STUDENT,
    {
      refetchQueries: ["loadStudentFile"],
    }
  );

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

  const onRegister = async (values) => {
    const payload = {
      payload: {
        acc_yr_id: studentFile?.current_info.acc_yr_id,
        reg_comments: values.reg_comment,
        sem: studentFile?.current_info.true_sem,
        student_no: studentFile?.student_no,
        study_yr: studentFile?.current_info.true_study_yr,
        enrollment_token:
          studentFile?.current_info.recent_enrollment.enrollment_token,
      },
    };

    const res = await registerStudent({
      variables: payload,
    });

    if (res.data?.registerStudent) {
      dispatch(
        showMessage({
          message: res.data.registerStudent.message,
          variant: "success",
        })
      );

      dispatch(setRegistrationModalVisible(false));
    }
  };

  if (!studentFile) return null;

  return (
    <>
      <Modal
        title={
          <div
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            <span
              style={{
                color: "purple",
              }}
            >
              Register{" "}
              {`${studentFile?.biodata.surname} ${studentFile?.biodata.other_names}`}{" "}
              - {studentFile?.student_no}
            </span>
          </div>
        }
        style={{ top: "25%" }}
        open={registrationmodalVisible}
        onOk={() => form.submit()}
        onCancel={() => dispatch(setRegistrationModalVisible(false))}
        okText="Register"
        okButtonProps={{
          loading: loading,
          disabled: loading,
        }}
        maskClosable={false}
      >
        <div
          style={{
            marginTop: 15,
          }}
        >
          <Form
            name="RegForm"
            form={form}
            layout="vertical"
            onFinish={onRegister}
            initialValues={{
              reg_comment: "",
            }}
            autoComplete="off"
          >
            <Form.Item label="Registration Comment" name="reg_comment">
              <TextArea rows={4} placeholder="Registration Comment" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default RegistrationModal;
