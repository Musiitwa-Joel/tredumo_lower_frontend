import { Box, Typography } from "@mui/material";

import { ConfigProvider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
// import TestTable2 from "./TestTable2";
// import { updateCreateModuleModalOpen } from "../../store/progAndCoursesSlice";
import { useEffect, useState } from "react";
// import StudentList from "./StudentList";
// import StudentsDataTable from "./StudentsDataTable";
import EditableTable from "./EditableTable";
import { selectSelectedTreeItem } from "../../store/feesMgtSlice";

function FeesDetails({ panelWidth }) {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // const { selectedCourseVersion } = useSelector(
  //   (state) => state.progAndCourses
  // );

  const [tableLayout, setTableLayout] = useState();
  const userObj = useSelector(selectUser);
  const selectedTreeItem = useSelector(selectSelectedTreeItem);

  // console.log(selectedTreeItem);

  return (
    <div
      style={{
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            opacity: 0.7,
          },
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
            paddingLeft: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10,
            marginBottom: 7,

            height: 40,
          }}
        >
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            // style={{
            //   //   opacity: 0.7,
            //   // color: "white",
            //   fontSize: "1.7rem",
            //   // visibility: selectedItem ? "visible" : "hidden",
            //   // fontWeight: "bold",
            // }}

            style={{
              fontSize: "1.7rem",
              whiteSpace: "nowrap", // Prevents text from wrapping
              overflow: "hidden", // Hides overflow content
              textOverflow: "ellipsis", // Adds ellipsis when text overflows
              width: "100%",
              visibility: selectedTreeItem ? "visible" : "hidden",
            }}
          >
            {/* {`Study Time: ${selectedTreeItem?.details?.study_time_title}, Nationality Category: ${selectedTreeItem?.details?.nationality_title}, Study year: ${selectedTreeItem?.details?.study_yr}, School: ${selectedTreeItem?.details?.school_title}`} */}
            <span style={{ color: "blueviolet" }}>
              {`Study Time: ${selectedTreeItem?.details?.study_time_title}`}
            </span>
            , &nbsp;
            <span style={{ color: "darkblue" }}>
              {`Nationality Category: ${selectedTreeItem?.details?.nationality_title}`}
            </span>
            , &nbsp;
            <span style={{ color: "darkgreen" }}>
              {`Study year: ${selectedTreeItem?.details?.study_yr}`}
            </span>
            , &nbsp;
            <span style={{ color: "purple" }}>
              {`Course: ${selectedTreeItem?.details?.course_code}`}
            </span>
            , &nbsp;
            <span style={{ color: "maroon" }}>
              {`School: ${selectedTreeItem?.details?.school_title}`}
            </span>
          </Typography>
        </Box>
        {/* <div
          style={{
            backgroundColor: "#fff",
            marginBottom: 8,
            borderRadius: 0,
            borderColor: "lightgray",
            //   color: "red",
          }}
        >
          <div
            style={{
              width: "100%", // Ensures the container takes full width
              // backgroundColor: "red",
            }}
          >
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              style={{
                fontSize: "1.7rem",
                whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides overflow content
                textOverflow: "ellipsis", // Adds ellipsis when text overflows
                width: "100%",
              }}

              // style={{
              //   //   opacity: 0.7,
              //   // color: "blue",
              //   fontSize: "1.7rem",
              //   // display: !selectedTreeItem ? "none" : "",
              //   // visibility: selectedItem ? "visible" : "hidden",
              //   // fontWeight: "bold",
              // }}
            >
              {`Study Time: DAY, Nationality Category: NATIONAL, Study year: 1, School: SCHOOL OF COMPUTING AND INFORMATICS iuiuwnm s kjlskbsaj`}
            </Typography>
          </div>
        </div> */}
      </ConfigProvider>
      <div
        style={{
          // backgroundColor: "#fff",
          maxHeight: "calc(100vh - 188px)",
          minHeight: "calc(100vh - 188px)",
          //   overflow: "hidden",
          //   height: 600,
        }}
      >
        {/* <div
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
                placeholder="Search Fee Item..."
                // onSearch={onSearch}
                size="middle"
                width={500}
                style={{
                  width: 250,
                }}
              />
              <Button icon={<Add />}>Add Fee Item</Button>
              <Button
                icon={<Refresh />}
                // onClick={() => {
                //   dispatch(setReloadStudents(true));
                // }}
              >
                Reload Items
              </Button>
              <Button icon={<Preview />}>Preview Fees Structure</Button>
            </Space>
          </div>
        </div> */}
        <div
          style={{
            marginTop: 8,
          }}
        >
          <EditableTable />
        </div>
      </div>
    </div>
  );
}

export default FeesDetails;
