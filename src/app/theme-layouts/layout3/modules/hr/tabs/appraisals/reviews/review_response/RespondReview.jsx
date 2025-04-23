import { Email, Phone } from "@mui/icons-material";
import {
  Button,
  Card,
  Space,
  Row,
  Col,
  Typography,
  Descriptions,
  Tabs,
  Spin,
} from "antd";
import { ChevronLeft, IdCard, Edit, RefreshCcw, Check } from "lucide-react";
import React, { useEffect } from "react";
import ReviewProcess from "./ReviewProcess";
import RespondReviewModal from "./RespondReviewModal";
import Questionnaire from "./Questionnaire";
import Goals from "./Goals";
import {
  selectReviewDetails,
  selectSelectedPerformanceReview,
  setRespondReviewVisible,
  setReviewDetails,
  setReviewFormModalVisible,
} from "../../../../store/hrSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { useLazyQuery } from "@apollo/client";
import { LOAD_PERFORMANCE_REVIEW_DETAILS } from "../../../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const items = [
  {
    key: "1",
    label: "Review Type",
    children: "Administrator",
  },
  {
    key: "2",
    label: "Period",
    children: "2024-Q1",
  },
  {
    key: "3",
    label: "Review Status",
    children: "Pending",
  },
  {
    key: "4",
    label: "Reviewer",
    children: "MR. KALEMA STEVEN",
  },
];

function RespondReview() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const selectedPerformanceReview = useSelector(
    selectSelectedPerformanceReview
  );
  const reviewDetails = useSelector(selectReviewDetails);
  const [loadPerformanceReviewDetails, { error, loading, data, refetch }] =
    useLazyQuery(LOAD_PERFORMANCE_REVIEW_DETAILS, {
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

  const loadDetails = async () => {
    const res = await loadPerformanceReviewDetails({
      variables: {
        performanceReviewId: selectedPerformanceReview?.id,
      },
    });

    dispatch(setReviewDetails(res.data.performance_review));
  };

  useEffect(() => {
    if (selectedPerformanceReview) {
      loadDetails();
    }
  }, [selectedPerformanceReview]);

  // console.log("user", user);
  // console.log("performance review", reviewDetails);
  return (
    <div
      style={{
        padding: 15,
        // backgroundColor: "green",
        height: "calc(100vh - 100px)",
        overflow: "scroll",
      }}
    >
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <div
                style={{
                  padding: 10,
                }}
              >
                <span
                  style={{
                    fontSize: "2.0rem",
                  }}
                >
                  Performance Review
                </span>
              </div>
            </>
          }
          extra={
            <>
              <Space
                style={{
                  marginTop: 5,
                }}
              >
                <Button
                  type="primary"
                  ghost
                  size="small"
                  icon={<ChevronLeft size={19} />}
                  onClick={() => dispatch(setRespondReviewVisible(false))}
                >
                  Back to reviews
                </Button>
                {user.user_id == selectedPerformanceReview?.employee_id && (
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<Edit size={19} />}
                    onClick={() => dispatch(setReviewFormModalVisible(true))}
                  >
                    Edit Review
                  </Button>
                )}
                <Button
                  type="primary"
                  ghost
                  size="small"
                  icon={<RefreshCcw size={19} />}
                  onClick={() => refetch()}
                >
                  Reload
                </Button>
                <Button
                  type="primary"
                  ghost
                  size="small"
                  // style={{
                  //   // backgroundColor: "green",
                  //   color: "green",
                  //   borderColor: "green",
                  // }}
                  icon={<Check size={19} />}
                >
                  Mark as Completed
                </Button>
              </Space>
            </>
          }
        >
          <div
            style={{
              padding: 20,
            }}
          >
            <Row>
              <Col span={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: "lightgray",
                      marginRight: 10,
                    }}
                  >
                    <img
                      src={`http://localhost:2222/api/student_image/${reviewDetails?.employee?.staff_id}`}
                      // src={`https://tredumo.nkumbauniversity.ac.ug:2222/api/student_image/${studentFile?.student_no}`}
                      // src={`http://199.241.139.118:9000/api/lecturer/image/NUA213`}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                      }}
                    />
                  </div>

                  <div>
                    <Typography.Title level={4}>
                      {selectedPerformanceReview?.employee_name}
                    </Typography.Title>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <Email
                        style={{
                          marginRight: 10,
                          color: "dodgerblue",
                        }}
                      />
                      <Typography.Text>
                        {reviewDetails?.employee?.email}
                      </Typography.Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <Phone
                        style={{
                          marginRight: 10,
                          color: "dodgerblue",
                        }}
                      />
                      <Typography.Text>
                        {reviewDetails?.employee?.telno}
                      </Typography.Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <IdCard
                        style={{
                          marginRight: 10,
                          color: "dodgerblue",
                        }}
                      />
                      <Typography.Text>NUA234</Typography.Text>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={14}>
                <Descriptions
                  bordered
                  column={2}
                  // title="Custom Size"
                  // size={size}
                  // extra={<Button type="primary">Edit</Button>}
                  items={[
                    {
                      key: "1",
                      label: "Review Type",
                      children: selectedPerformanceReview?.template_name,
                    },
                    {
                      key: "2",
                      label: "Period",
                      children: selectedPerformanceReview?.review_period,
                    },
                    {
                      key: "3",
                      label: "Review Status",
                      children:
                        selectedPerformanceReview?.status?.toUpperCase(),
                    },
                    {
                      key: "4",
                      label: "Reviewer",
                      children: reviewDetails?.employee_approvers.find(
                        (e) => e.approver_type == "manager"
                      )
                        ? reviewDetails?.employee_approvers.find(
                            (e) => e.approver_type == "manager"
                          ).name
                        : selectedPerformanceReview?.added_by_name,
                    },
                  ]}
                />
              </Col>
            </Row>
          </div>
        </Card>
        <div
          style={{
            marginTop: 5,
          }}
        >
          {/* <ReviewProcess /> */}
          <Tabs
            defaultActiveKey="pending"
            items={[
              {
                key: "questionnaire",
                label: "Questionnaire",
                children: <Questionnaire />,
              },
              {
                key: "goals",
                label: "Goals",
                children: <Goals />,
              },
              {
                key: "objectives",
                label: "Objectives",
                // children: <ReviewForm />,
              },
              {
                key: "history",
                label: "Summary",
                // children: <ReviewHistory />,
              },
            ]}
          />
        </div>
      </Spin>
      <RespondReviewModal />
    </div>
  );
}

export default RespondReview;
