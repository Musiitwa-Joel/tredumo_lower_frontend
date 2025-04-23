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
import { GET_FEES_ITEMS } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFeesCategories,
  selectFeesItems,
  selectFeesStructure,
  selectFilteredFeesItems,
  selectLoadingFeesStructure,
  setFeesItems,
  setFilteredFeesItems,
  setSelectedFeeItemRow,
} from "../../store/feesMgtSlice";
import { DELETE_FEES_ITEM } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { Box } from "@mui/material";

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
  const feesItems = useSelector(selectFeesItems);
  const feesCategories = useSelector(selectFeesCategories);
  const filteredFeesItems = useSelector(selectFilteredFeesItems);
  const feesStructure = useSelector(selectFeesStructure);
  const loadingFeesStructure = useSelector(selectLoadingFeesStructure);
  const {
    error,
    loading,
    data: itemRes,
  } = useQuery(GET_FEES_ITEMS, {
    notifyOnNetworkStatusChange: true,
  });

  // console.log("fees structure", feesStructure);
  // console.log("loading fees structure", loadingFeesStructure);

  const [
    deleteFeesItem,
    { error: deleteErr, loading: deletingItem, data: deleteRes },
  ] = useMutation(DELETE_FEES_ITEM, {
    refetchQueries: ["getFeesItems"],
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
    if (itemRes) {
      // console.log("items", itemRes);
      dispatch(setFeesItems(itemRes.fees_items));
      dispatch(setFilteredFeesItems(itemRes.fees_items));
    }
  }, [itemRes]);

  const expandedRowRender = (row) => {
    // console.log("details", row);

    // const columns2 = [
    //   {
    //     title: "#",
    //     dataIndex: "index",
    //     key: "date",
    //     render: (text, record, index) => index + 1,
    //     width: 50,
    //   },
    //   {
    //     title: "Item Code",
    //     dataIndex: "item_code",
    //     width: 100,
    //     key: "item_name",
    //   },
    //   {
    //     title: "Item Name",
    //     dataIndex: "item_name",
    //     key: "item_name",
    //     width: 200,
    //     ellipsis: true,
    //   },
    //   {
    //     title: "Description",
    //     dataIndex: "item_description",
    //     key: "item_description",
    //     ellipsis: true,
    //     width: 150,
    //   },
    //   {
    //     title: "Category",
    //     key: "category",
    //     dataIndex: "category",
    //     render: (text, record, index) => record.category.category_name,
    //   },
    //   {
    //     title: "Fee Type",
    //     dataIndex: "fee_type",
    //     key: "fee_type",
    //     render: (text, record, index) =>
    //       record.mandatory ? "MANDATORY" : "OPTIONAL",
    //   },

    //   {
    //     title: "Action",
    //     key: "operation",
    //     render: (text, record, index) => (
    //       <Space size="middle">
    //         <Button
    //           size="small"
    //           type="primary"
    //           ghost
    //           onClick={() => handleRowClick(record)}
    //           icon={<Edit />}
    //         />
    //         <Popconfirm
    //           title="Delete Fees Item"
    //           description="Are you sure to delete this item?"
    //           onConfirm={(e) => confirm(e, record)}
    //           // onCancel={cancel}
    //           okText="Yes"
    //           okButtonProps={{
    //             style: {
    //               backgroundColor: "dodgerblue",
    //             },
    //           }}
    //           cancelText="No"
    //         >
    //           <Button
    //             size="small"
    //             danger
    //             // onClick={() => handleRowDelete(record)}
    //             icon={<Delete color="red" />}
    //           />
    //         </Popconfirm>
    //       </Space>
    //     ),
    //   },
    // ];

    const cols = [
      {
        title: "#",
        dataIndex: "name",
        key: "name",
        width: "5%",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Item Code",
        dataIndex: "item_code",
        key: "item_code",
        width: "15%",
      },
      {
        title: "Item Name",
        dataIndex: "item_name",
        key: "item_name",
        width: "25%",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: "15%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
      },
      {
        title: "Paid When",
        dataIndex: "frequency_code",
        key: "frequency_code",
        width: "20%",
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        width: "15%",
        render: (text, record, index) => record.category.category_name,
      },
    ];

    const confirm = (e, row) => {
      // console.log("the row", row);
      handleRowDelete(row);
    };

    const handleRowDelete = async (row) => {
      const payload = {
        feesItemId: row.id,
      };

      // console.log("delete", payload);

      const res = await deleteFeesItem({
        variables: payload,
      });

      dispatch(
        showMessage({
          message: res.data.deleteFeesItem.message,
          variant: "success",
        })
      );
    };

    const handleRowClick = (row) => {
      // console.log(row);
      dispatch(setSelectedFeeItemRow(row));
    };

    const data = [
      {
        key: "1",
        name: "TUITION",
        category: "TUTION",
        fee_type: "MANDATORY",
        is_variable: true,
      },
      {
        key: "2",
        name: "GUILD FEE",
        category: "FUNCTIONAL",
        amount: "5000",
        fee_type: "MANDATORY",
        is_variable: false,
      },
      {
        key: "3",
        name: "ANNUAL REPORT",
        category: "OTHER FEES",
        amount: "5000",
        fee_type: "OPTIONAL",
        is_variable: false,
      },
      {
        key: "4",
        name: "GUILD FEE",
        category: "FUNCTIONAL",
        amount: "5000",
        fee_type: "MANDATORY",
        is_variable: false,
      },
      {
        key: "5",
        name: "ANNUAL REPORT",
        category: "OTHER FEES",
        amount: "5000",
        fee_type: "OPTIONAL",
        is_variable: false,
      },
    ];

    const items = feesStructure.filter(
      (item) => `${item.study_yr}${item.semester}` == row.key
    );

    // console.log("data2", items);

    return (
      <Table
        columns={cols}
        dataSource={items}
        pagination={false}
        size="small"
        footer={
          items.length > 0
            ? () => {
                const totalAmount = items.reduce((accumulator, fee) => {
                  return accumulator + parseFloat(fee.amount);
                }, 0);
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      fontWeight: "bold",
                      color: "dodgerblue",
                    }}
                  >
                    Total: UGX {parseInt(totalAmount).toLocaleString()}
                  </div>
                );
              }
            : null
        }
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
            color: "maroon",
            fontWeight: "500",
          }}
        >
          Study Year: <span>{record.study_yr}</span>, Semester:{" "}
          <span>{record.semester}</span>
        </span>
      ),
    },
  ];

  const data = [
    ...new Set(feesStructure.map((fee) => `${fee.study_yr}-${fee.semester}`)),
  ].map((item) => {
    const [study_yr, semester] = item.split("-");
    return { key: `${study_yr}${semester}`, study_yr, semester };
  });

  // const data = [
  //   {
  //     key: "2",
  //     name: (
  //       <span
  //         style={{
  //           color: "maroon",
  //         }}
  //       >
  //         {"Category: FUNCTIONAL"}
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
  //         {"Category: Tuition"}
  //       </span>
  //     ),
  //   },
  // ];

  const onSearch = (value) => {
    console.log("search:", value);
    if (value == "") dispatch(setFilteredFeesItems(feesItems));

    const filtered = searchFeesItemsByTerm(feesItems, value);

    console.log(filtered);

    dispatch(setFilteredFeesItems(filtered));
  };

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
              Fees Structure Preview
            </span>
          </div>

          <div>
            <Space>
              {/* <Tooltip title="Distribute">
                <Button type="primary" danger>
                  Distribute In Semesters
                </Button>
              </Tooltip> */}
              <Search
                placeholder="Search Fee..."
                // onSearch={onSearch}
                onChange={(e) => onSearch(e.target.value)}
                size="middle"
                width={500}
                style={{
                  width: 250,
                }}
              />

              <Tooltip title="Print Fee Structure">
                <Button>Print</Button>
              </Tooltip>

              <Tooltip title="Download Fees Items">
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
            loading={loadingFeesStructure}
            size="small"
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: [
                ...feesStructure.map(
                  (structure) => `${structure.study_yr}${structure.semester}`
                ),
              ],
              // expandedRowKeys: [
              //   ...feesStructure.map(
              //     (structure) => `${structure.study_yr}${structure.semester}`
              //   ),
              // ],
            }}
            footer={
              feesStructure.length > 0
                ? () => {
                    const totalAmount = feesStructure.reduce(
                      (accumulator, fee) => {
                        return accumulator + parseFloat(fee.amount);
                      },
                      0
                    );
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          fontWeight: "bold",
                          color: "maroon",
                        }}
                      >
                        Total: UGX {parseInt(totalAmount).toLocaleString()}
                      </div>
                    );
                  }
                : null
            }
            dataSource={data}
            scroll={{
              y: "calc(100vh - 250px)",
            }}
          />
        </ConfigProvider>

        {/* <ConfigProvider
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
            showHeader={true}
            loading={loadingFeesStructure}
            size="small"
            columns={cols}
            dataSource={feesStructure}
            scroll={{
              y: "calc(100vh - 190px)",
            }}
          />
        </ConfigProvider> */}
      </div>
    </>
  );
};
export default DataTable;
