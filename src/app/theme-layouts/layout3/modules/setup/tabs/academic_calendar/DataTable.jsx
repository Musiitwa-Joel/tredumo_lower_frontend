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
import { Delete, Download, Edit } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { SyncOutlined } from "@ant-design/icons";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { Box } from "@mui/material";
import { GET_ACADEMIC_SCHEDULES } from "../../gql/queries";
import {
  selectAccYrs,
  selectSelectedEvent,
  setSelectedEvent,
} from "../../store/setUpSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { DELETE_ACADEMIC_SCHEDULE } from "../../gql/mutations";

const { Search } = Input;

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];

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

const DataTable = () => {
  const dispatch = useDispatch();
  // Centralized state to store the selected row across all tables
  const [selectedRow, setSelectedRow] = useState(null); // Stores the key of the selected row
  const acc_yrs = useSelector(selectAccYrs);
  const [academicSchedules, setAcademicSchedule] = useState([]);
  const selectedEvent = useSelector(selectSelectedEvent);
  const [
    deleteAcademicSchedule,
    { error: deleteErr, loading: deletingSchedule, data: deleteRes },
  ] = useMutation(DELETE_ACADEMIC_SCHEDULE, {
    refetchQueries: ["getAcademicSchedules"],
  });

  // Function to handle row selection across all tables
  const onRowSelect = (selectedKeys, selectedRows, rowKey) => {
    // setSelectedRow({ rowKey, selectedKey: selectedKeys[0] }); // Store row key and selected key
    // console.log({
    //   rowKey,
    //   selectedKey: selectedKeys[0],
    //   selectedRow: selectedRows[0],
    // });
    dispatch(
      setSelectedEvent({
        rowKey,
        selectedKey: selectedKeys[0],
        selectedRow: selectedRows[0],
      })
    );
  };

  const {
    error,
    loading,
    data: accScheduleRes,
  } = useQuery(GET_ACADEMIC_SCHEDULES, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (accScheduleRes) {
      // console.log("response", accScheduleRes);
      setAcademicSchedule(accScheduleRes.academic_schedules);
    }
  }, [accScheduleRes]);

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

  const expandedRowRender = (row) => {
    const columns2 = [
      // {
      //   title: "#",
      //   dataIndex: "index",
      //   key: "index",
      //   render: (text, record, index) => index + 1,
      //   width: 50,
      // },
      {
        title: "Intake",
        dataIndex: "intake",
        // width: 100,
        key: "intake",
        render: (text, record, index) => record.intake.intake_title,
      },
      {
        title: "Semester",
        dataIndex: "semester",
        key: "semester",
        // width: 100,
        ellipsis: true,
      },
      {
        title: "Starts On",
        dataIndex: "start_date",
        key: "start_date",
        ellipsis: true,
        width: 150,
        render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      },
      {
        title: "Closes On",
        key: "end_date",
        dataIndex: "end_date",
        render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "Status",
        render: (text) => {
          if (text == "Running") {
            return (
              <span
                style={{
                  color: "green",
                  borderColor: "green",
                  borderWidth: 1,
                  padding: 2,
                  borderRadius: 5,
                  paddingRight: 5,
                  paddingLeft: 5,
                }}
              >
                <SyncOutlined spin /> {text}
              </span>
            );
          } else if (text == "Not Started") {
            return (
              <span
                style={{
                  color: "purple",
                  borderColor: "purple",
                  borderWidth: 1,
                  padding: 2,
                  borderRadius: 5,
                  paddingRight: 5,
                  paddingLeft: 5,
                }}
              >
                {text}
              </span>
            );
          } else {
          }
          return (
            <span
              style={{
                color: "red",
                borderColor: "red",
                borderWidth: 1,
                padding: 2,
                borderRadius: 5,
                paddingRight: 5,
                paddingLeft: 5,
              }}
            >
              {text}
            </span>
          );
        },
      },
    ];

    const items = academicSchedules.filter((item) => item.acc_yr.id == row.key);

    // console.log("items", items);

    return (
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys:
            selectedEvent?.rowKey === row.key
              ? [selectedEvent.selectedKey]
              : [], // Select row only if it's part of the current table
          onChange: (selectedKeys, selectedRows) =>
            onRowSelect(selectedKeys, selectedRows, row.key), // Handle row selection
        }}
        rowKey={"id"}
        columns={columns2}
        dataSource={items}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: "Row Name",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <span
          style={{
            // color: "dodgerblue",
            fontWeight: "500",
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  // const data = [
  //   {
  //     key: "2",
  //     name: (
  //       <span
  //         style={{
  //           color: "maroon",
  //         }}
  //       >
  //         {"Academic Year: 2023/2024"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "1",
  //     name: (
  //       <span
  //         style={{
  //           color: "maroon",
  //         }}
  //       >
  //         {"Academic Year: 2023/2024"}
  //       </span>
  //     ),
  //   },
  // ];

  const data =
    acc_yrs.length > 0
      ? acc_yrs
          .filter((acc_yr) => {
            const items = academicSchedules.filter(
              (item) => item.acc_yr.id == acc_yr.id
            );
            return items.length > 0; // Only keep categories with matching items
          })
          .map((acc_yr) => {
            return {
              key: acc_yr.id,
              name: (
                <span
                  style={{
                    color: "maroon",
                  }}
                >
                  {`Academic Year: ${acc_yr.acc_yr_title}`}
                </span>
              ),
            };
          })
      : [];

  const confirm = async () => {
    const res = await deleteAcademicSchedule({
      variables: {
        scheduleId: selectedEvent.selectedRow.id,
      },
    });

    dispatch(
      showMessage({
        message: res.data.deleteAdcademicSchedule.message,
        variant: "success",
      })
    );
  };

  // console.log("accademic years", academicSchedules);

  // const onSearch = (value) => {
  //   console.log("search:", value);
  //   if (value == "") dispatch(setFilteredFeesItems(feesItems));

  //   const filtered = searchFeesItemsByTerm(feesItems, value);

  //   console.log(filtered);

  //   dispatch(setFilteredFeesItems(filtered));
  // };

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
            marginBottom: 8,
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
              Events
            </span>
          </div>

          <div>
            <Space>
              {/* <Button
                size="small"
                type="primary"
                disabled={selectedEvent ? false : true}
                ghost
                onClick={() => handleRowClick(record)}
                icon={<Edit />}
              /> */}
              <Popconfirm
                title="Delete Event"
                description="Are you sure to delete?"
                onConfirm={(e) => confirm(e)}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  disabled={selectedEvent ? false : true}
                  danger
                  // onClick={() => handleRowDelete(record)}
                  icon={<Delete color="red" />}
                />
              </Popconfirm>

              <Tooltip title="Download Events">
                <Download
                  style={{
                    fontSize: 25,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
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
            showHeader={false}
            loading={loading || deletingSchedule}
            size="small"
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandAllRows: true,
            }}
            dataSource={data}
            scroll={{
              y: "calc(100vh - 190px)",
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
};
export default DataTable;
