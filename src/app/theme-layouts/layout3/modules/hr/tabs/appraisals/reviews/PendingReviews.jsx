import {
  AddCircle,
  Close,
  Delete,
  Edit,
  ViewAgenda,
  ViewCompact,
} from "@mui/icons-material";
import {
  Card,
  Table,
  Button,
  Tooltip,
  Space,
  Popconfirm,
  Input,
  Tag,
} from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReviews,
  selectViewEmployeeDetails,
  setAddReviewModalVisible,
  setRespondReviewVisible,
  setReviews,
  setSelectedPerformanceReview,
  setViewEmployeeDetails,
} from "../../../store/hrSlice";
import AddReviewModal from "../appraisal_templates/AddReviewModal";
import { useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "../../../../prog_and_courses/utilities/convertTimestampToDate";
import PerformanceReviewDetails from "../../employee_details/PerformanceReviewDetails";
import { LOAD_PERFORMANCE_REVIEWS } from "../../../gql/queries";

const { Search } = Input;

const data = [
  {
    key: "1",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "2",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
  {
    key: "3",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "4",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
  {
    key: "5",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "6",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
  {
    key: "7",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "8",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
];

function PendingReviews() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const employeeDetailsVisible = useSelector(selectViewEmployeeDetails);
  const {
    error,
    loading,
    data: reviewsRes,
  } = useQuery(LOAD_PERFORMANCE_REVIEWS, {
    notifyOnNetworkStatusChange: true,
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
  }, [error]);

  if (reviewsRes) {
    dispatch(setReviews(reviewsRes.performance_reviews));
  }

  const handleDetails = (record) => {
    //   console.log("record", record);
    dispatch(setRespondReviewVisible(true));
    dispatch(setSelectedPerformanceReview(record));
    // dispatch(setTemplatePreviewVisible(true));
  };
  const columns = [
    {
      title: "Employee",
      dataIndex: "employee_name",
      width: "16%",
      ellipsis: true,
      sorter: (a, b) => a.employee_name.length - b.employee_name.length,
      // sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "warning" : "processing"}>
          {status.toUpperCase()}
        </Tag>
      ),
      width: "8%",
      ellipsis: true,
    },
    {
      title: "Review Period",
      dataIndex: "review_period",
      //   render: (text) => convertTimestampToDate(parseInt(text)),
      width: "10%",
      ellipsis: true,
      sorter: (a, b) => a.review_period.length - b.review_period.length,
    },
    {
      title: "Review Type",
      dataIndex: "template_name",
      render: (type) => (
        <Tag
          color={
            type === "Administrative"
              ? "blue"
              : type === "Academic"
                ? "green"
                : "orange"
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "Actions",
      dataIndex: "action",
      width: "20%",
      render: (text, record) => (
        <div>
          <Space size="middle">
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => handleRowClick(record)}
              icon={<Edit />}
            >
              Edit
            </Button>

            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => handleDetails(record)}
              icon={<ViewCompact />}
            >
              View
            </Button>
            <Popconfirm
              title="Delete User"
              description=<>
                Are you sure to delete this user?
                <br />
                This action can not be undone
              </>
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
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  //   console.log("reviews", reviews);

  return (
    <>
      <div
        style={{
          height: "calc(100vh - 215px)",
          // backgroundColor: "#dfe5ef",
          // padding: 15,
        }}
      >
        <Card
          style={{
            padding: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            {/* <Button
                type="primary"
                icon={<AddCircle />}
                onClick={() => dispatch(setAddReviewModalVisible(true))}
              >
                Add New
              </Button> */}

            <div>
              <Search
                style={{ marginBottom: 0, borderColor: "black" }}
                // loading={loading}
                placeholder="Search..."
                variant="outlined"
                // loading={loadingStudentFile}

                enterKeyHint="search"
                // width={100}

                size="middle"
                //   onChange={onSearchChange}
              />
            </div>
          </div>
          <Table
            size="small"
            loading={loading}
            columns={columns}
            dataSource={reviews}
            rowKey={"id"}
            pagination={{
              size: "small",
              //   total: data.length,
              showTotal: (total) => `Displaying ${total} pending reviews`,
            }}
            scroll={{
              y: 400,
            }}
          />
        </Card>
        <AddReviewModal />
      </div>
    </>
  );
}

export default PendingReviews;
