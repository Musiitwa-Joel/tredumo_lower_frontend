import React, { useRef, useEffect } from "react";
import { Table, ConfigProvider, Space, Button, Badge, Popconfirm } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { Delete, Edit } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FEES_VERSIONS } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectFeesVersions,
  setFeesVersions,
  setSelectedFeesVersionRow,
} from "../../store/feesMgtSlice";
import { DELETE_FEES_VERSION } from "../../gql/mutations";

const renderRow = (record, text) => {
  return <span>{text}</span>;
};

const rows = [
  {
    id: 1,
    version_title: "V1",
    description: "The very first version",
    is_current: false,
  },
  {
    id: 2,
    version_title: "V2017",
    description: "The very first version",
    is_current: false,
  },
  {
    id: 3,
    version_title: "V2018",
    description: "The very first version",
    is_current: true,
  },
];

const DataTable = () => {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const dispatch = useDispatch();
  const feesVersions = useSelector(selectFeesVersions);

  const { loading, error, data } = useQuery(GET_FEES_VERSIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    deleteFeesVersion,
    { error: deleteErr, loading: deletingVersion, data: deleteRes },
  ] = useMutation(DELETE_FEES_VERSION, {
    refetchQueries: ["getFeesVersions"],
  });

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      ellipsis: true,
      // render: (text, record, index) => (
      //   <span>{formatDateString(parseInt(text))}</span>
      // ),
      render: (text, record, index) => renderRow(record, index + 1),
      width: 20,
    },
    {
      title: "Version Title",
      ellipsis: true,
      dataIndex: "version_title",
      render: (text, record, index) => {
        if (index == 0) {
          return (
            <span>
              {text}{" "}
              <span
                style={{
                  color: "red",
                  borderColor: "red",
                  borderWidth: 1,
                  padding: 2,
                  borderRadius: 5,
                }}
              >
                current
              </span>
            </span>
          );
        } else {
          return text;
        }
      },
      width: 80,
    },
    {
      title: "Description",
      ellipsis: true,
      dataIndex: "version_description",
      render: (text, record, index) => renderRow(record, text),
      width: 140,
    },
    {
      title: "Action",
      ellipsis: true,
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            ghost
            onClick={() => handleRowClick(record)}
            icon={<Edit />}
          />
          <Popconfirm
            title="Delete Fees Version"
            description="Are you sure to delete this fees Version?"
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
      width: 50,
    },
  ];

  const confirm = (e, row) => {
    // console.log("the row", row);
    handleRowDelete(row);
  };

  const handleRowDelete = async (row) => {
    const payload = {
      versionId: row.id,
    };

    // console.log("delete", payload);

    const res = await deleteFeesVersion({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.deleteFeesVersion.message,
        variant: "success",
      })
    );
  };

  const handleRowClick = (row) => {
    // console.log(row);
    dispatch(setSelectedFeesVersionRow(row));
  };

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

  if (data) {
    // console.log("response", data);
    dispatch(setFeesVersions(data.fees_versions));
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []);
  return (
    <>
      <div
        style={{
          marginTop: 10,
          marginLeft: 10,
        }}
      >
        <span
          style={{
            // color: "dodgerblue",
            fontSize: "2rem",
            fontWeight: "500",
          }}
        >
          Fees Versions
        </span>
      </div>
      {/* <div
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: 360, // Adjust this height as needed
          // marginTop: 10,
          // backgroundColor: "red",
          padding: 20,
          overflow: "hidden", // Hide default scrollbars
        }}
      ></div> */}
      <div
        style={{
          padding: 10,
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Table: {
                // headerBg: "rgba(0, 0, 0, 0.04)",
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
                cellFontSize: 10,
                fontSize: 13,
                lineHeight: 0.8,
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={feesVersions}
            loading={loading || deletingVersion}
            rowKey="std_id"
            bordered
            sticky
            // rowSelection={rowSelection}
            // expandable={defaultExpandable}
            showHeader={true}
            tableLayout="fixed"
            size="small"
            pagination={{
              position: ["bottomRight"],
            }}
            scroll={{
              y: "calc(100vh - 200px)", // Set the same height as in the style to ensure content scrolls
              // x: "100vw",
            }}

            // scroll={{
            //   y: "calc(100vh - 370px)",
            //   x: "100vw",
            // }}
          />
        </ConfigProvider>
      </div>
    </>
  );
};

export default DataTable;
