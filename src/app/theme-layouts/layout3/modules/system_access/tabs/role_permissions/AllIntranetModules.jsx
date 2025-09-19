import React, { useEffect, useState } from "react";
import { Modal, Button, Flex, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllIntranetModulesVisible,
  selectSelectedRole,
  setAllIntranetModulesVisible,
} from "../../store/systemAccessSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const LOAD_MODULES = gql`
  query Apps {
    apps {
      id
      title
      description
      route
      logo
    }
  }
`;

const UPDATE_ROLE_MODULES = gql`
  mutation UpdateRoleModules($payload: RoleModuleInput!) {
    updateRoleModules(payload: $payload) {
      success
      message
    }
  }
`;

const columns = [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
    width: 50,
  },
  {
    title: "Name",
    dataIndex: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    ellipsis: true,
  },
];

const AllIntranetModules = () => {
  const dispatch = useDispatch();
  const selectedRole = useSelector(selectSelectedRole);
  const modalOpen = useSelector(selectAllIntranetModulesVisible);
  const { loading: loadingModules, error, data } = useQuery(LOAD_MODULES);
  const [
    updateRoleModules,
    { error: updateErr, loading: updatingModules, data: updateRes },
  ] = useMutation(UPDATE_ROLE_MODULES, {
    refetchQueries: ["loadRoleModules"],
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
  }, [error, updateErr, dispatch]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleAddSelections = async () => {
    if (!selectedRole?.role_id) {
      dispatch(
        showMessage({
          message: "No role selected",
          variant: "error",
        })
      );
      return;
    }

    const payload = {
      role_id: selectedRole.role_id,
      module_ids: selectedRowKeys,
    };

    try {
      const res = await updateRoleModules({
        variables: { payload },
      });

      if (res.data?.updateRoleModules?.success) {
        dispatch(
          showMessage({
            message: res.data.updateRoleModules.message,
            variant: "success",
          })
        );
        dispatch(setAllIntranetModulesVisible(false));
        setSelectedRowKeys([]);
      }
    } catch (err) {
      dispatch(
        showMessage({
          message: "Failed to update role modules",
          variant: "error",
        })
      );
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Modal
      title="All Apps"
      style={{ top: 20 }}
      open={modalOpen}
      okText="Add Selected Apps"
      onOk={handleAddSelections}
      okButtonProps={{
        loading: updatingModules,
        disabled: updatingModules || !hasSelected,
      }}
      onCancel={() => dispatch(setAllIntranetModulesVisible(false))}
      width={800}
    >
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          {hasSelected ? `Selected ${selectedRowKeys.length} Apps` : null}
        </Flex>
        <Table
          rowSelection={rowSelection}
          loading={loadingModules}
          rowKey="id"
          pagination={false}
          size="small"
          columns={columns}
          dataSource={data?.apps || []}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
        />
      </Flex>
    </Modal>
  );
};

export default AllIntranetModules;
