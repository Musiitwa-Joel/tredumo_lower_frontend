import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Typography, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import {
  AddAlert,
  Approval,
  CardTravel,
  Close,
  Dvr,
  Edit,
  FormatListBulleted,
  TravelExplore,
  Work,
} from "@mui/icons-material";
import { useSelect } from "@mui/base";
import {
  selectActiveEmployeeBioDataTab,
  selectActiveMenuItem,
  selectDetailsModalVisible,
  selectSelectedEmployee,
  setActiveMenuItem,
  setDetailsModalVisible,
  setEmployeeDetails,
  setLoadingEmployeeDetails,
} from "../../store/hrSlice";
import BioData from "./employee_tabs/BioData";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_EMPLOYEE_DETAILS } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";
import { SAVE_EMPLOYEE, SAVE_REPORTING } from "../../gql/mutations";
import Reporting from "./Reporting";
import { selectActiveBioDataTab } from "../../../student_info_center/store/infoCenterSlice";
import { values } from "lodash";
// import BioData from "./student_details/BioData";
// import Enrollment from "./student_details/Enrollment";
// import Registration from "./student_details/Registration";
// import Finance from "./student_details/Finance";
// import StudentLogs from "./student_details/StudentLogs";
const { Header, Content, Footer, Sider } = Layout;

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
      <Work
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "CONTRACTS",
  },
  {
    key: "3",
    icon: (
      <Approval
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "APPRAISALS",
  },
  {
    key: "3",
    icon: (
      <TravelExplore
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "TRAVEL",
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
    label: "LOANS",
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
    label: "LEAVE",
  },
  {
    key: "7",
    icon: (
      <AddAlert
        style={{
          fontSize: 18,
        }}
      />
    ),
    label: "ADVANCES",
  },
];
const EmployeeDetailsModal = () => {
  const showInfoModal = useSelector(selectDetailsModalVisible);
  const activeMenuItem = useSelector(selectActiveMenuItem);
  const dispatch = useDispatch();
  const selectedEmployee = useSelector(selectSelectedEmployee);
  const activeBioDataTab = useSelector(selectActiveEmployeeBioDataTab);
  const [form] = Form.useForm();
  const {
    loading,
    error: loadErr,
    data: loadRes,
  } = useQuery(LOAD_EMPLOYEE_DETAILS, {
    variables: {
      employeeId: selectedEmployee ? selectedEmployee.id : "",
    },
    notifyOnNetworkStatusChange: true,
  });

  const [
    saveEmployee,
    { error: saveErr, loading: savingEmployee, data: saveRes },
  ] = useMutation(SAVE_EMPLOYEE, {
    refetchQueries: ["loadEmployees"],
  });

  const [
    saveReporting,
    { error: saveReportErr, loading: savingReporting, data: saveReportRes },
  ] = useMutation(SAVE_REPORTING, {
    refetchQueries: ["loadEmployees"],
  });

  useEffect(() => {
    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }

    if (saveReportErr) {
      dispatch(
        showMessage({
          message: saveReportErr.message,
          variant: "error",
        })
      );
    }
  }, [loadErr, saveErr, saveReportErr]);

  if (loadRes) {
    // console.log("response", loadRes);
    dispatch(setEmployeeDetails(loadRes.employee));
  }

  useEffect(() => {
    dispatch(setLoadingEmployeeDetails(loading));
  }, [loading]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleSave = async () => {
    const valid = await form.validateFields();
    // console.log("active", activeBioDataTab);

    const values = form.getFieldsValue();

    if (activeBioDataTab == "personal_info") {
      const personalInfoFormData = {
        payload: {
          id: selectedEmployee ? selectedEmployee.id : null,
          salutation_id: values.salutation,
          surname: values.surname,
          other_names: values.othernames,
          staff_id: values.staffId,
          email: values.email,
          nin: values.nin,
          gender: values.gender,
          status: values.status,
          nationality_id: values.nationality || null,
          address: values.address,
          telno: values.telno,
          religion: values.religion,
          date_of_birth: formatDateToYYYYMMDD(values.dateOfBirth.$d),
          marital_status: values.marital_status,
          nok_address: values.nok_address,
          nok_email: values.nok_email,
          nok_name: values.nok_name,
          nok_telno: values.nok_telno,
          nok_relation: values.nok_relation,
          medical_condition: values.medical_condition,
          emergency_contact: values.emergency_contact,
          disability: values.disability || null,
          illnesses: values.illnesses || null,
          mother_deceased: values.mother_deceased || false,
          mothers_email: values.mothers_email || null,
          mothers_name: values.mothers_name || null,
          mothers_nin: values.mothers_nin || null,
          mothers_telno: values.mothers_telno || null,
          father_deceased: values.father_deceased || false,
          fathers_email: values.fathers_email || null,
          fathers_name: values.fathers_name || null,
          fathers_nin: values.fathers_nin || null,
          fathers_telno: values.fathers_telno || null,
        },
      };

      // console.log("payload", personalInfoFormData);

      const res = await saveEmployee({
        variables: personalInfoFormData,
      });

      // console.log("response", res.data);
      dispatch(setDetailsModalVisible(false));
      dispatch(
        showMessage({
          message: res.data.saveReporting.message,
          variant: "success",
        })
      );
    } else if (activeBioDataTab == "reporting") {
      const payload = {
        payload: {
          employee_id: selectedEmployee?.id,
          first_level_approver: values.first_level_approver || null,
          indirect_managers: values.indirect_managers || null,
          manager: values.manager || null,
          second_level_approver: values.second_level_approver || null,
          third_level_approver: values.third_level_approver || null,
        },
      };

      const res = await saveReporting({
        variables: payload,
      });

      dispatch(setDetailsModalVisible(false));
      dispatch(
        showMessage({
          message: res.data.saveEmployee.message,
          variant: "success",
        })
      );
    } else {
      console.log("values", form.getFieldsValue());
    }
  };

  return (
    <>
      <Modal
        // title="Vertically centered modal dialog"
        width={1200}
        // height={100}
        open={showInfoModal}
        maskClosable={false}
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
        onCancel={() => dispatch(setDetailsModalVisible(false))}
        cancelButtonProps={{
          style: {
            backgroundColor: "red",
          },
        }}
        closeIcon={
          <Close
            style={{
              marginTop: -10,
              fontSize: 25,
            }}
          />
        }
        // closable={false}
        style={{
          //   backgroundColor: "red",
          padding: 0,
          height: 300,
          top: 80,
        }}
      >
        <Layout
          style={{
            // backgroundColor: "red",
            height: 520,
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
            <div className="demo-logo-vertical" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 5,
              }}
            >
              <div>
                <img
                  src={`http://localhost:2222/api/student_image/${selectedEmployee?.employee_id}`}
                  // src={`https://tredumo.nkumbauniversity.ac.ug:2222/api/student_image/${studentFile?.student_no}`}
                  // src={`http://199.241.139.118:9000/api/lecturer/image/NUA213`}
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
                  {selectedEmployee?.staff_id}
                </Typography>
              </div>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              // defaultSelectedKeys={["1"]}
              // activeKey="4"
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
              Email:{" "}
              <span
                style={{
                  fontWeight: "500",
                  marginLeft: 5,
                }}
              >
                {selectedEmployee?.email}
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
                  height: 450,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  // overflow: "scroll",
                }}
              >
                {activeMenuItem == "1" && <BioData form={form} />}

                {/* {activeMenuItem == "1" && <BioData />}
                {activeMenuItem == "2" && <Enrollment />}
                {activeMenuItem == "3" && <Registration />}
                {activeMenuItem == "4" && <Finance />}
                {activeMenuItem == "5" && <StudentLogs />} */}
              </div>
            </Content>
            <Footer
              style={{
                textAlign: "center",
                padding: 10,
                // backgroundColor: "red",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="primary"
                color="orange"
                style={{
                  backgroundColor: "orange",
                }}
              >
                Deactivate
              </Button>
              <Space>
                <Button type="primary" danger>
                  Print Employee File
                </Button>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "dodgerblue",
                  }}
                  onClick={handleSave}
                  loading={savingEmployee}
                >
                  Save Changes
                </Button>
              </Space>
            </Footer>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};
export default EmployeeDetailsModal;
