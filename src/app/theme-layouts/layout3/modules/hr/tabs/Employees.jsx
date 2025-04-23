import {
  Button,
  Card,
  Form,
  Radio,
  Space,
  Typography,
  Input,
  Divider,
} from "antd";
import CardContent from "@mui/material/CardContent";
import React, { useEffect } from "react";
import "./employees.css";
import { Add, Download, Print, Upload } from "@mui/icons-material";
import EmployeesTable from "./EmployeesTable";
import EmployeesList from "./EmployeesList";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDesignationModalVisible,
  selectEmployeesViewLayout,
  selectViewEmployeeDetails,
  setAddNewEmpModalVisible,
  setEmployees,
  setEmployeesViewLayout,
  setUploadEmpModalVisible,
} from "../store/hrSlice";
import AddNewEmployee from "./add_new_employee/AddNewEmployee";
import DesignationForm from "./designations/DesignationForm";
import { useQuery } from "@apollo/client";
import { LOAD_EMPLOYEES } from "../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import EmployeeDetailsModal from "./employee_details/EmployeeDetailsModal";
import UploadEmployeesModal from "./UploadEmployeessModal";
import hasPermission from "src/utils/hasPermission";
import { selectUserPermissions } from "app/store/userSlice";

const { Text } = Typography;
const { Search } = Input;
function Employees() {
  const dispatch = useDispatch();
  const layout = useSelector(selectEmployeesViewLayout);
  const employeeDetailsVisible = useSelector(selectViewEmployeeDetails);
  const designationFormVisible = useSelector(selectDesignationModalVisible);
  const { error, loading, data } = useQuery(LOAD_EMPLOYEES, {
    notifyOnNetworkStatusChange: true,
  });

  const userPermissions = useSelector(selectUserPermissions);

  const can_add_employees = hasPermission(userPermissions, "can_add_employees");
  const can_upload_employees = hasPermission(
    userPermissions,
    "can_upload_employees"
  );

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
    if (data) {
      dispatch(setEmployees(data.employees));
    }
  }, [data]);

  const handleTableLayoutChange = (e) => {
    // setTableLayout(e.target.value);
    // console.log("layout", e.target.value);
    dispatch(setEmployeesViewLayout(e.target.value));
  };

  return (
    <>
      <div
        style={{
          height: "calc(100vh - 99.2px)",
          backgroundColor: "#dfe5ef",
          padding: 15,
        }}
      >
        <Card
          className="flex flex-col shadow"
          style={{
            borderRadius: 0,
            //   backgroundColor: "red",
            borderColor: "lightgray",
            borderWidth: 0.5,
            padding: 0,
          }}
        >
          <CardContent
            className="flex flex-col flex-auto p-0"
            style={{
              height: "calc(100vh - 130px)",
              backgroundColor: "#fff",
              overflowY: "hidden",
              padding: 0,
              paddingTop: 0,
            }}
          >
            <div
              style={{
                //   borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                paddingLeft: 10,
                //   paddingTop: 8,
                paddingRight: 10,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Title
                style={{
                  fontSize: 20,
                  padding: 0,
                  marginTop: 10,
                  // color: "gray",
                  // backgroundColor: "red",
                }}
              >
                Employees List
              </Typography.Title>

              <Space size="middle">
                {can_add_employees && (
                  <Button
                    icon={<Add />}
                    onClick={() => dispatch(setAddNewEmpModalVisible(true))}
                  >
                    Add Employee
                  </Button>
                )}
                {can_upload_employees && (
                  <Button
                    icon={<Upload />}
                    onClick={() => dispatch(setUploadEmpModalVisible(true))}
                  >
                    Import Employees
                  </Button>
                )}
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Form.Item label="Layout">
                    <Radio.Group
                      value={layout}
                      onChange={handleTableLayoutChange}
                    >
                      <Radio.Button value="table">Table</Radio.Button>
                      <Radio.Button value={"list"}>List</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Space>
            </div>

            <div
              style={{
                //   borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                paddingLeft: 10,
                //   paddingTop: 8,
                paddingRight: 10,

                display: "flex",
                justifyContent: "space-between",
                //   alignItems: "center",
              }}
            >
              <div
                style={{
                  marginTop: 10,
                }}
              >
                <Form.Item>
                  <Radio.Group
                  //   value={layout}
                  //   onChange={handleTableLayoutChange}
                  >
                    <Radio.Button value={"list"}>Active Employees</Radio.Button>
                    <Radio.Button value="table">
                      Inactive Employees
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              <Space size="middle">
                <Button icon={<Print />}>Print Employees</Button>
                <Button icon={<Download />}>Download Employees</Button>
                <Search
                  style={{ marginBottom: 0, borderColor: "black" }}
                  // loading={loading}
                  placeholder="Search Employee"
                  variant="outlined"
                  // loading={loadingStudentFile}

                  enterKeyHint="search"
                  // width={100}

                  size="middle"
                  //   onChange={onSearchChange}
                />
              </Space>
            </div>

            {layout == "list" && <EmployeesList loading={loading} />}
            {layout == "table" && <EmployeesTable loading={loading} />}
            {designationFormVisible && <DesignationForm />}
          </CardContent>
        </Card>
      </div>

      <AddNewEmployee />
      <EmployeeDetailsModal />
      <UploadEmployeesModal />
    </>
  );
}

export default Employees;
