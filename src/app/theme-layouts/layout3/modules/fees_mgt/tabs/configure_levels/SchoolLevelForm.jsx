import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import * as yup from "yup";

import _ from "lodash";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Button as Button2, Form, Input, Space, Select, message } from "antd";
import {
  selectSelectedCategoryRow,
  selectSelectedSchool,
  setSelectedCategoryRow,
  setSelectedSchool,
} from "../../store/feesMgtSlice";
import formatToShortDate from "app/theme-layouts/layout3/utils/formatToShortDate";
import { SAVE_FEES_CATEGORY, SAVE_SCHOOL_LEVELS } from "../../gql/mutations";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const GET_LEVELS = gql`
  query levels {
    levels {
      id
      level_code
      level_title
    }
  }
`;

function SchoolLevelForm() {
  const user = useSelector((state) => state.user.user);
  const selectedCategory = useSelector(selectSelectedCategoryRow);
  const selectedSchool = useSelector(selectSelectedSchool);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [saveFeesCategory, { loading: savingCategory, error, data }] =
    useMutation(SAVE_FEES_CATEGORY, {
      refetchQueries: ["getFeesCategories"],
    });

  const [
    saveSchoolLevels,
    { loading: savingSchoolLevels, error: saveErr, data: saveRes },
  ] = useMutation(SAVE_SCHOOL_LEVELS, {
    refetchQueries: ["loadSchools"],
  });

  const {
    loading: loadingLevels,
    error: levelsErr,
    data: levelsRes,
  } = useQuery(GET_LEVELS);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (levelsErr) {
      dispatch(
        showMessage({
          message: levelsErr.message,
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
  }, [error, levelsErr, saveErr]);

  const onFinish = async (values) => {
    // console.log("Success:", values);
    // const idsString = values.levels.join(",");

    // console.log("Comma seperated values:", idsString);
    const payload = {
      schoolId: selectedSchool.id,
      levels: values.levels,
      addedBy: user.user_id,
    };

    const res = await saveSchoolLevels({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.saveSchoolLevels.message,
        variant: "success",
      })
    );
  };

  // console.log("selected row", selectedCategory);

  useEffect(() => {
    if (selectedSchool) {
      form.setFieldsValue({
        levels: selectedSchool.levels.map((level) => level.id),
      });

      form2.setFieldsValue({
        added_by: `${selectedSchool.added_user.title} ${selectedSchool.added_user.staff_name}`,
      });

      if (selectedSchool.modified_user) {
        form2.setFieldsValue({
          modified_by: `${selectedSchool.modified_user.title} ${selectedSchool.modified_user.staff_name}`,
        });
        form2.setFieldsValue({
          modified_on: formatToShortDate(parseInt(selectedSchool.modified_on)),
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
  }, [selectedSchool]);

  const handleClear = () => {
    form.resetFields();
    form2.resetFields();
    dispatch(setSelectedSchool(null));
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
            {selectedSchool
              ? `${selectedSchool.school_code} - ${selectedSchool.school_title}`
              : "Select a school"}
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
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Levels"
                name="levels"
                rules={[
                  {
                    required: true,
                    message: "Please input atleast one level!",
                  },
                ]}
              >
                {/* <Input /> */}

                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  loading={loadingLevels}
                  placeholder="Please select Level..."
                  // defaultValue={}
                  // onChange={handleChange}
                  options={
                    levelsRes
                      ? levelsRes.levels.map((level) => ({
                          value: level.id,
                          label: `${level.level_title} - ${level.level_code}`,
                        }))
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
                    style={{
                      backgroundColor:
                        savingSchoolLevels || !selectedSchool
                          ? ""
                          : "dodgerblue",
                    }}
                    loading={savingSchoolLevels}
                    disabled={!selectedSchool || savingSchoolLevels}
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
              name="logs"
              form={form2}
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
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="Added By" name="added_by">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Last Modified By" name="modified_by">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Last Modified On" name="modified_on">
                <Input readOnly />
              </Form.Item>
            </Form>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default SchoolLevelForm;
