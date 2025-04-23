import { Box } from "@mui/material";

import {
  Form,
  Radio,
  Select,
  Table,
  Input,
  Row,
  Col,
  Space,
  Dropdown,
  Button,
  Tooltip,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
// import TestTable2 from "./TestTable2";
// import { updateCreateModuleModalOpen } from "../../store/progAndCoursesSlice";
import Edit from "@mui/icons-material/Edit";
import { useState } from "react";
import StudentList from "./StudentList";
import {
  selectallInfoReqs,
  selectLayout,
  selectSelectedStdInfoItem,
  selectStdInfoReqs,
  setLayout,
  setReloadStudents,
} from "../../store/infoCenterSlice";
import StudentsDataTable from "./StudentsDataTable";
import { Download, Refresh } from "@mui/icons-material";

const { Search } = Input;

function StudentDetails({ panelWidth }) {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // console.log("pannel width", panelWidth);
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();

  // const { selectedCourseVersion } = useSelector(
  //   (state) => state.progAndCourses
  // );
  const selectedItem = useSelector(selectSelectedStdInfoItem);
  const { campuses, intakes, acc_yrs } = useSelector(selectallInfoReqs);

  const stdInfoReqs = useSelector(selectStdInfoReqs);

  const campus_title = campuses.filter((c) => c.id == stdInfoReqs.campus)[0]
    ?.campus_title;
  const intake_title = intakes.filter((c) => c.id == stdInfoReqs.intake)[0]
    ?.intake_title;

  const acc_yr_title = acc_yrs.filter((c) => c.id == stdInfoReqs.acc_yr)[0]
    ?.acc_yr_title;
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [tableLayout, setTableLayout] = useState();

  // console.log("selected course version", selectedCourseVersion);

  //   const handleCreateNewModule = () => {
  //     dispatch(updateCreateModuleModalOpen(true));
  //   };

  const handleTableLayoutChange = (e) => {
    // setTableLayout(e.target.value);
    // console.log("layout", e.target.value);
    dispatch(setLayout(e.target.value));
  };

  //   console.log(layout);
  // console.log(stdInfoReqs);
  // console.log(selectedItem);

  return (
    <div
      style={{
        // marginTop: 9,
        marginLeft: 10,
        marginRight: 10,
        // backgroundColor: "red",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
          marginBottom: 7,
          // height: 32,
        }}
      >
        <Typography.Text
          strong
          style={{
            //   opacity: 0.7,
            // color: "white",
            // fontSize: "1.7rem",
            visibility: selectedItem ? "visible" : "hidden",
            fontWeight: "500",
          }}
        >
          {`(${selectedItem?.course.course_code}) - ${selectedItem?.course.course_title} - ${selectedItem?.label}, ${campus_title} CAMPUS, ${intake_title} INTAKE ${acc_yr_title}`}
        </Typography.Text>

        {/* <div>
          <Space>
            <Tooltip title="View Course Details">
              <Button
                size="small"
                icon={<RemoveRedEye />}
                disabled={!selectedCourseVersion}
              >
                View Course Details
              </Button>
            </Tooltip>
          </Space>
        </div> */}
      </Box>
      <div
        style={{
          // backgroundColor: "#fff",
          maxHeight: "calc(100vh - 188px)",
          minHeight: "calc(100vh - 188px)",
          //   overflow: "hidden",
          //   height: 600,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "lightgray",
            borderWidth: 1,
            // marginTop: 5,
            // marginBottom: 8,
          }}
        >
          <div>
            <Space>
              <Search
                placeholder="Search Student..."
                onSearch={onSearch}
                size="middle"
                width={500}
                style={{
                  width: 250,
                }}
              />
              <Button
                icon={<Refresh />}
                onClick={() => {
                  dispatch(setReloadStudents(true));
                }}
              >
                Reload Students
              </Button>
              <Button icon={<Download />}>Download Students</Button>
            </Space>
          </div>
          <div
            style={{
              marginBottom: -8,
            }}
          >
            <Form.Item label="Layout">
              <Radio.Group value={layout} onChange={handleTableLayoutChange}>
                <Radio.Button value={"list"}>List</Radio.Button>
                <Radio.Button value="table">Table</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
        {/* <TestTable2 panelWidth={panelWidth} /> */}
        {layout == "list" && <StudentList />}
        {layout == "table" && <StudentsDataTable />}
      </div>
    </div>
  );
}

export default StudentDetails;
