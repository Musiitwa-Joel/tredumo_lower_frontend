import React, { useEffect } from "react";

import {
  Button,
  ConfigProvider,
  Popconfirm,
  Space,
  Table,
  Input,
  Tooltip,
} from "antd";
import { Delete, Download, Edit } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";

import { useDispatch, useSelector } from "react-redux";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { Box } from "@mui/material";
import { LOAD_DESIGNATIONS } from "../../gql/queries";
import {
  selectDesignations,
  setDesignations,
  setSelectedDesignation,
} from "../../store/hrSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { DELETE_DESIGNATION } from "../../gql/mutations";

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
  const {
    error,
    loading,
    data: desRes,
  } = useQuery(LOAD_DESIGNATIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    deleteDesignation,
    { error: deleteErr, loading: deletingDes, data: deleteRes },
  ] = useMutation(DELETE_DESIGNATION, {
    refetchQueries: ["loadDesignations"],
  });
  const designations = useSelector(selectDesignations);

  // console.log("fees categories", feesCategories);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [error, deleteErr]);

  useEffect(() => {
    if (desRes) dispatch(setDesignations(desRes.designations));
  }, [desRes]);

  const onSearch = (value) => {
    console.log("search:", value);
    // if (value == "") dispatch(setFilteredFeesItems(feesItems));

    // const filtered = searchFeesItemsByTerm(feesItems, value);

    // console.log(filtered);

    // dispatch(setFilteredFeesItems(filtered));
  };

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
      dataIndex: "designation_name",
      width: "50%",
      key: "name",
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      width: "30%",
      render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      ellipsis: true,
    },

    {
      title: "Action",
      key: "operation",
      render: (text, record, index) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            ghost
            onClick={() => handleRowClick(record)}
            icon={<Edit />}
          />
          <Popconfirm
            title="Delete Designation"
            description="Are you sure to delete this designation?"
            onConfirm={(e) => confirm(e, record)}
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

  const handleRowDelete = async (row) => {
    const payload = {
      deleteDesignationId: row.id,
    };

    const res = await deleteDesignation({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.deleteDesignation.message,
        variant: "success",
      })
    );
  };

  const handleRowClick = (row) => {
    // console.log(row);
    dispatch(setSelectedDesignation(row));
  };

  const data = [
    {
      key: "1",
      name: "TUITION",
      created_on: "2024-12-07",
    },
    {
      key: "2",
      name: "GUILD FEE",

      created_on: "2024-12-07",
    },
    {
      key: "3",
      name: "ANNUAL REPORT",

      created_on: "2024-12-07",
    },
    {
      key: "4",
      name: "GUILD FEE",

      created_on: "2024-12-07",
    },
    {
      key: "5",
      name: "ANNUAL REPORT",
      created_on: "2024-12-07",
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
            borderColor: "lightgray",
            borderWidth: 1,
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
                fontSize: "2rem",

                fontWeight: "500",
                // visibility: selectedTreeItem ? "visible" : "hidden",
              }}
            >
              Designations
            </span>
          </div>

          <div>
            <Space>
              <Search
                placeholder="Search Designation..."
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
            dataSource={designations}
            loading={loading || deletingDes}
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
