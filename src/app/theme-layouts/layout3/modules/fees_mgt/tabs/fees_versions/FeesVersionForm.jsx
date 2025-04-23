import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import * as yup from "yup";

import _ from "lodash";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Button as Button2, Form, Input, Space } from "antd";
import {
  selectSelectedFeesVersionRow,
  setSelectedFeesVersionRow,
} from "../../store/feesMgtSlice";
import formatToShortDate from "app/theme-layouts/layout3/utils/formatToShortDate";
import { useMutation } from "@apollo/client";
import { SAVE_FEES_VERSION } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const schema = yup.object().shape({
  intake_title: yup.string().required("You must enter the intake title"),
});

const defaultValues = {
  id: null,
  intake_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function FeesVersionForm() {
  const user = useSelector((state) => state.user.user);
  const selectedIntake = useSelector((state) => state.setUp.selectedIntake);
  const dispatch = useDispatch();
  const selectedRow = useSelector(selectSelectedFeesVersionRow);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [saveFeesVersion, { error, loading: savingVersion, data: saveRes }] =
    useMutation(SAVE_FEES_VERSION, {
      refetchQueries: ["getFeesVersions"],
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

  const onFinish = async (values) => {
    const payload = {
      versionTitle: values.version_title,
      addedBy: user.user_id,
      versionDescription: values.version_description
        ? values.version_description
        : null,
      saveFeesVersionId: selectedRow ? selectedRow.id : null,
    };

    // console.log("Payload:", payload);

    const res = await saveFeesVersion({
      variables: payload,
    });

    form.resetFields();
    form2.resetFields();
    dispatch(setSelectedFeesVersionRow(null));

    dispatch(
      showMessage({
        message: res.data.saveFeesVersion.message,
        variant: "success",
      })
    );
  };

  // console.log("selected row", selectedRow);

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        version_title: selectedRow.version_title,
        version_description: selectedRow.version_description,
      });

      form2.setFieldsValue({
        added_by: `${selectedRow.added_user.title} ${selectedRow.added_user.staff_name}`,
      });

      if (selectedRow.modified_user) {
        form2.setFieldsValue({
          modified_by: `${selectedRow.modified_user.title} ${selectedRow.modified_user.staff_name}`,
        });
        form2.setFieldsValue({
          modified_on: formatToShortDate(parseInt(selectedRow.modified_on)),
        });
      } else {
        form2.setFieldsValue({
          modified_by: ``,
        });
        form2.setFieldsValue({
          modified_on: "",
        });
      }
    }
  }, [selectedRow]);

  const handleClear = () => {
    form.resetFields();
    form2.resetFields();
    dispatch(setSelectedFeesVersionRow(null));
  };

  return (
    <div className="p-16">
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.001)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Typography className="font-medium text-20 bold">
            {"Create New Fees Version"}
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
              labelCol={
                {
                  // span: 8,
                }
              }
              // wrapperCol={{
              //   span: 16,
              // }}
              layout="vertical"
              style={
                {
                  // maxWidth: 600,
                }
              }
              // initialValues={{
              //   remember: true,
              // }}
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
                    message: "Please input the version title",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="version_description" label="Version Description">
                <TextArea rows={3} />
              </Form.Item>
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Form.Item>
                  <Button2 onClick={handleClear}>Clear</Button2>
                </Form.Item>
                <Form.Item>
                  <Button2
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: savingVersion ? "" : "dodgerblue",
                    }}
                    loading={savingVersion}
                    disabled={savingVersion}
                  >
                    Save
                  </Button2>
                </Form.Item>
              </Space>
            </Form>
          </Box>
        </div>
      </Box>

      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.001)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
          marginTop: 3,
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
          }}
        >
          {" "}
          <Typography className="font-medium text-20 bold">{"Logs"}</Typography>
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
              form={form2}
              name="logs"
              labelCol={
                {
                  // span: 8,
                }
              }
              // wrapperCol={{
              //   span: 16,
              // }}
              layout="vertical"
              style={
                {
                  // maxWidth: 600,
                }
              }
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="Added By" name="added_by">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Modified By" name="modified_by">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Modified On" name="modified_on">
                <Input readOnly />
              </Form.Item>
            </Form>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default FeesVersionForm;
