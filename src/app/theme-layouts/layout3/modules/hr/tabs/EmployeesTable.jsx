import React, { useState } from "react";
import { Button, Divider, Radio, Space, Table } from "antd";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectEmployees, setViewEmployeeDetails } from "../store/hrSlice";

const EmployeesTable = ({ loading }) => {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);

  const columns = [
    {
      title: "",
      dataIndex: "",
      render: (text) => (
        <div>
          <img
            style={{
              width: 35,
              height: 35,
              borderRadius: 17.5,
              backgroundColor: "lightgray",
            }}
            src={`http://localhost:2222/api/student_image/0`}
          />
        </div>
      ),
      width: "3%",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record, index) => (
        <a
          style={{
            textDecoration: "none",
          }}
          onClick={() => dispatch(setViewEmployeeDetails(true))}
        >
          {`${record?.salutation} ${record?.surname} ${record?.other_names}`.toUpperCase()}
        </a>
      ),
      width: "16%",
      ellipsis: true,
    },
    {
      title: "Employee ID",
      dataIndex: "staff_id",
      width: "8%",
      ellipsis: true,
    },
    {
      title: "Desgination",
      dataIndex: "designation",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "12%",
      ellipsis: true,
    },
    {
      title: "Tel No",
      dataIndex: "telno",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "8%",
      render: (text) => (
        <div>
          <Button
            icon={
              <Close
                style={{
                  color: "gray",
                }}
              />
            }
          ></Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table
        size="small"
        loading={loading}
        columns={columns}
        dataSource={employees}
        rowKey={"id"}
        pagination={{
          size: "small",
          //   total: data.length,
          showTotal: (total) => `Displaying ${total} employees`,
        }}
        scroll={{
          y: 400,
        }}
      />
    </div>
  );
};
export default EmployeesTable;
