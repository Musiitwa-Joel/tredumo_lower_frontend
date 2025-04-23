import React, { useEffect } from "react";
import {
  Collapse,
  Space,
  Checkbox,
  Spin,
  Button,
  Popconfirm,
  Form,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoadingRoleModules,
  selectRoleModules,
  selectSelectedPermissions,
  selectSelectedRole,
  setSelectedPermissions,
} from "../../store/systemAccessSlice";
import { Delete, Save } from "@mui/icons-material";
import {
  REMOVE_ROLE_MODULE,
  UPDATE_ROLE_PERMISSIONS,
} from "../../gql/mutations";
import { useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Fab from "@mui/material/Fab";
import { CircularProgress } from "@mui/material";

import AppPermissions from "./AppPermissions";

// function transformString(input) {
//   return input
//     .split("_") // Split the string into an array by '_'
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
//     .join(" "); // Join the words back with spaces
// }

// const CheckGreen = React.memo(() => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 62 62"
//     // width={16}
//     height={16}
//     style={{
//       display: "inline-block",
//       userSelect: "none",
//       verticalAlign: "text-bottom",
//       overflow: "visible",
//     }}
//   >
//     <path
//       d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50
// 	l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z"
//       fill="#43a047"
//     />
//   </svg>
// ));

// const CheckGray = React.memo(() => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 62 62"
//     height={16}
//     style={{
//       display: "inline-block",
//       userSelect: "none",
//       verticalAlign: "text-bottom",
//       overflow: "visible",
//     }}
//   >
//     <path
//       d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50
// 	l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z"
//       fill="#757575"
//     />
//   </svg>
// ));

// const modules = [
//   {
//     id: "3",
//     title: "Admissions",
//     route: "admissions",
//     permissions: [
//       {
//         permission_id: "1",
//         permission_name: "can_view_applicants ",
//         requires_approval: false,
//       },
//       {
//         permission_id: "2",
//         permission_name: "can_view_admission_schemes",
//         requires_approval: false,
//       },
//       {
//         permission_id: "3",
//         permission_name: "Can create_admission_schemes",
//         requires_approval: false,
//       },
//     ],
//   },
//   {
//     id: "17",
//     title: "Registration",
//     route: "registration",
//     permissions: [],
//   },
//   {
//     id: "2",
//     title: "Photo Booth",
//     route: "photos_manager",
//     permissions: [],
//   },
//   {
//     id: "4",
//     title: "Students Information Hub",
//     route: "student_information_center",
//     permissions: [],
//   },
//   {
//     id: "18",
//     title: "Timetable Management",
//     route: "time_table",
//     permissions: [],
//   },
//   {
//     id: "11",
//     title: "Course Administration Hub",
//     route: "programsencourses",
//     permissions: [],
//   },
//   {
//     id: "8",
//     title: "Education Monitoring And Tracking",
//     route: "student_assesment",
//     permissions: [],
//   },
// ];

const ModulesAndPermissions = () => {
  const dispatch = useDispatch();
  const roleModules = useSelector(selectRoleModules);
  const loadingRoleModules = useSelector(selectLoadingRoleModules);
  const selectedRole = useSelector(selectSelectedRole);
  const selectedPermissions = useSelector(selectSelectedPermissions);
  const [form] = Form.useForm();

  const [
    updateRolePermissions,
    { error: updateErr, loading: updatingPermissions, data: updateRes },
  ] = useMutation(UPDATE_ROLE_PERMISSIONS, {
    refetchQueries: ["loadRoles", "loadRoleModules"],
  });

  const [removeRoleModule, { error, loading, data }] = useMutation(
    REMOVE_ROLE_MODULE,
    {
      refetchQueries: ["loadRoleModules"],
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

    if (updateErr) {
      dispatch(
        showMessage({
          message: updateErr.message,
          variant: "error",
        })
      );
    }
  }, [error, updateErr]);

  useEffect(() => {
    if (selectedRole) {
      const firstExtract = JSON.parse(selectedRole.permissions); // Parse the permissions JSON
      const permissions = JSON.parse(firstExtract);

      // Clear the form first to reset all fields
      form.resetFields();

      // Set the new permissions
      form.setFieldsValue(permissions);
    }
  }, [selectedRole]);

  const onChangeCheckbox = (e) => {
    dispatch(setSelectedPermissions(e));
  };

  const removeApp = async (payload) => {
    const res = await removeRoleModule({
      variables: payload,
    });

    if (res.data.deleteRoleModule) {
      dispatch(
        showMessage({
          message: res.data.deleteRoleModule.message,
          variant: "success",
        })
      );
    }
  };

  const handleRemoveApp = (e, app) => {
    // console.log("app", app);
    // console.log("selected Role", selectedRole);

    const payload = {
      roleId: selectedRole.role_id,
      moduleId: app.id,
    };

    removeApp(payload);
  };

  const onFinish = async (values) => {
    console.log("payload", values);

    const payload = {
      payload: {
        permissions: JSON.stringify(values),
        role_id: selectedRole?.role_id,
      },
    };
    const res = await updateRolePermissions({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.updateRolePermissions.message,
        variant: "success",
      })
    );
  };

  return (
    <>
      <Form
        // labelCol={{
        //   span: 8,
        // }}
        // wrapperCol={{
        //   span: 16,
        // }}
        onFinish={onFinish}
        form={form}
      >
        <Spin
          spinning={loadingRoleModules || loading}
          tip="Loading"
          size="default"
        >
          <div
            style={{
              // backgroundColor: "red",
              height: "calc(100vh - 250px)",
              overflow: "scroll",
            }}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{
                width: "100%",
                // backgroundColor: "red",
                overflow: "scroll",
              }}
            >
              {roleModules.map((_module) => (
                <Collapse
                  key={_module.id}
                  collapsible="icon"
                  items={[
                    {
                      key: _module.id,
                      label: (
                        <Space size="middle">
                          {/* <div onClick={() => console.log("module", _module)}>
                        <Checkbox />
                      </div> */}
                          <div>{_module.title}</div>
                        </Space>
                      ),
                      children: <AppPermissions module={_module} />,
                      extra: (
                        <Popconfirm
                          title="Remove App"
                          description="Are you sure to remove this App?"
                          onConfirm={(e) => handleRemoveApp(e, _module)}
                          // onCancel={cancel}
                          okText="Yes"
                          okButtonProps={{
                            style: {
                              backgroundColor: "dodgerblue",
                            },
                          }}
                          cancelText="No"
                        >
                          <Button
                            size="small"
                            type="primary"
                            ghost
                            style={{
                              color: "gray",
                              borderColor: "gray",
                            }}
                            // disabled={!selectedRole}
                            // onClick={() => dispatch(setDeleteModalVisible(true))}
                            icon={<Delete />}
                          ></Button>
                        </Popconfirm>
                      ),
                    },
                  ]}
                />
              ))}
            </Space>
          </div>
        </Spin>
        <Fab
          color="secondary"
          aria-label="save"
          variant="extended"
          sx={{ position: "fixed", bottom: 55, right: 30 }}
          disabled={!selectedRole || updatingPermissions}
          // onClick={handleSavePermissions}
          type="submit"
          style={{
            width: 90,
          }}
        >
          {updatingPermissions ? (
            <CircularProgress
              variant="indeterminate"
              disableShrink
              sx={{
                color: "#fff",
                animationDuration: "550ms",
              }}
              size={18}
              thickness={6}
            />
          ) : (
            <>
              <Save
                style={{
                  marginRight: 5,
                }}
              />
              <span>Save</span>
            </>
          )}
        </Fab>
      </Form>
    </>
  );
};
export default ModulesAndPermissions;
