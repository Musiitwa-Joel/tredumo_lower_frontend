import React, { useEffect, useState } from "react";

import {
  Button,
  ConfigProvider,
  Popconfirm,
  Space,
  Table,
  Input,
  Tooltip,
} from "antd";
import {
  ChangeCircle,
  ChangeCircleSharp,
  ChangeHistory,
  Delete,
  Download,
  Edit,
  ManageAccounts,
  Refresh,
} from "@mui/icons-material";
// import { useMutation, useQuery } from "@apollo/client";

import { useDispatch, useSelector } from "react-redux";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { Box } from "@mui/material";

import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
// import { LOAD_USERS } from "../../gql/queries";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateString";
import {
  selectUsers,
  setSelectedUser,
  setUsers,
} from "../../store/systemAccessSlice";
import api from "app/configs/api";

const { Search } = Input;

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function searchFeesItemsByTerm(data, term) {
  const lowerTerm = term.toLowerCase();

  return data.filter((item) => {
    // Check top-level properties
    const topLevelMatch = Object.keys(item).some((key) => {
      if (typeof item[key] === "string" || typeof item[key] === "number") {
        return String(item[key]).toLowerCase().includes(lowerTerm);
      }
      return false;
    });

    // Check nested category properties
    const categoryMatch =
      item.category &&
      Object.keys(item.category).some((key) => {
        if (
          typeof item.category[key] === "string" ||
          typeof item.category[key] === "number"
        ) {
          return String(item.category[key]).toLowerCase().includes(lowerTerm);
        }
        return false;
      });

    return topLevelMatch || categoryMatch;
  });
}

const DataTable = React.memo(() => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const users = useSelector(selectUsers);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users");
      setLoading(false);
  
      dispatch(setUsers(response.data.result));

    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch(
        showMessage({
          message: error.response.data.message,
          variant: "error",
        })
      )
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSearch = (value) => {
    console.log("search:", value);
    // if (value == "") dispatch(setFilteredFeesItems(feesItems));

    // const filtered = searchFeesItemsByTerm(feesItems, value);

    // console.log(filtered);

    // dispatch(setFilteredFeesItems(filtered));
  };

  const handleDelete = async (e, row) => {
    setLoading(true);
    const res = await api.delete(`/api/users/${row.user.id}`);
    setLoading(false);
    dispatch(
      showMessage({
        message: res.data.message,
        variant: "success",
      })
    );
    loadUsers();
  }

  const columns2 = [
    {
      title: "#",
      dataIndex: "index",
      key: "date",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record, index) =>
        `${record.user.first_name} ${record.user.other_names}`,
      width: "25%",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record, index) => record.user.email,
      width: "25%",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Last Active",
      dataIndex: "last_active",
      key: "created_on",
      width: "30%",
      render: (text, record, index) =>
        record.lastLogin ? formatDateString(record.lastLogin.logged_in) : "_",
      ellipsis: true,
    },

    {
      title: "Action",
      key: "operation",
      render: (text, record, index) => (
        <Space size="middle">
          <Tooltip title={"Edit User Details"} placement="bottom">
            <Button
              size="small"
              type="primary"
              ghost
              // onClick={() => handleRowClick(record)}
              icon={<ManageAccounts />}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description=<>
              Are you sure to delete this user?
              <br />
              This action can not be undone
            </>
            onConfirm={(e) => handleDelete(e, record)}
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
              danger
              // onClick={() => handleRowDelete(record)}
              icon={<Delete color="red" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const confirm = (e, row) => {
    // console.log("the row", row);
    handleRowDelete(row);
  };

  // const handleRowDelete = async (row) => {
  //   const payload = {
  //     deleteDesignationId: row.id,
  //   };

  //   const res = await deleteDesignation({
  //     variables: payload,
  //   });

  //   dispatch(
  //     showMessage({
  //       message: res.data.deleteDesignation.message,
  //       variant: "success",
  //     })
  //   );
  // };

  const handleRowClick = (row) => {
    // console.log(row);
    dispatch(setSelectedUser(row));
  };

  const data = [
    {
      key: "1",
      name: "AKAMPEREZA DARLINGTON",
      role: "Admin",
      last_active: "2024-12-07, 09:30 AM",
    },
    {
      key: "2",
      name: "AKAMPEREZA DARLINGTON",
      role: "Admin",
      last_active: "2024-12-07, 09:30 AM",
    },
    {
      key: "3",
      name: "AKAMPEREZA DARLINGTON",
      role: "Admin",
      last_active: "2024-12-07, 09:30 AM",
    },
  ];

  return (
    <>
      <div
        style={{
          padding: 10,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            // borderColor: "lightgray",
            // borderWidth: 1,
            borderLeft: "1px solid lightgray",
            borderRight: "1px solid lightgray",
            borderTop: "1px solid lightgray",
            // marginBottom: 1,
          }}
          className="p-5"
          style={{
            paddingLeft: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10,
            marginBottom: 0,
            // backgroundColor: "red",

            // height: 40,
          }}
        >
          <div>
            <span
              variant="h6"
              color="inherit"
              component="div"
              style={{
                fontSize: "1.8rem",

                fontWeight: "500",
                // visibility: selectedTreeItem ? "visible" : "hidden",
              }}
            >
              Users
            </span>
          </div>

          <div>
            <Space>
              <Button icon={<Refresh />} onClick={() => refetch()}>
                Reload
              </Button>
              <Search
                placeholder="Search User..."
                // onSearch={onSearch}
                onChange={(e) => onSearch(e.target.value)}
                size="middle"
                width={500}
                style={{
                  width: 250,
                }}
              />
            </Space>
          </div>
        </Box>

        <ConfigProvider
          theme={{
            components: {
              Table: {
                // headerBg: "rgba(0, 0, 0, 0.04)",
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
                // cellFontSize: 10,
                // fontSize: 13,
                // lineHeight: 0.8,
              },
            },
          }}
        >
          <Table
            bordered
            size="small"
            columns={columns2}
            dataSource={users}
            loading={loading}
            pagination={false}
            scroll={{
              y: "calc(100vh - 190px)",
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
});
export default DataTable;
