import * as React from "react";
import { useState, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { motion } from "framer-motion";
import Avatar from "@mui/material/Avatar";
import { AutoComplete, Descriptions, Tooltip } from "antd";
// import Phototable from "./Phototable";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Input as Input2,
  Space,
  Typography,
  Button as Button2,
  Upload,
} from "antd";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { debounce } from "lodash";
import { selectUser } from "app/store/userSlice";
import { Print } from "@mui/icons-material";
import EmployeeTabs from "./employee_tabs/EmployeeTabs";

const { Search } = Input2;

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});

function DemoContent() {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);
  const [image, setImage] = useState(null);
  // const [studentsAutoComplete, { error, loading, data }] = useLazyQuery(
  //   STUDENTS_AUTOCOMPLETE,
  //   {
  //     notifyOnNetworkStatusChange: true,
  //   }
  // );

  const fileInputRef = React.useRef(null);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      // setLoading(true);
      return;
    }

    // console.log("the imag", info.file.originFileObj);
    // let arr = [];
    // arr.push(img);
    // dispatch(setImageToUpload(arr));
    setImage(info.file.originFileObj);

    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (url) => {
      // setLoading(false);
      // setImageUrl(url);
      // dispatch(setImagePreview(url));
      // console.log(url);
    });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));

    reader.readAsDataURL(img);
  };

  const handleSearch = (value) => {
    // debouncedFetchSuggestions(value);
  };

  const onSelect = (data) => {
    // console.log("onSelect", data);
    // const selected = _options.filter((op) => op.student_no == data)[0];
    // console.log("selected", selected);
    // dispatch(
    //   setImagePreview(
    //     `http://localhost:2222/api/student_image/${selected.student_no}`
    //   )
    // );
    // dispatch(setSelectedOption(selected));
    // dispatch(setImageToUpload(null));
    setImage(null);
  };

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);

  const handleSave = async () => {
    const payload = {
      // image: image,
      // file: image,
      // stdno: selectedStd.student_no,
      // saveStudentImageId: selectedStd.id,
      // uploadedBy: userObj.user.user_id,
    };

    // console.log("payload", payload);

    const res = await saveStudentImage({
      variables: payload,
    });

    // console.log("response", res.data);
    // reset the forms
    // dispatch(
    //   setSelectedOption({
    //     student_no: "",
    //   })
    // );
    setImage(null);
    // dispatch(setImagePreview(`http://localhost:2222/api/student_image/0`));
    dispatch(
      showMessage({
        message: res.data.saveStudentImage.message,
        variant: "success",
      })
    );
  };

  // console.log("selected option", selectedStd);
  return (
    <div
      className="flex-auto p-24 sm:p-40"
      style={{
        height: "calc(100vh - 162px)",
        // backgroundColor: "green",
      }}
    >
      <div
        className="border-2 border-dashed rounded-2xl"
        style={{
          height: "calc(100vh - 220px)",
          // backgroundColor: "red",
          overflow: "hidden",
        }}
      >
        <motion.div
          // className="flex flex-wrap p-24"
          //  variants={container}
          initial="hidden"
          animate="show"
          // initial={{ scale: 0 }}
          // animate={{ scale: 1, transition: { delay: 0.1 } }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid xs={4} md={4} lg={4} xl={4}>
                <Card
                  className="flex flex-col shadow"
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <CardContent
                    className="flex flex-col flex-auto p-24"
                    style={{
                      height: "calc(100vh - 222px)",
                      // backgroundColor: "red",
                      overflowY: "hidden",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 0,
                          // height: "100vh",
                        }}
                      >
                        <motion.div animate={{ x: [0, 30, 0] }}>
                          <Avatar
                            sx={{ borderColor: "purple" }}
                            className="w-200 h-200 border-4"
                            src={`http://localhost:2222/api/student_image/0`}
                            alt="User avatar"
                          />
                        </motion.div>
                      </div>

                      <div
                        ref={scrollContainerRef}
                        style={{
                          marginTop: 10,
                          position: "relative",
                          height: "calc(100vh - 430px)",
                          overflow: "hidden",
                        }}
                      >
                        <div>
                          <Descriptions
                            column={2}
                            //   title="User Info"
                            bordered
                            labelStyle={{
                              backgroundColor: "#e7edfe",
                              color: "#0832b7",
                              fontWeight: "bold",
                              width: "41%",
                            }}
                            size="small"
                            items={[
                              {
                                key: "5",
                                label: "ID",
                                children: "NUA2156",
                                span: 3,
                              },
                              {
                                key: "6",
                                label: "Name",
                                ellipsis: true,
                                children: (
                                  <div
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: 160, // Ensure it respects its column width
                                    }}
                                  >
                                    PROFESSOR JUDE LUBEGA mnsdmn sdmsd mds
                                  </div>
                                ),
                                span: 2,
                              },

                              {
                                key: "2",
                                label: "Facilitator",
                                children: "",
                                span: 2,
                              },
                              {
                                key: "4",
                                label: "Tel No.",
                                children: "0765353536",
                                span: 2,
                              },

                              {
                                key: "5",
                                label: "Review Status",
                                children: "Pending",
                                span: 2,
                              },

                              {
                                key: "6",
                                label: "Start Date",
                                children: "Dec 18, 2024",
                                span: 2,
                              },
                              {
                                key: "6",
                                label: "End Date",
                                children: "Dec 18, 2024",
                                span: 2,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {/* <CourseProgress className="" course={course} /> */}
                </Card>
              </Grid>
              <Grid xs={8} md={8} lg={8} xl={8}>
                <div
                  style={{
                    paddingRight: 15,
                    // backgroundColor: "green",
                  }}
                >
                  <EmployeeTabs />
                </div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </div>
    </div>
  );
}

export default DemoContent;
