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
import { UPDATE_ROLE_MODULES } from "../../gql/mutations";

const columns = [
  {
    title: "#",
    dataIndex: "index",
    key: "date",
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

const LOAD_MODULES = gql`
  query loadAllApps {
    modules {
      id
      title
      description
    }
  }
`;
const dataSource = Array.from({
  length: 46,
}).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log("Selected Row Keys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);

    // Build the object array
    // const _selectedModules = data?.modules
    //   ?.filter((module) => newSelectedRowKeys.includes(module.id)) // Select only matching modules
    //   ?.map((module) => ({
    //     module_id: module.id,
    //     permissions: [], // Initialize with an empty permissions array
    //   }));

    // setSelectedModules(_selectedModules);

    // console.log("Generated Object Array: ", selectedModules);
  };

  const handleAddSelections = async () => {
    // update the role permissions
    const payload = {
      payload: {
        role_id: selectedRole?.role_id,
        module_ids: selectedRowKeys,
      },
    };

    // console.log("payload", payload);
    const res = await updateRoleModules({
      variables: payload,
    });

    if (res.data.updateRoleModules) {
      dispatch(
        showMessage({
          message: res.data.updateRoleModules.message,
          variant: "success",
        })
      );

      dispatch(setAllIntranetModulesVisible(false));
      setSelectedRowKeys([]);
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
      style={{
        top: 20,
      }}
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
          {/* <Button
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            Reload
          </Button> */}
          {hasSelected ? `Selected ${selectedRowKeys.length} Apps` : null}
        </Flex>
        <Table
          rowSelection={rowSelection}
          loading={loadingModules}
          rowKey={"id"}
          pagination={false}
          size="small"
          columns={columns}
          dataSource={data?.modules ? data.modules : []}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
        />
      </Flex>
    </Modal>
  );
};
export default AllIntranetModules;
