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
import { useDispatch, useSelector } from "react-redux";
import { OpenInNew } from "@mui/icons-material";
import {
  selectRegistrationReport,
  selectRegReportInput,
  setActiveTab,
  setStudentNo,
} from "../../../store/registrationSlice";
import { useQuery } from "@apollo/client";
import { GET_STUDENTS } from "app/theme-layouts/layout3/modules/student_info_center/gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { LOAD_REG_STUDENTS } from "../../../gql/queries";

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

const StudentsTable = React.memo(() => {
  const dispatch = useDispatch();
  const regReportinput = useSelector(selectRegReportInput);
  const regReport = useSelector(selectRegistrationReport);

  //   console.log("registration report", regReport?.totals);

  const {
    error,
    loading,
    data: studentsResponse,
  } = useQuery(LOAD_REG_STUDENTS, {
    variables: {
      payload: {
        acc_yr_id: regReportinput.acc_yr_id,
        campus_id: regReportinput.campus_id,
        college_id: regReportinput.college_id,
        course_id: regReportinput?.course_id,
        intake_id: regReportinput?.intake_id,
        school_id: regReportinput?.school_id,
        semester: parseInt(regReportinput?.sem),
        study_time_id: regReportinput?.study_time_id,
      },
    },
  });

  //   console.log("response", studentsResponse);

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

  const expandedRowRender = (row) => {
    // console.log("details", row);

    const columns2 = [
      {
        title: "#",
        dataIndex: "index",
        key: "date",
        render: (text, record, index) => index + 1,
        width: 45,
        // fixed: "left",
      },
      {
        title: "Name",
        key: "name",
        dataIndex: "name",
        render: (text, record, index) =>
          `${record.surname} ${record.other_names}`,
        width: 250,
        fixed: "left",
      },
      {
        title: "Student No",
        dataIndex: "student_no",
        width: 130,
        key: "student_no",
      },

      {
        title: "Registration No",
        dataIndex: "registration_no",
        key: "registration_no",
        width: 150,
        ellipsis: true,
      },
      {
        title: "Course Code",
        dataIndex: "course_code",
        key: "course_code",
        width: 120,
        ellipsis: true,
      },
      {
        title: "Course Title",
        dataIndex: "course_title",
        key: "course_title",
        width: 250,
        ellipsis: true,
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        ellipsis: true,
        width: 80,
      },
      {
        title: "Entry Acc Yr",
        key: "entry_acc_yr",
        dataIndex: "entry_acc_yr",
        width: 120,
      },
      {
        title: "Nationality",
        key: "nationality",
        dataIndex: "nationality",
        ellipsis: true,
        width: 120,
      },
      {
        title: "Acc Yr",
        key: "acc_yr",
        dataIndex: "acc_yr",
        width: 100,
      },
      {
        title: "Study Yr",
        key: "study_yr",
        dataIndex: "study_yr",
        width: 80,
      },
      {
        title: "Sem",
        key: "sem",
        dataIndex: "sem",
        width: 50,
      },

      {
        title: "Action",
        key: "operation",
        render: (text, record, index) => (
          <Space size="middle">
            <Tooltip title="Click to view student File">
              <Button
                size="small"
                type="primary"
                ghost
                onClick={() => handleRowClick(record)}
                icon={<OpenInNew />}
              />
            </Tooltip>
          </Space>
        ),
        width: 70,
        fixed: "right",
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

      //   const res = await deleteFeesItem({
      //     variables: payload,
      //   });

      //   dispatch(
      //     showMessage({
      //       message: res.data.deleteFeesItem.message,
      //       variant: "success",
      //     })
      //   );
    };

    const handleRowClick = async (row) => {
      console.log(row);
      // lets navigate to the the register screen
      dispatch(setActiveTab(0));

      // dynamically set the stdno and run
      dispatch(setStudentNo(row?.student_no));

      // load the student
    };

    // const data = [
    //   {
    //     key: "1",
    //     name: "AKAMPEREZA DARLINGTON",
    //     category: "TUTION",
    //     fee_type: "MANDATORY",
    //     is_variable: true,
    //   },
    //   {
    //     key: "2",
    //     name: "MUSIITWA JOEL",
    //     category: "FUNCTIONAL",
    //     amount: "5000",
    //     fee_type: "MANDATORY",
    //     is_variable: false,
    //   },
    //   {
    //     key: "3",
    //     name: "LUBEGA JUDE",
    //     category: "OTHER FEES",
    //     amount: "5000",
    //     fee_type: "OPTIONAL",
    //     is_variable: false,
    //   },
    //   {
    //     key: "4",
    //     name: "MUGENYI RICHARD",
    //     category: "FUNCTIONAL",
    //     amount: "5000",
    //     fee_type: "MANDATORY",
    //     is_variable: false,
    //   },
    //   {
    //     key: "5",
    //     name: "LUBEGA TASHAH",
    //     category: "OTHER FEES",
    //     amount: "5000",
    //     fee_type: "OPTIONAL",
    //     is_variable: false,
    //   },
    // ];

    let _data = [];

    if (row.key == "provisional") {
      _data = studentsResponse?.get_students
        ? studentsResponse.get_students.filter((std) => std.provisional == 1)
        : [];
    } else if (row.key == "registered") {
      _data = studentsResponse?.get_students
        ? studentsResponse.get_students.filter(
            (std) => std.registration_token && !std.provisional
          )
        : [];
    } else {
      // enrolled
      _data = studentsResponse?.get_students
        ? studentsResponse.get_students.filter(
            (std) =>
              std.enrollment_token &&
              !std.registration_token &&
              !std.provisional
          )
        : [];
    }

    return <Table columns={columns2} dataSource={_data} pagination={false} />;
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
      //   width: ,
    },
  ];

  let data = [];

  if (regReport?.totals.total_enrolled > 0) {
    data.push({
      key: "enrolled",
      name: (
        <div>
          <span
            style={{
              color: "blue",
            }}
          >
            {"ENROLLED"}
          </span>
        </div>
      ),
    });
  }

  if (regReport?.totals.total_provisional > 0) {
    data.push({
      key: "provisional",
      name: (
        <span
          style={{
            color: "orange",
          }}
        >
          {"PROVISIONALLY REGISTERED"}
        </span>
      ),
    });
  }

  if (regReport?.totals.total_registered > 0) {
    data.push({
      key: "registered",
      name: (
        <span
          style={{
            color: "green",
          }}
        >
          {"REGISTERED"}
        </span>
      ),
    });
  }
  //   const data = [
  //     {
  //       key: "enrolled",
  //       name: (
  //         <div>
  //           <span
  //             style={{
  //               color: "blue",
  //             }}
  //           >
  //             {"ENROLLED"}
  //           </span>
  //         </div>
  //       ),
  //     },
  //     {
  //       key: "provisional",
  //       name: (
  //         <span
  //           style={{
  //             color: "orange",
  //           }}
  //         >
  //           {"PROVISIONALLY REGISTERED"}
  //         </span>
  //       ),
  //     },
  //     {
  //       key: "registered",
  //       name: (
  //         <span
  //           style={{
  //             color: "green",
  //           }}
  //         >
  //           {"REGISTERED"}
  //         </span>
  //       ),
  //     },
  //   ];

  //   const onSearch = (value) => {
  //     console.log("search:", value);
  //     // if (value == "") dispatch(setFilteredFeesItems(feesItems));

  //     // const filtered = searchFeesItemsByTerm(feesItems, value);

  //     // console.log(filtered);

  //     // dispatch(setFilteredFeesItems(filtered));
  //   };

  return (
    <>
      <div
        style={{
          padding: 0,
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
            // rowClassName={() => "custom-row-style"}
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: ["enrolled", "provisional", "registered"],
              //   expandedRowKeys: [...feesCategories.map((cat) => cat.id)],
            }}
            dataSource={data}
            pagination={false}
            scroll={{
              y: "calc(100vh - 270px)",
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
});
export default StudentsTable;
