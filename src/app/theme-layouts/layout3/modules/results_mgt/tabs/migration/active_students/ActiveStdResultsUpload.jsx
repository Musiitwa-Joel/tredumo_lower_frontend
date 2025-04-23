import React from "react";
import {
  Button,
  Divider,
  Flex,
  Input,
  Space,
  Splitter,
  Typography,
  Tree,
  Card,
  Table,
  ConfigProvider,
} from "antd";
import { Download } from "lucide-react";

const { DirectoryTree } = Tree;

const columns = [
  {
    title: "#",
    dataIndex: "#",
    width: 50,
    render: (text, item, index) => index + 1,
  },
  {
    title: "Student No",
    dataIndex: "student_no",
    ellipsis: true,
    width: 120,
  },
  {
    title: "Academic Year",
    dataIndex: "acc_yr",
    ellipsis: true,
    width: 120,
  },
  {
    title: "Study Year",
    dataIndex: "study_yr",
    ellipsis: true,
    width: 100,
  },
  {
    title: "Semester",
    dataIndex: "semester",
    width: 100,
  },
  {
    title: "Course Unit Code",
    dataIndex: "courseunit_code",
    width: 140,
  },
  {
    title: "Course work Mark",
    dataIndex: "coursework_mark",
    width: 140,
  },
  {
    title: "Exam Mark",
    dataIndex: "exam_mark",
    width: 100,
  },
  {
    title: "Final Mark",
    dataIndex: "final_mark",
    width: 100,
  },
  {
    title: "Retake Count",
    dataIndex: "retake_count",
    width: 110,
  },
  {
    title: "Pass Mark",
    dataIndex: "pass_mark",
    width: 100,
  },
  {
    title: "Remark",
    dataIndex: "remark",
    width: 100,
  },
];
const data = [
  {
    key: "1",
    student_no: "2000101041",
    acc_yr: "2023/2024",
    study_yr: "1",
    semester: "1",
    courseunit_code: "BSCCS",
    coursework_mark: "20",
    exam_mark: "30",
    final_mark: "50",
    retake_count: "0",
    pass_mark: "40",
    remark: "NP",
  },
  {
    key: "2",
    student_no: "2000101041",
    acc_yr: "2023/2024",
    study_yr: "1",
    semester: "1",
    courseunit_code: "BSCCS",
    coursework_mark: "20",
    exam_mark: "30",
    final_mark: "50",
    retake_count: "0",
    pass_mark: "40",
    remark: "NP",
  },
  {
    key: "3",
    student_no: "2000101041",
    acc_yr: "2023/2024",
    study_yr: "1",
    semester: "1",
    courseunit_code: "BSCCS",
    coursework_mark: "20",
    exam_mark: "30",
    final_mark: "50",
    retake_count: "0",
    pass_mark: "40",
    remark: "NP",
  },
  {
    key: "4",
    student_no: "2000101041",
    acc_yr: "2023/2024",
    study_yr: "1",
    semester: "1",
    courseunit_code: "BSCCS",
    coursework_mark: "20",
    exam_mark: "30",
    final_mark: "50",
    retake_count: "0",
    pass_mark: "40",
    remark: "NP",
  },
];
const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const treeData = [
  {
    title: "Sheets",
    key: "0-0",
    children: [
      {
        title: "leaf 0-0",
        key: "0-0-0",
        isLeaf: true,
      },
      {
        title: "leaf 0-1",
        key: "0-0-1",
        isLeaf: true,
      },
    ],
  },
];

const Desc = (props) => (
  <Flex
    justify="center"
    align="center"
    style={{
      height: "100%",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);
const CustomSplitter = ({ style, ...restProps }) => {
  const onSelect = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };
  const onExpand = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };

  return (
    <Splitter
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        ...style,
      }}
      {...restProps}
    >
      <Splitter.Panel
        collapsible
        size="30%"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Space>
              <Input />
              <Button type="primary">Browse</Button>
            </Space>

            <Button type="primary" ghost>
              Extract
            </Button>
          </div>

          <Divider
            style={{
              padding: 0,
              margin: 0,
              backgroundColor: "lightgray",
            }}
          />

          <div
            style={{
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Typography.Title
              style={{
                margin: 0,
                paddingTop: 5,
                paddingBottom: 5,
              }}
              level={5}
            >
              Extracted Data
            </Typography.Title>
          </div>
          <Divider
            style={{
              padding: 0,
              margin: 0,
              backgroundColor: "lightgray",
            }}
          />

          <div>
            <DirectoryTree
              style={{
                padding: 10,
              }}
              multiple
              defaultExpandAll
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={treeData}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel
        collapsible
        style={{
          padding: 15,
        }}
      >
        <Card
          className="flex flex-col shadow"
          style={{
            borderRadius: 10,
            // backgroundColor: "red",
            borderColor: "lightgray",
            borderWidth: 0.5,
            height: "calc(100vh - 195px)",
            display: "flex",
            flexDirection: "column",
          }}
          styles={{
            body: {
              flex: 1,
              padding: 0,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <div style={{ flex: 1, overflow: "auto" }}>
            <Table
              size="small"
              title={() => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography.Title
                    level={5}
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    Active Students Preview
                  </Typography.Title>

                  <Space>
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      icon={<Download size={19} />}
                      onClick={() => dispatch(setRespondReviewVisible(false))}
                    >
                      Download Template
                    </Button>
                  </Space>
                </div>
              )}
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
              onChange={onChange}
              scroll={{
                y: "calc(100vh - 322px)",
              }}
            />
          </div>

          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: "5px",
              display: "flex",
              justifyContent: "flex-end",
              //   backgroundColor: "#fafafa"
            }}
          >
            <Button
              type="primary"
              onClick={() => console.log("Add New Student clicked")}
            >
              Upload Results
            </Button>
          </div>
        </Card>
      </Splitter.Panel>
    </Splitter>
  );
};

const ActiveStdResultsUpload = () => (
  <Flex gap="middle" vertical>
    <CustomSplitter
      style={{
        height: "calc(100vh - 163px)",
      }}
    />
  </Flex>
);
export default ActiveStdResultsUpload;
