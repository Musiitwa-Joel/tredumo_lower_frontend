import { Edit, Info, Refresh } from "@mui/icons-material";
import { Box } from "@mui/material";
import { borderBottom } from "@mui/system";
import { Space, Button, Tooltip, ConfigProvider, Table, Progress } from "antd";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStudentData,
  setPaymentModalVisible,
} from "../../../../store/registrationSlice";
import { useLazyQuery } from "@apollo/client";
import { LOAD_STUDENT_TRANSACTIONS } from "app/theme-layouts/layout3/modules/setup/gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";

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

function Transactions() {
  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const [transactions, setTransations] = useState([]);
  const [loadStudentTransactions, { error, loading, data: txnRes, refetch }] =
    useLazyQuery(LOAD_STUDENT_TRANSACTIONS, {
      notifyOnNetworkStatusChange: true,
    });
  const expandedRowRender = (row, record) => {
    // console.log("details", row, record);

    const columns2 = [
      {
        title: "#",
        dataIndex: "index",
        key: "date",
        render: (text, record, index) => index + 1,
        width: "5%",
      },
      {
        title: "Reference Token",
        dataIndex: "prt",
        width: "15%",
        key: "prt",
        ellipsis: true,
      },
      {
        title: "Bank",
        dataIndex: "bank_name",
        key: "bank_name",
        width: "16%",
        ellipsis: true,
      },
      {
        title: "Branch",
        dataIndex: "bank_branch",
        key: "bank_branch",
        ellipsis: true,

        // render: (text, record, index) => parseInt(text).toLocaleString(),
        width: "10%",
      },
      {
        title: "Date",
        key: "payment_date",
        dataIndex: "payment_date",
        width: "20%",
        ellipsis: true,
        render: (text, record, index) => formatDateString(parseInt(text)),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Amount",
        key: "amount",
        dataIndex: "amount",
        width: "10%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Unallocated",
        dataIndex: "unallocated",
        key: "unallocated",
        width: "10%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
      },
    ];

    const data = [
      {
        payment_ref: "2000101041-T676732673267",
        bank: "CENTENARY",
        branch: "KAWUKU",
        date: "THUR 10TH AUG, 2023 03:23pm",
        amount: "1003000",
        unallocated: "0",
        is_dp: 1,
      },
      {
        payment_ref: "2000101041-T676732673267",
        bank: "CENTENARY BANK",
        branch: "KAWUKU",
        date: "THUR 10TH AUG, 2023 03:23pm",
        amount: "1003000",
        unallocated: "0",
        is_dp: 0,
      },
    ];

    const newData = transactions.filter((txn) => row.is_dp == txn.is_dp);

    // console.log("txns", transactions);

    // console.log("data2", filteredFeesItems);

    return (
      <Table
        size="small"
        // bordered
        columns={columns2}
        dataSource={newData}
        pagination={false}
        rowHoverable
        // rowSelection={{
        //   type: "radio",
        // }}
      />
    );
  };

  const data = [
    {
      key: "2",
      name: (
        <span
          style={{
            color: "dodgerblue",
          }}
        >
          {"Live Transactions"}
        </span>
      ),
      is_dp: 0,
    },
    {
      key: "1",
      name: (
        <span
          style={{
            color: "dodgerblue",
          }}
        >
          {"Manually Posted Transactions"}
        </span>
      ),
      is_dp: 1,
    },
  ];

  const loadTransactions = async (stdno) => {
    const res = await loadStudentTransactions({
      variables: {
        studentNo: stdno,
      },
    });

    setTransations(res.data.student_transactions);
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
  }, [error]);

  useEffect(() => {
    if (studentFile) {
      loadTransactions(studentFile?.student_no);
    }
  }, [studentFile]);

  // console.log("txns", transactions);

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          borderBottom: "none",
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          // paddingLeft: 10,
          display: "flex",
          justifyContent: "space-between",
          // alignItems: "center",
          // paddingRight: 10,
          //   marginBottom: 8,
          // backgroundColor: "red",

          // height: 40,
        }}
      >
        <Button
          size="small"
          type="primary"
          ghost
          // type="primary"

          onClick={() => dispatch(setPaymentModalVisible(true))}
        >
          Generate PRT
        </Button>

        <Space>
          <Button
            size="small"
            onClick={async () =>
              refetch({
                variables: {
                  studentNo: studentFile?.student_no,
                },
              })
            }
            icon={
              <Refresh
                style={{
                  color: "gray",
                }}
              />
            }
          >
            Reload
          </Button>
        </Space>
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
          loading={loading}
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: true,
            //   defaultExpandedRowKeys: [...feesCategories.map((cat) => cat.id)],
            //   expandedRowKeys: [...feesCategories.map((cat) => cat.id)],
          }}
          dataSource={data}
          scroll={{
            y: "calc(100vh - 300px)",
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default Transactions;
