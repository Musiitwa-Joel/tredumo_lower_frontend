import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Form, Input, Modal } from "antd";
import {
  selectProvisionalRegModalVisible,
  selectStudentData,
  setProvisionalRegModalVisible,
} from "../../store/registrationSlice";
import { REGISTER_STUDENT } from "../../gql/mutations";
import { useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";

const { TextArea } = Input;

function ProvisionalRegistrationModal() {
  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const registrationmodalVisible = useSelector(
    selectProvisionalRegModalVisible
  );
  const [form] = Form.useForm();

  const [provisonallyRegisterStudent, { error, loading, data }] = useMutation(
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
        reg_comments: null,
        sem: studentFile?.current_info.true_sem,
        student_no: studentFile?.student_no,
        study_yr: studentFile?.current_info.true_study_yr,
        enrollment_token:
          studentFile?.current_info.recent_enrollment.enrollment_token,
        provisional: 1,
        provisional_expiry: formatDateToYYYYMMDD(values.expiry_date.$d),
        provisional_reason: values?.reg_comment,
      },
    };

    // console.log("payload", payload);

    const res = await provisonallyRegisterStudent({
      variables: payload,
    });

    if (res.data?.registerStudent) {
      dispatch(
        showMessage({
          message: res.data.registerStudent.message,
          variant: "success",
        })
      );

      form.resetFields();
      dispatch(setProvisionalRegModalVisible(false));
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
                color: "green",
              }}
            >
              Provisionally Register{" "}
              {`${studentFile?.biodata.surname} ${studentFile?.biodata.other_names}`}{" "}
              - {studentFile?.student_no}
            </span>
          </div>
        }
        style={{ top: "25%" }}
        open={registrationmodalVisible}
        onOk={() => form.submit()}
        onCancel={() => dispatch(setProvisionalRegModalVisible(false))}
        okText="Provisonally Register"
        okButtonProps={{
          loading: loading,
          disabled: loading,
          style: {
            backgroundColor: "green",
          },
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
            <Form.Item
              label="Expiry Date"
              name="expiry_date"
              rules={[
                {
                  required: true,
                  message: "Expiry Date is required",
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Registration Comment"
              name="reg_comment"
              rules={[
                {
                  required: true,
                  message: "Please Provide a comment",
                },
              ]}
            >
              <TextArea rows={3} placeholder="Registration Comment" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default ProvisionalRegistrationModal;
