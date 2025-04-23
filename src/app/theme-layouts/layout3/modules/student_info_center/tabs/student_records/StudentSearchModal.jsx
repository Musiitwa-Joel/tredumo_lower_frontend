import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Table,
  ConfigProvider,
  Select,
  Typography,
  Button,
  Form,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStudentSearchModalVisible,
  setSelectedStudent,
  setShowInfoModal,
  setStudentSearchModalVisible,
} from "../../store/infoCenterSlice";
import { SyncOutlined } from "@ant-design/icons";
import { Close, SearchOutlined } from "@mui/icons-material";
import { useLazyQuery } from "@apollo/client";
import { GET_STUDENTS } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { Search } = Input;

const options = [
  {
    value: "name",
    label: "Student Name",
  },
  {
    value: "student_no",
    label: "Student Number",
  },
  {
    value: "registration_no",
    label: "Registration Number",
  },
  // {
  //   value: "name",
  //   label: "Student Name",
  // },
];

const columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "#",
    width: 50,
    render: (text, record, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
    render: (text, record, index) => {
      return `${record.biodata.surname} ${record.biodata.other_names}`;
    },
    ellipsis: true,
  },
  {
    title: "Student Number",
    dataIndex: "student_no",
    key: "student_no",
    ellipsis: true,
    width: 120,
  },
  {
    title: "Reg No",
    ellipsis: true,
    dataIndex: "registration_no",
    width: 180,
  },
  {
    title: "Course",
    ellipsis: true,
    dataIndex: "courses",
    render: (text, record, index) => {
      return `${record.course.course_title}`;
    },
    width: 150,
  },
  {
    title: "Course Code",
    dataIndex: "course_code",
    ellipsis: true,
    width: 100,
    render: (text, record, index) => {
      return `${record.course.course_code}`;
    },
  },
];

const StudentSearchModal = () => {
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const studentSearchModalVisible = useSelector(
    selectStudentSearchModalVisible
  );
  const [stds, setStds] = useState([]);
  const [getStudents, { error: studentsErr, loading: loadingStudents }] =
    useLazyQuery(GET_STUDENTS, {
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    if (studentsErr) {
      dispatch(
        showMessage({
          message: studentsErr.message,
          variant: "error",
        })
      );
    }
  }, [studentsErr]);

  const handleChange = (value) => {
    setSearchCriteria(value);
  };

  const onFinish = async (values) => {
    const res = await getStudents({
      variables: {
        sic: true,
        searchCreteria: searchCriteria,
        searchValue: values.search_value,
      },
    });

    // console.log("res", res.data);
    if (res.data) {
      setStds(res.data.students);
    }
  };

  return (
    <>
      <Modal
        title={
          <Typography.Text
            style={{
              color: "#fff",
            }}
          >
            SEARCH STUDENT
          </Typography.Text>
        }
        closeIcon={
          <Close
            style={{
              // marginTop: -15,
              color: "#fff",
            }}
          />
        }
        styles={{
          body: {
            paddingLeft: 10,
            paddingRight: 10,
            height: "auto",
          },
          content: {
            padding: 0,
            height: "auto",
          },
          footer: {
            padding: 10,
          },
          header: {
            backgroundColor: "#2f405d",
            padding: "7px 10px",
          },
        }}
        maskClosable={false}
        open={studentSearchModalVisible}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        onCancel={() => dispatch(setStudentSearchModalVisible(false))}
        cancelText="Close"
        width={900}
        style={{
          maxHeight: 300,
        }}
      >
        <div
          style={{
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                marginRight: 10,
              }}
            >
              <span>Search Criteria:</span>
            </div>
            <div>
              <Select
                size="default"
                defaultValue={searchCriteria}
                placeholder="Select a search criteria"
                onChange={handleChange}
                style={{
                  width: 200,
                }}
                options={options}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {/* <Search
              style={{ marginBottom: 8, width: 500 }}
              placeholder="Search Student"
              // width={100}

              size="large"
              //   onChange={onSearchChange}
            /> */}

            <ConfigProvider
              theme={{
                token: {
                  colorBorder: "lightgray",
                },
              }}
            >
              <Form
                name="basic"
                form={form}
                layout="vertical"
                // initialValues={{
                //   student_no: studentNo,
                // }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  name="search_value"
                  rules={[
                    {
                      required: true,
                      message: `Please input the ${options.find((criteria) => criteria.value == searchCriteria).label}`,
                    },
                  ]}
                  style={{ marginBottom: 8, width: 500 }}
                >
                  <Search
                    style={{ marginBottom: 0, borderColor: "black" }}
                    // loading={loadingStudents}
                    placeholder={`Enter the ${options.find((criteria) => criteria.value == searchCriteria).label}`}
                    variant="outlined"
                    // loading={loadingStudentFile}
                    enterButton={
                      loadingStudents ? (
                        <Button disabled={true}>
                          <SyncOutlined
                            style={{
                              fontSize: 19,
                            }}
                            spin
                          />
                        </Button>
                      ) : (
                        <Button
                          htmlType="submit"
                          onClick={() => console.log("search..")}
                        >
                          <SearchOutlined />
                        </Button>
                      )
                    }
                    enterKeyHint="search"
                    // width={100}

                    size="large"
                    //   onChange={onSearchChange}
                  />
                </Form.Item>
              </Form>
            </ConfigProvider>
          </div>

          <ConfigProvider
            theme={{
              components: {
                Table: {
                  // headerBg: "rgba(0, 0, 0, 0.04)",
                  borderColor: "lightgray",
                  // borderRadius: 0,
                  // headerBorderRadius: 0,
                  // cellFontSize: 10,
                  // fontSize: "1.6rem",
                  // lineHeight: 0.8,
                },
              },
            }}
          >
            <Table
              columns={columns}
              dataSource={stds}
              loading={loadingStudents}
              rowKey="std_id"
              bordered
              // sticky
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  console.log("record", record);
                  dispatch(setSelectedStudent(record));
                  dispatch(setShowInfoModal(true));
                },
              })}
              // expandable={defaultExpandable}
              showHeader={true}
              // tableLayout="fixed"
              size="small"
              // pagination={{
              //   position: ["bottomRight"],
              // }}
              pagination={false}
              scroll={{
                y: "calc(100vh - 450px)", // Set the same height as in the style to ensure content scrolls
                // x: "100vw",
              }}

              // scroll={{
              //   y: "calc(100vh - 370px)",
              //   x: "100vw",
              // }}
            />
          </ConfigProvider>
        </div>
      </Modal>
    </>
  );
};
export default StudentSearchModal;
