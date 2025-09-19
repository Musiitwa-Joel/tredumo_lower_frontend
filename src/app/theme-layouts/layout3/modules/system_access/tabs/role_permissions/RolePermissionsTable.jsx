import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import _ from "lodash";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {
  AddHome,
  AddTwoTone,
  Delete,
  Edit,
  Refresh,
  Save,
} from "@mui/icons-material";
import Add from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { Button, Space, Typography as Typography2, Modal } from "antd";
import ModulesAndPermissions from "./ModulesAndPermissions";

import {
  selectDeleteModalVisible,
  selectSelectedRole,
  setAllIntranetModulesVisible,
  setDeleteModalVisible,
  setEditRoleModalVisible,
  setSelectedRole,
} from "../../store/systemAccessSlice";
import { useMutation } from "@apollo/client";
import { DELETE_ROLE } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { Text } = Typography2;

function RolePermissionsTable() {
  const selectedRole = useSelector(selectSelectedRole);
  const deleteModalVisible = useSelector(selectDeleteModalVisible);

  const dispatch = useDispatch();
  const [deleteRole, { error, loading }] = useMutation(DELETE_ROLE, {
    // Refetch the roles query by operation name used in RolesTable (`query All_roles`)
    refetchQueries: ["All_roles"],
    // Wait for refetch to finish before resolving the mutation promise
    awaitRefetchQueries: true,
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

  const handleDelete = async () => {
    try {
      const rawId = selectedRole?.id ?? selectedRole?.role_id;
      console.log(
        "Deleting role, selectedRole:",
        selectedRole,
        "rawId:",
        rawId
      );

      if (rawId === undefined || rawId === null) {
        console.error("No role id available for deletion");
        dispatch(
          showMessage({
            message: "No role selected to delete",
            variant: "error",
          })
        );
        return;
      }

      // If rawId is a boolean or the string 'true'/'false', that's unexpected.
      if (typeof rawId === "boolean" || rawId === "true" || rawId === "false") {
        console.error("Unexpected role id type/value for deletion:", rawId);
        dispatch(
          showMessage({
            message: `Invalid role id for delete: ${String(rawId)}`,
            variant: "error",
          })
        );
        return;
      }

      const roleId = String(rawId);
      console.log("Calling deleteRole with variables:", { roleId });

      const res = await deleteRole({
        variables: {
          roleId,
        },
      });

      // after deleting, remove the selected role from the store
      dispatch(setSelectedRole(null));
      dispatch(setDeleteModalVisible(false));
      return res;
    } catch (err) {
      console.error("Failed to delete role:", err);
      dispatch(
        showMessage({
          message: err.message || "Failed to delete role",
          variant: "error",
        })
      );
      throw err;
    }
  };
  return (
    <div className="p-16">
      <Card
        className={clsx("", "shadow")}
        sx={{
          backgroundColor: (theme) =>
            darken(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.01 : 0.1
            ),
        }}
      >
        <Box
          sx={{
            backgroundColor: "#1e293b",
          }}
          className="p-10"
          style={{
            paddingLeft: 15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 15,
          }}
        >
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            style={{
              //   opacity: 0.7,
              color: "white",
            }}
          >
            Modules and Permissions
            {selectedRole && `: ${selectedRole?.name}`}
          </Typography>

          <Space size="middle">
            <Button
              size="small"
              type="primary"
              ghost
              style={{
                color: "white",
                borderColor: "white",
              }}
              icon={<AddTwoTone />}
              disabled={!selectedRole}
              onClick={() => dispatch(setAllIntranetModulesVisible(true))}
            ></Button>

            <Button
              size="small"
              type="primary"
              ghost
              style={{
                color: "white",
                borderColor: "white",
              }}
              icon={<Edit />}
              disabled={!selectedRole}
              onClick={() => dispatch(setEditRoleModalVisible(true))}
            ></Button>

            <Button
              size="small"
              type="primary"
              ghost
              style={{
                color: "white",
                borderColor: "white",
              }}
              disabled={!selectedRole}
              onClick={() => dispatch(setDeleteModalVisible(true))}
              icon={<Delete />}
            ></Button>
          </Space>
        </Box>
        <div
          style={{
            // backgroundColor: "#fff",
            height: "calc(100vh - 180px)",
            padding: 10,
          }}
        >
          {selectedRole && (
            <>
              <div
                style={{
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  NB: Permissions in <strong>Red</strong> imply that the user
                  must have a supervisor to either approve or verify the action.
                </Text>
              </div>
              <ModulesAndPermissions />
            </>
          )}
        </div>
      </Card>

      <Modal
        title={
          <>
            <ExclamationCircleOutlined /> Delete Role
          </>
        }
        open={deleteModalVisible}
        onOk={async () => {
          try {
            await handleDelete();
          } catch (err) {
            // error already logged in handleDelete
          }
        }}
        onCancel={() => dispatch(setDeleteModalVisible(false))}
        maskClosable={false}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          loading,
          disabled: loading,
        }}
      >
        Are you sure you want to delete this role?
      </Modal>
    </div>
  );
}

export default RolePermissionsTable;
