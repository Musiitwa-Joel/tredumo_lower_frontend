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
import { AutoComplete, Tooltip } from "antd";
import Phototable from "./Phototable";
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
import { STUDENTS_AUTOCOMPLETE } from "../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { debounce } from "lodash";
import {
  selectImagePreview,
  selectImageToUpload,
  selectOptions,
  selectSelectedOption,
  setImagePreview,
  setImageToUpload,
  setSelectedOption,
  setStdOptions,
} from "../store/photosSlice";
import { SAVE_STUDENT_IMAGE } from "../gql/mutations";
import { selectUser } from "app/store/userSlice";

const { Search } = Input2;

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});

function DemoContent() {
  const [activeTab, setActiveTab] = React.useState("1");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const _options = useSelector(selectOptions);
  const selectedStd = useSelector(selectSelectedOption);
  const imagePreview = useSelector(selectImagePreview);
  const imageToUpload = useSelector(selectImageToUpload);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);
  const userObj = useSelector(selectUser);
  const [image, setImage] = useState(null);
  const [studentsAutoComplete, { error, loading, data }] = useLazyQuery(
    STUDENTS_AUTOCOMPLETE,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const [
    saveStudentImage,
    { error: saveErr, loading: savingStdImage, data: saveRes },
  ] = useMutation(SAVE_STUDENT_IMAGE, {
    refetchQueries: ["getRecentlyUploadedImages"], //to be fetch updated uploaded students
  });

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

      dispatch(setImagePreview(url));
      // console.log(url);
    });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));

    reader.readAsDataURL(img);
  };

  if (error) {
    dispatch(
      showMessage({
        message: error.message,
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

  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query) {
        const res = await studentsAutoComplete({
          variables: {
            query: query,
          },
        });
        dispatch(setStdOptions(res.data.student_autocomplete));

        const arr = res.data.student_autocomplete.map((item) => ({
          label: item.name,
          value: item.student_no, // Adjust based on your data structure
        }));

        // console.log("arr", arr);
        setOptions(arr);
      } else {
        setOptions([]);
      }
    }, 300), // Adjust debounce delay as needed
    []
  );

  const handleSearch = (value) => {
    debouncedFetchSuggestions(value);
  };

  const onSelect = (data) => {
    // console.log("onSelect", data);
    const selected = _options.filter((op) => op.student_no == data)[0];
    console.log("selected", selected);
    dispatch(
      setImagePreview(
        `http://localhost:2222/api/student_image/${selected.student_no}`
      )
    );
    dispatch(setSelectedOption(selected));
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
      file: image,
      stdno: selectedStd.student_no,
      saveStudentImageId: selectedStd.id,
      uploadedBy: userObj.user.user_id,
    };

    // console.log("payload", payload);

    const res = await saveStudentImage({
      variables: payload,
    });

    // console.log("response", res.data);
    // reset the forms
    dispatch(
      setSelectedOption({
        student_no: "",
      })
    );
    setImage(null);
    dispatch(setImagePreview(`http://localhost:2222/api/student_image/0`));
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
        height: "calc(100vh - 160px)",
        // backgroundColor: "red",
      }}
    >
      <div
        className="border-2 border-dashed rounded-2xl"
        style={{
          height: "calc(100vh - 230px)",
          // backgroundColor: "red",
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
              <Grid xs={4}>
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
                      height: "calc(100vh - 278px)",
                      // backgroundColor: "red",
                      overflowY: "hidden",
                    }}
                  >
                    {/* <CourseInfo course={course} className="" /> */}
                    <Grid
                      container
                      spacing={1}
                      style={
                        {
                          // backgroundColor: "red",
                          // justifyContent: "space-between",
                        }
                      }
                    ></Grid>

                    <AutoComplete
                      options={options}
                      onSelect={onSelect}
                      onSearch={handleSearch}
                      value={selectedStd ? selectedStd.student_no : ""}
                      onChange={(text) =>
                        dispatch(setSelectedOption({ student_no: text }))
                      }

                      // onChange={}

                      // dropdownRender={(data) => <div>{"Hello"}</div>}
                    >
                      <Search
                        style={{ marginBottom: 0 }}
                        loading={loading}
                        placeholder="Enter Student Identifier"
                        // width={100}

                        size="middle"
                        //   onChange={onSearchChange}
                      />
                    </AutoComplete>
                    <div ref={scrollContainerRef}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 10,
                          // height: "100vh",
                        }}
                      >
                        <motion.div animate={{ x: [0, 30, 0] }}>
                          <Avatar
                            sx={{ borderColor: "purple" }}
                            className="w-200 h-200 border-4"
                            src={imagePreview}
                            alt="User avatar"
                          />
                        </motion.div>
                      </div>

                      <div
                        style={{
                          padding: 20,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            paddingBottom: 15,
                          }}
                        >
                          <Typography
                            style={{
                              width: 100,
                            }}
                          >
                            Name:
                          </Typography>
                          <Tooltip title={selectedStd?.name}>
                            <Typography
                              style={{
                                fontWeight: "500",
                                whiteSpace: "nowrap", // Fix: Use `whiteSpace` instead of `textWrap`
                                overflow: "hidden", // Fix: Use `overflow` instead of `textOverflow`
                                textOverflow: "ellipsis",
                              }}
                            >
                              {selectedStd?.name}
                            </Typography>
                          </Tooltip>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            paddingBottom: 15,
                          }}
                        >
                          <Typography
                            style={{
                              width: 100,
                            }}
                          >
                            Reg No:
                          </Typography>
                          <Tooltip title={selectedStd?.registration_no}>
                            <Typography
                              style={{
                                fontWeight: "500",
                                whiteSpace: "nowrap", // Fix: Use `whiteSpace` instead of `textWrap`
                                overflow: "hidden", // Fix: Use `overflow` instead of `textOverflow`
                                textOverflow: "ellipsis",
                              }}
                            >
                              {selectedStd?.registration_no}
                            </Typography>
                          </Tooltip>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            paddingBottom: 0,
                          }}
                        >
                          <Typography
                            style={{
                              minWidth: 100,
                              textWrap: "nowrap",
                            }}
                          >
                            Course code:
                          </Typography>
                          <Typography
                            style={{
                              fontWeight: "500",
                            }}
                          >
                            {selectedStd?.course?.course_code}
                          </Typography>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Space>
                          {/* <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }} // Hide the input
                            onChange={handleFileChange}
                          /> */}
                          {/* <Button2
                            icon={<PhotoCamera />}
                            onClick={handleButtonClick}
                            disabled={!selectedStd}
                          >
                            Upload Image
                          </Button2> */}
                          <Upload
                            showUploadList={false}
                            maxCount={1}
                            accept="image/png, image/jpeg, image/jpg"
                            // beforeUpload={() => {
                            //   return false;
                            // }}
                            onChange={handleChange}
                          >
                            <Button2
                              disabled={!selectedStd}
                              icon={<PhotoCamera />}
                            >
                              Upload Image
                            </Button2>
                          </Upload>
                          <Button2 icon={<LinkedCameraIcon />}>
                            Take Image
                          </Button2>
                        </Space>
                      </div>
                    </div>
                  </CardContent>
                  {/* <CourseProgress className="" course={course} /> */}
                  <CardActions
                    className="items-center justify-end py-8 px-24"
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? lighten(theme.palette.background.default, 0.4)
                          : lighten(theme.palette.background.default, 0.03),
                    }}
                  >
                    <Button2
                      type="primary"
                      style={{
                        backgroundColor:
                          selectedStd &&
                          image &&
                          !savingStdImage &&
                          "dodgerblue",
                      }}
                      disabled={!selectedStd || !image}
                      onClick={handleSave}
                      loading={savingStdImage}
                      icon={
                        <FuseSvgIcon className="" size={20}>
                          heroicons-solid:save
                        </FuseSvgIcon>
                      }
                    >
                      Save
                    </Button2>
                  </CardActions>
                </Card>
              </Grid>
              <Grid xs={8}>
                <Phototable />
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </div>
    </div>
  );
}

export default DemoContent;
