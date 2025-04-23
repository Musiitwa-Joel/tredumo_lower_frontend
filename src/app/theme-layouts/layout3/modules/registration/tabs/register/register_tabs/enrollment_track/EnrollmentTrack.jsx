import React, { useRef, useEffect, useState } from "react";
import { ExclamationCircleOutlined, SmileOutlined } from "@ant-design/icons";
import {
  Timeline,
  Badge,
  Card,
  Button,
  Row,
  Col,
  Descriptions,
  Modal,
  ConfigProvider,
  Space,
  Tooltip,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHideIncinsistences,
  selectStudentData,
  setAddEnrollmentModelVisible,
  setDeletingEnrollment,
  setHideInconsistences,
  setSelectedEnrollment,
  setEditEnrollmentVisible,
  setModulesEnrollmentModalOpen,
} from "../../../../store/registrationSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import {
  Delete,
  Edit,
  RemoveRedEye,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import "../styles.css";
import AddPastEnrollmentModel from "./AddPastEnrollmentModel";
import { useMutation } from "@apollo/client";
import {
  ACTIVATE_SEMESTER,
  DELETE_ENROLLMENT,
} from "../../../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import EditEnrollmentModel from "./EditEnrollmentModel";

const EnrollmentTrack = () => {
  const [modal, contextHolder] = Modal.useModal();
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const studentFile = useSelector(selectStudentData);

  const arr = studentFile?.enrollment_history.filter(
    (enrollment) => enrollment.enrollment_status.id != "6"
  );

  const hideInconsistences = useSelector(selectHideIncinsistences);
  const [enrollmentHist, setEnrollmentHist] = useState(
    hideInconsistences ? arr : studentFile?.enrollment_history
  );
  const dispatch = useDispatch();
  const [deleteEnrollment, { error: deleteErr, loading }] = useMutation(
    DELETE_ENROLLMENT,
    {
      refetchQueries: ["loadStudentFile"],
    }
  );

  const [activateSem, { error: activateErr, loading: activatingSem }] =
    useMutation(ACTIVATE_SEMESTER, {
      refetchQueries: ["loadStudentFile"],
    });

  useEffect(() => {
    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }

    if (activateErr) {
      dispatch(
        showMessage({
          message: activateErr.message,
          variant: "error",
        })
      );
    }
  }, [deleteErr, activateErr]);

  const handleDelete = (enrollment) => {
    modal.confirm({
      title: "Delete Enrollment",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this enrollment",
      okText: "Yes",
      cancelText: "No",
      onOk: () => onConfirmDelete(enrollment),
      style: {
        top: "30%",
      },
    });
  };

  const onConfirmDelete = async (enrollment) => {
    // console.log("delete", enrollment);
    const payload = {
      enrollmentId: enrollment.id,
    };

    const res = await deleteEnrollment({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.deleteEnrollment.message,
        variant: "success",
      })
    );
  };

  const handleActivate = async (enrollment) => {
    // console.log("enrollment", enrollment);
    if (!enrollment) return;

    const payload = {
      activateSemesterId: enrollment.id,
    };

    const res = await activateSem({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.activateSemester.message,
        variant: "success",
      })
    );
  };

  useEffect(() => {
    dispatch(setDeletingEnrollment(loading));
  }, [loading]);

  // console.log("student file", studentFile);
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
  }, [enrollmentHist, studentFile]);

  useEffect(() => {
    if (studentFile) {
      if (hideInconsistences) {
        const arr = studentFile?.enrollment_history.filter(
          (enrollment) => enrollment.enrollment_status.id != "6"
        );
        setEnrollmentHist(arr);
      } else {
        setEnrollmentHist(studentFile?.enrollment_history);
      }
    }
  }, [hideInconsistences, studentFile]);
  return (
    <>
      <div>
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <div>
            <Space>
              <Button
                disabled={!studentFile}
                onClick={() => dispatch(setAddEnrollmentModelVisible(true))}
              >
                Add Missed/Past Enrollment
              </Button>
              {/* <Button disabled={!studentFile}>Add Dead Year</Button> */}
            </Space>
          </div>

          <div>
            <Tooltip title={"Hide Inconsistencies"}>
              <Button
                type="primary"
                ghost
                icon={hideInconsistences ? <VisibilityOff /> : <Visibility />}
                disabled={!studentFile}
                onClick={() =>
                  dispatch(setHideInconsistences(!hideInconsistences))
                }
              ></Button>
            </Tooltip>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          style={{
            position: "relative",
            height: "calc(100vh - 260px)", // Adjust this height as needed
            // marginTop: 10,
            // backgroundColor: "red",
            padding: 20,
            overflow: "hidden", // Hide default scrollbars
          }}
        >
          {studentFile ? (
            <ConfigProvider
              theme={{
                components: {
                  Timeline: {
                    tailColor: "lightgray",
                  },
                  Card: {
                    headerBg: "#f4f4f4",
                    headerHeightSM: 38,
                  },
                },
              }}
            >
              <Timeline
                items={enrollmentHist?.map((enrollment) => ({
                  color:
                    enrollment.study_yr == "1" &&
                    enrollment.sem == "1" &&
                    enrollment.enrollment_status.id == "1"
                      ? "#00CCFF"
                      : enrollment.enrollment_status.color_code,
                  dot:
                    enrollment.study_yr == "1" && enrollment.sem == "1" ? (
                      <SmileOutlined />
                    ) : null,
                  children: (
                    <Badge.Ribbon
                      text={enrollment.enrollment_status.title}
                      color={
                        enrollment.study_yr == "1" &&
                        enrollment.sem == "1" &&
                        enrollment.enrollment_status.id == "1"
                          ? "#00CCFF"
                          : enrollment.enrollment_status.color_code
                      }
                    >
                      <Card
                        key={"enrollment"}
                        title={`Year ${enrollment.study_yr}, Semester ${enrollment.sem} (${enrollment.acc_yr_title})`}
                        size="small"
                        style={{
                          borderColor: "lightgray",
                          borderWidth: 1,
                          color: "red",
                        }}
                      >
                        {!enrollment.active && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black overlay
                              zIndex: 1,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                color: "white",
                                textAlign: "center",
                                fontSize: "1.5rem", // Scaled for smaller screens
                                fontWeight: "bold",
                              }}
                            >
                              <Button
                                onClick={() => handleActivate(enrollment)}
                                loading={activatingSem}
                                disabled={activatingSem}
                              >
                                Activate Enrollment
                              </Button>
                            </span>
                          </div>
                        )}
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12} md={12} lg={14} xl={16}>
                            {enrollment.enrollment_status.id === "6" && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black overlay
                                  zIndex: 1,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: "white",
                                    textAlign: "center",
                                    fontSize: "1.5rem", // Scaled for smaller screens
                                    fontWeight: "bold",
                                  }}
                                >
                                  DEAD SEMESTER - YEAR {enrollment.study_yr},
                                  SEMESTER {enrollment.sem}
                                </span>
                              </div>
                            )}
                            <Descriptions
                              className="custom-descriptions"
                              bordered
                              size="small"
                              items={[
                                {
                                  key: "1",
                                  label: "Enrolled By",
                                  children:
                                    enrollment.enrolled_by_type == "student"
                                      ? "SELF"
                                      : enrollment.enrolled_by,
                                  span: 2,
                                },
                                {
                                  key: "6",
                                  label: "Invoiced",
                                  children: enrollment.invoiced
                                    ? "TRUE"
                                    : "FALSE",
                                  span: 2,
                                },
                                {
                                  key: "3",
                                  label: "Enrollment Token",
                                  children: enrollment.enrollment_token,
                                  span: 2,
                                },
                                {
                                  key: "6",
                                  label: "Enrollment Date",
                                  children: formatDateString(
                                    parseInt(enrollment.datetime)
                                  ),
                                  span: 2,
                                },
                              ]}
                              style={{
                                borderColor: "lightgray",
                                borderWidth: 0.2,
                                borderRadius: 10,
                              }}
                              labelStyle={{
                                width: "40%",
                                backgroundColor: "#e7edfe",
                                color: "#0832b7",
                                fontWeight: "bold",
                              }}
                              contentStyle={{
                                borderBottomColor: "red",
                                textAlign: "left",
                              }}
                              column={2}
                            />
                          </Col>

                          <Col xs={24} sm={12} md={12} lg={10} xl={8}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8, // Space between buttons
                                marginTop: 2,
                                marginBottom: 10,
                              }}
                            >
                              {enrollment.enrollment_status.id !== "6" && (
                                <Button
                                  type="primary"
                                  ghost
                                  icon={<RemoveRedEye />}
                                  style={{ width: "100%" }}
                                  onClick={() => {
                                    dispatch(setSelectedEnrollment(enrollment));
                                    dispatch(
                                      setModulesEnrollmentModalOpen(true)
                                    );
                                  }}
                                >
                                  View Registered Modules
                                </Button>
                              )}
                              <Button
                                type="primary"
                                ghost
                                icon={<Edit />}
                                style={{ width: "100%" }}
                                onClick={() => {
                                  dispatch(setSelectedEnrollment(enrollment));
                                  dispatch(setEditEnrollmentVisible(true));
                                }}
                              >
                                Edit Enrollment
                              </Button>
                              <Button
                                danger
                                icon={<Delete />}
                                style={{ width: "100%" }}
                                onClick={() => handleDelete(enrollment)}
                              >
                                Delete Enrollment
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Badge.Ribbon>
                  ),
                }))}
              />
            </ConfigProvider>
          ) : null}
        </div>
        <AddPastEnrollmentModel />
        <EditEnrollmentModel />
        {contextHolder}
      </div>
    </>
  );
};

export default EnrollmentTrack;
