import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Form, Modal, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  selectActiveMenuItem,
  selectSelectedStudent,
  selectShowInfoModal,
  setActiveMenuItem,
  setShowInfoModal,
} from "../../store/infoCenterSlice";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import {
  CardTravel,
  Close,
  Dvr,
  Edit,
  FormatListBulleted,
} from "@mui/icons-material";
import { useSelect } from "@mui/base";
import BioData from "./student_details/BioData";
import Enrollment from "./student_details/Enrollment";
import Registration from "./student_details/Registration";
import Finance from "./student_details/Finance";
import StudentLogs from "./student_details/StudentLogs";
import { useMutation } from "@apollo/client";
import { SAVE_STUDENT_DATA } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
const { Header, Content, Footer, Sider } = Layout;

// const items = [
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
//   UserOutlined,
// ].map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));

const items = [
  {
    key: "1",
    icon: (
      <UserOutlined
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "BIO DATA",
  },
  {
    key: "2",
    icon: (
      <Dvr
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "ENROLLMENT",
  },
  {
    key: "3",
    icon: (
      <Edit
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "REGISTRATION",
  },
  {
    key: "4",
    icon: (
      <CardTravel
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "FINANCE",
  },
  {
    key: "5",
    icon: (
      <FormatListBulleted
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "STUDENT LOGS",
  },
];
const StudentInfoModal = () => {
  const showInfoModal = useSelector(selectShowInfoModal);
  const activeMenuItem = useSelector(selectActiveMenuItem);
  const dispatch = useDispatch();
  const selectedStudent = useSelector(selectSelectedStudent);
  const [saveStudentData, { error, loading, data }] = useMutation(
    SAVE_STUDENT_DATA,
    {
      refetchQueries: ["Students"],
    }
  );
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  const handleSave = async () => {
    // const valid = await form.validateFields();
    console.log("selectted std", selectedStudent);

    const values = form.getFieldsValue();

    const payload = {
      payload: {
        applicant_id: selectedStudent?.biodata.id,
        campus_id: values.campus || null,
        completed: values.completed || null,
        course_id: values?.course_title || null,
        course_version_id: values?.course_version || null,
        entry_acc_yr: values.entry_acc_yr || null,
        entry_study_yr: parseInt(values?.entry_study_yr) || null,
        intake_id: values?.intake || null,
        reg_no: values?.reg_no || null,
        sponsorship: values?.sponsorship || null,
        student_no: values.student_no || null,
        study_time_id: values.study_time || null,
        // study_yr: null,
      },
    };

    // console.log("payload", payload);

    const res = await saveStudentData({
      variables: payload,
    });

    // console.log("response", res);
    dispatch(
      showMessage({
        message: res.data.saveStudentData.message,
        variant: "success",
      })
    );
  };

  // console.log("selected Student", selectedStudent);
  if (!selectedStudent) return;

  // console.log("info modal", setShowInfoModal);
  return (
    <>
      <Modal
        // title="Vertically centered modal dialog"
        width={1000}
        // height={100}
        open={showInfoModal}
        footer={false}
        styles={{
          body: {
            padding: 0,
            backgroundColor: "red",
          },
          content: {
            padding: 0,
          },
        }}
        onCancel={() => dispatch(setShowInfoModal(false))}
        cancelButtonProps={{
          style: {
            backgroundColor: "red",
          },
        }}
        closeIcon={
          <Close
            style={{
              // marginTop: -10,
              fontSize: 25,
            }}
          />
        }
        // closable={false}
        style={{
          //   backgroundColor: "red",
          padding: 0,
          height: 300,
          top: 70,
        }}
        maskClosable={false}
      >
        <Layout
          style={{
            // backgroundColor: "red",
            height: 500,
            overflow: "hidden",
          }}
        >
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div
              style={{
                padding: 10,
              }}
            >
              <Typography.Title
                level={5}
                style={{
                  color: "#fff",
                  textAlign: "center",
                  padding: 0,
                  margin: 0,
                }}
              >
                ACTIVE STUDENT
              </Typography.Title>
            </div>
            <div className="demo-logo-vertical" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
                marginTop: 0,
                marginBottom: 5,
              }}
            >
              <div>
                <img
                  // src={`http://localhost:2222/api/student_image/${selectedStudent.student_no}`}
                  // src={`https://tredumo.nkumbauniversity.ac.ug:2222/api/student_image/${studentFile?.student_no}`}
                  src={` https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${selectedStudent.student_no}`}
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 5,
                }}
              >
                <Typography
                  style={{
                    color: "white",
                    fontSize: "1.8rem",
                  }}
                >
                  {selectedStudent.student_no}
                </Typography>
              </div>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              // defaultSelectedKeys={["1"]}
              activeKey="4"
              selectedKeys={[activeMenuItem]}
              onClick={(data) => dispatch(setActiveMenuItem(data.key))}
              items={items}
            />
          </Sider>
          <Layout>
            <div
              style={{
                height: 40,
                // backgroundColor: "red",
                display: "flex",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              REG NO:{" "}
              <span
                style={{
                  fontWeight: "500",
                  marginLeft: 5,
                }}
              >
                {" "}
                {selectedStudent.registration_no}
              </span>
            </div>
            <Content
              style={{
                // margin: "24px 16px 0",
                marginTop: 0,
              }}
            >
              <div
                style={{
                  padding: 10,
                  minHeight: 400,
                  height: 400,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  // overflow: "scroll",
                }}
              >
                <ConfigProvider
                  theme={{
                    algorithm: theme.compactAlgorithm,
                  }}
                >
                  {activeMenuItem == "1" && <BioData form={form} />}
                  {activeMenuItem == "2" && <Enrollment />}
                  {activeMenuItem == "3" && <Registration />}
                  {activeMenuItem == "4" && <Finance />}
                  {activeMenuItem == "5" && <StudentLogs />}
                </ConfigProvider>
              </div>
            </Content>
            <Footer
              style={{
                textAlign: "center",
                padding: 10,
                // backgroundColor: "red",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Space>
                <Button type="primary" danger>
                  Reset Student Portal Password
                </Button>
                {activeMenuItem == "1" && (
                  <Button
                    type="primary"
                    onClick={handleSave}
                    loading={loading}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                )}
              </Space>
            </Footer>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};
export default StudentInfoModal;
