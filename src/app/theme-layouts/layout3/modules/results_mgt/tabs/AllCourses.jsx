import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Typography,
  Space,
  Select,
  Row,
  Col,
  Divider,
  Tree,
  Input,
  ConfigProvider,
  Spin,
  Form,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { RefreshCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { GET_ALL_COURSES, LOAD_RESULTS } from "../gql/queries";
import {
  selectResultsConfigurations,
  selectSelectedSem,
  selectSelectedStudyYr,
  setLoadingResults,
  setResults,
  setSelectedSem,
  setSelectedStudyYr,
  setSelectedTreeItem,
} from "../store/resultsSlice";
const { DirectoryTree } = Tree;
const { Search } = Input;

const DirectoryOpenIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="octicon octicon-file-directory-open-fill"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#54aeff"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z" />
  </svg>
));

const DirectoryClosedIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="octicon octicon-file-directory-fill"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#54aeff"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
  </svg>
));

const FileIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    className="octicon octicon-file"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#636c76"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
  </svg>
));

const LOAD_REQS = gql`
  query loadReqs {
    campuses {
      id
      campus_title
    }
    intakes {
      id
      intake_title
    }
    acc_yrs {
      id
      acc_yr_title
    }
  }
`;

const titleRender = (nodeData, panelWidth) => {
  //   console.log("panel width", panelWidth);
  return (
    // <div
    //   style={{
    //     whiteSpace: "nowrap",
    //     overflow: "hidden",
    //     textOverflow: "ellipsis",
    //     //   maxWidth: `${panelWidth * 10.4}px`,
    //     // display: "flex",
    //   }}
    // >
    //   <span
    //     style={{
    //       fontWeight: "500",
    //     }}
    //   >
    <Typography.Text
      ellipsis
      style={{
        fontWeight: "500",
        width: panelWidth - 70,
      }}
    >
      {nodeData.title}
    </Typography.Text>

    //   </span>
    // </div>
  );
};

function AllCourses({ panelWidth }) {
  const {
    error: loadErr,
    loading: loadingReqs,
    data: loadRes,
  } = useQuery(LOAD_REQS);
  const configurations = useSelector(selectResultsConfigurations);
  const selectedStudyYr = useSelector(selectSelectedStudyYr);
  const selectedSem = useSelector(selectSelectedSem);
  const [dynamicHeight, setDynamicHeight] = useState(window.innerHeight - 235);

  const dispatch = useDispatch();
  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_ALL_COURSES,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        campusId: null,
      },
    }
  );

  const [
    loadResults,
    { error: loadResultsErr, loading: loadingResults, data: loadResultsRes },
  ] = useLazyQuery(LOAD_RESULTS);

  const mapDataToTree = (schools) => {
    return schools.map((school) => ({
      key: school.id,
      title: (
        //   <span
        //     style={{
        //       color: "maroon",
        //     }}
        //   >{`(${school.school_code}) ${school.school_title}`}</span>
        <Typography.Text
          ellipsis
          style={{
            fontWeight: "500",
            width: panelWidth - 70,
            color: "maroon",
          }}
        >
          {`(${school.school_code}) ${school.school_title}`}
        </Typography.Text>
      ),
      level: 1,
      children: school.courses.map((course) => ({
        key: course.id,
        title: (
          // <span
          //   style={{
          //     color: "purple",
          //   }}
          // >{`${course.course_code} - ${course.course_title}`}</span>
          <Typography.Text
            ellipsis
            style={{
              fontWeight: "500",
              width: panelWidth - 90,
              color: "purple",
            }}
          >
            {`${course.course_code} - ${course.course_title}`}
          </Typography.Text>
        ),
        level: 2,
        children: course.course_versions.map((course_version) => ({
          key: course_version.id,
          title: (
            <Typography.Text
              ellipsis
              style={{
                fontWeight: "500",
                width: panelWidth - 90,
                color: "green",
              }}
            >
              {`${course_version.version_title}`}
            </Typography.Text>
          ),
          level: 3,
          isLeaf: true,
          details: {
            course_id: course.id,
            course_code: course.course_code,
            course_title: course.course_title,
            school_id: school.id,
            school_title: school.school_title,
            course_version_title: course_version.version_title,
            course_version_id: course_version.id,
          },
        })),
      })),
    }));
  };

  const updateHeight = () => {
    const newHeight = window.innerHeight - 235; // Subtracting 100px for any padding/header/etc.
    setDynamicHeight(newHeight);
  };

  useEffect(() => {
    // Update the height initially
    updateHeight;

    // Listen for screen resize events
    window.addEventListener("resize", updateHeight);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (loadResultsErr) {
      dispatch(
        showMessage({
          message: loadResultsErr.message,
          variant: "error",
        })
      );
    }
  }, [error, loadErr, loadResultsErr]);

  useEffect(() => {
    dispatch(setLoadingResults(loadingResults));
  }, [loadingResults]);

  const onSelect = async (keys, info) => {
    if (info.selectedNodes[0].isLeaf) {
      // console.log({
      //   key: info.selectedNodes[0].key,
      //   isLeaf: info.selectedNodes[0].isLeaf,
      //   details: info.selectedNodes[0].details,
      //   level: info.selectedNodes[0].level,
      // });
      // console.log("configurations", configurations);
      dispatch(
        setSelectedTreeItem({
          key: info.selectedNodes[0].key,
          isLeaf: info.selectedNodes[0].isLeaf,
          details: info.selectedNodes[0].details,
          level: info.selectedNodes[0].level,
        })
      );

      const payload = {
        payload: {
          course_id: info.selectedNodes[0].details.course_id,
          course_version_id: info.selectedNodes[0].key,
          campus_id: configurations.campus_id,
          acc_yr_id: configurations.acc_yr_id,
          intake: configurations.intake_id ? configurations.intake_id : "all",
          study_time: configurations.study_time_id
            ? configurations.study_time_id
            : "all",
          sem: selectedSem,
          study_yr: selectedStudyYr,
        },
        studyYr: selectedStudyYr,
        sem: selectedSem,
      };

      // console.log("payload", payload);

      // load the results asynchronously
      const res = await loadResults({
        variables: payload,
      });

      dispatch(setResults(res.data.results));
    }
  };
  const onExpand = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const memoizedTreeData = useMemo(
    () => mapDataToTree(data?.schools || []),
    [data, panelWidth]
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "rgb(198, 227, 255)",
          alignItems: "center",
          padding: 5,
        }}
      >
        <Typography.Title
          //   type="secondary"
          level={5}
          style={{
            whiteSpace: "nowrap",
            padding: 0,
            margin: 0,
          }}
        >
          All Courses
        </Typography.Title>

        <Button
          type="primary"
          size="small"
          ghost
          icon={<RefreshCcw size={16} />}
        ></Button>
      </div>
      <div
        style={{
          padding: 5,
        }}
      >
        <Form>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Study Year"
                name="study_yr"
                initialValue={selectedStudyYr}
              >
                <Select
                  placeholder="Study Yr"
                  onChange={(value) => dispatch(setSelectedStudyYr(value))}
                >
                  {Array.from({ length: 8 }, (_, index) => (
                    <Option value={`${index + 1}`}>{`${index + 1}`}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={12}>
              <Form.Item label="Sem" name="sem" initialValue={selectedSem}>
                <Select
                  placeholder="Sem"
                  onChange={(value) => dispatch(setSelectedSem(value))}
                >
                  {Array.from({ length: 2 }, (_, index) => (
                    <Option value={`${index + 1}`}>{`${index + 1}`}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <Search
              placeholder="Search Course..."
              allowClear
              //   onSearch={onSearch}
              style={{
                marginTop: 5,
                width: "100%",
              }}
            />
          </Col>
        </Row>
      </div>
      <Divider
        style={{
          padding: 0,
          margin: 0,
          marginTop: 5,
          marginBottom: 0,
          backgroundColor: "rgb(198, 227, 255)",
        }}
      />

      <Spin spinning={loading}>
        <div
          style={{
            backgroundColor: "#fff",
            height: "calc(100vh - 230px)",
            overflow: "hidden",
          }}
        >
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  directoryNodeSelectedBg: "rgb(30,144,255, 0.2)",
                },
              },
            }}
          >
            <DirectoryTree
              //   multiple
              // defaultExpandAll
              showLine={true}
              height={dynamicHeight}
              onSelect={onSelect}
              // onExpand={onExpand}
              //   expandedKeys={expandedItems}
              switcherIcon={
                <CaretDownOutlined
                  color="black"
                  style={{
                    color: "gray",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                />
              }
              // treeData={memoizedTreeData ? memoizedTreeData : []}
              //   autoExpandParent={autoExpandParent}
              treeData={memoizedTreeData}
              showIcon={true}
              icon={(item) =>
                item.data.isLeaf ? (
                  <FileIcon />
                ) : item.expanded ? (
                  <DirectoryOpenIcon />
                ) : (
                  <DirectoryClosedIcon />
                )
              }
              titleRender={(item) => titleRender(item, panelWidth)}
            />
          </ConfigProvider>
        </div>
      </Spin>
    </div>
  );
}

export default AllCourses;
