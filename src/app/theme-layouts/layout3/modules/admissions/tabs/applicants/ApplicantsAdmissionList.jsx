import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Flex,
  Modal,
  Progress,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectApplicantsAdmissionList,
  selectApplicantsAdmissionListModal,
  setApplicanntsAdmissionList,
  setApplicanntsAdmissionListModal,
} from "../../admissionsSlice";
import { Close, Thunderstorm } from "@mui/icons-material";

import { Space, Table, Tag } from "antd";
import { useMutation, useSubscription } from "@apollo/client";
import { ADMIT_STUDENTS } from "app/theme-layouts/layout3/graphql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { UPLOAD_PROGRESS_SUBSCRIPTION } from "../../graphql/subscriptions";

const ApplicantAdmissionList = () => {
  const [admitStudents, { error, loading }] = useMutation(ADMIT_STUDENTS, {
    refetchQueries: ["loadApplications"],
  });
  const { data } = useSubscription(UPLOAD_PROGRESS_SUBSCRIPTION);
  const dispatch = useDispatch();
  const open = useSelector(selectApplicantsAdmissionListModal);
  const applicantsAdmissionList = useSelector(selectApplicantsAdmissionList);
  const [percentage, setPercentage] = useState(0);

  const handleRemove = (record) => {
    console.log("record", record.application.id);
    const updatedList = applicantsAdmissionList.filter(
      (r) => r.application.id !== record.application.id
    );

    dispatch(setApplicanntsAdmissionList(updatedList));
  };

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      key: "name",
      render: (text, record, index) => index + 1,
      width: "5%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        `${record.application.applicant.surname} ${record.application.applicant.other_names}`,
      width: "30%",
    },
    {
      title: "Choice",
      dataIndex: "prog_choice",
      key: "prog_choice",
      render: (text, record) => record.courseDetails.choice_no,
      width: "8%",
    },
    {
      title: "Program Code",
      dataIndex: "course_code",
      key: "course_code",
      render: (text, record) => record.courseDetails.course.course_code,
    },
    {
      title: "Campus",
      dataIndex: "campus",
      key: "campus",
      render: (text, record) => record.campusDetails.campus_title,
    },
    {
      title: "Sudy Time",
      dataIndex: "study_time",
      key: "study_time",
      render: (text, record) => record.studyTimeDetails.study_time_title,
    },
    {
      title: "Entry Year",
      dataIndex: "entry_yr",
      key: "entry_yr",
      width: "10%",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            style={{
              textDecoration: "none",
              color: "red",
            }}
            onClick={() => handleRemove(record)}
          >
            Remove
          </Typography.Link>
        </Space>
      ),
    },
  ];
  // console.log("progress subscription", data);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variantt: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setPercentage(data.uploadProgress.progress);
    }
  }, [data]);

  const handleAdmit = async () => {
    const applicants = applicantsAdmissionList.map((applicant) => ({
      application_id: applicant.application.id,
      campus_id: applicant.campus,
      course_id: applicant.program_choice,
      entry_yr: applicant.entry_yr,
      study_time_id: applicant.study_time,
      applicant_id: applicant.application.applicant.id,
    }));

    const payload = {
      applicants,
    };

    // console.log(applicantsAdmissionList);
    const res = await admitStudents({
      variables: payload,
    });

    // console.log("res", res);
    if (res.data) {
      dispatch(
        showMessage({
          message: res.data.admit_students.message,
        })
      );
      dispatch(setApplicanntsAdmissionList([]));
    }
  };

  return (
    <Modal
      title={
        <Typography.Text
          style={{
            color: "#fff",
          }}
        >
          {`APPLICANTS ADMISSSION LIST`}
        </Typography.Text>
      }
      open={open}
      destroyOnClose={true}
      // onOk={onFinish}
      onCancel={() => dispatch(setApplicanntsAdmissionListModal(false))}
      zIndex={1000}
      maskClosable={false}
      closeIcon={
        <Close
          style={{
            color: "#fff",
          }}
        />
      }
      styles={{
        body: {
          padding: "10px 10px",
          height: "auto",

          // Ensure the content is not clipped
        },
        content: {
          padding: 0,
          height: "auto",
          // Ensure the content is not clipped
        },
        footer: {
          padding: 10,
        },
        header: {
          backgroundColor: "#0076eb",
          padding: "7px 10px",
        },
      }}
      width={1000}
      footer={
        <div
        //   style={{
        //     width: 200,
        //   }}
        >
          <Space size="large">
            <ConfigProvider
              theme={{
                components: {
                  Progress: {
                    lineBorderRadius: 0,
                  },
                },
              }}
            >
              <Progress
                percent={percentage}
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={[500, 30]}
                style={{
                  borderRadius: 0,
                }}
              />
            </ConfigProvider>
            <Button
              type="primary"
              loading={loading}
              disabled={loading || applicantsAdmissionList.length == 0}
              onClick={handleAdmit}
            >
              ADMIT STUDENTS
            </Button>
          </Space>
        </div>
      }
    >
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "#e0e0e0",
              borderRadius: 0,
              headerBorderRadius: 0,
              headerBg: "#eee",
              //   lineHeight: 0.8,
            },
          },
        }}
      >
        <Table
          pagination={false}
          size="small"
          bordered
          columns={columns}
          dataSource={applicantsAdmissionList}
          scroll={{
            y: 500,
          }}
        />
      </ConfigProvider>
    </Modal>
  );
};
export default ApplicantAdmissionList;
