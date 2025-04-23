import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tree, Input, Spin, Space, Select, Row, Col } from "antd";
import {
  GET_ALL_PROGRAMMES,
  GET_COURSE_UNITS,
} from "../../../prog_and_courses/gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { gql, NetworkStatus, useLazyQuery, useQuery } from "@apollo/client";
import "./myStyles.css";
import extractIds from "../../../prog_and_courses/utilities/extractIDs";
import {
  selectAllStudentCourses,
  selectReloadStdCourses,
  selectReloadStudents,
  selectSelectedStdInfoItem,
  selectStdInfoExpandedItems,
  selectStdInfoReqs,
  selectUserFilteredCourses,
  setAllInfoReqs,
  setAllStudentCourses,
  setLoadingStudents,
  setReloadStdCourses,
  setReloadStudents,
  setSelectedStdInfoItem,
  setStdInfoExpandedItems,
  setStdInfoReqs,
  setStudents,
  setUserFilteredCourses,
} from "../../store/infoCenterSlice";
import {
  GET_ALL_PROGRAMMES_CATEGORISED_BY_COLLEGES,
  GET_STUDENTS,
} from "../../gql/queries";
const { DirectoryTree } = Tree;
const { Search } = Input;

const LOAD_REQS = gql`
  query Query {
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

const containsSearchTerm = (str, searchTerm) =>
  str.toLowerCase().includes(searchTerm.toLowerCase());

// Main search function
function searchHierarchy(data, searchTerm) {
  function search(items) {
    return items.reduce((acc, item) => {
      let match = false;

      // Check if the current item matches
      if (
        containsSearchTerm(item.label, searchTerm) ||
        containsSearchTerm(item.code ? item.code : "", searchTerm)
      ) {
        match = true;
      }

      // Recursively search children
      const matchingChildren = item.children ? search(item.children) : [];

      // If there's a match in the current item or its children
      if (match || matchingChildren.length > 0) {
        // Create a new object with matching items, preserving the original structure
        const newItem = { ...item };

        // If there are matching children, add them to the new item
        if (matchingChildren.length > 0) {
          newItem.children = matchingChildren;
        }

        // Add the matching item to the accumulator
        acc.push(newItem);
      }

      return acc;
    }, []);
  }

  return search(data);
}

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

const titleRender = (nodeData, panelWidth) => {
  return (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: `${panelWidth - 7.954}vw`,
        // display: "flex",
      }}
    >
      <span
        style={{
          fontWeight: "500",
        }}
      >
        {nodeData.title}
      </span>
    </div>
  );
};

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const style = {
  //   background: "#0092ff",
  padding: "8px 0",
};

const AllCourses = ({ panelWidth }) => {
  const [dynamicHeight, setDynamicHeight] = useState(window.innerHeight - 290);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const stdInfoReqs = useSelector(selectStdInfoReqs);
  const dispatch = useDispatch();
  const [transformedData, setTransformedData] = useState([]);
  // const { allProgrammes, reloadCourses, addVersionModalOpen } =
  //   useSelector((state) => state.progAndCourses);
  // const [filteredProgrammes, setFilteredProgrammes] = useState(allProgrammes);
  const userFilteredCourses = useSelector(selectUserFilteredCourses);
  const expandedItems = useSelector(selectStdInfoExpandedItems);
  const allStudentCourses = useSelector(selectAllStudentCourses);
  const reloadStudents = useSelector(selectReloadStudents);
  const reloadStdCourses = useSelector(selectReloadStdCourses);
  const hasExpandedItemsDispatched = useRef(false);
  const selectedStdInfoItem = useSelector(selectSelectedStdInfoItem);

  const [
    getStudents,
    {
      error: loadStdsErr,
      loading: loadingStudents,
      data: stdRes,
      refetch: refetchStudents,
    },
  ] = useLazyQuery(GET_STUDENTS, {
    notifyOnNetworkStatusChange: true, // Essential for accurate loading state
  });

  const [
    getAllProgrammesCategorisedByCollege,
    { error, loading, data, refetch, networkStatus },
  ] = useLazyQuery(GET_ALL_PROGRAMMES_CATEGORISED_BY_COLLEGES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      campusId: null,
    },
  });

  const {
    error: reqsErr,
    loading: loadingReqs,
    data: reqsRes,
  } = useQuery(LOAD_REQS);

  const transformData = useCallback((nodes) => {
    return nodes.map((node) => ({
      key: node.id,
      title: node.code ? `(${node.code}) ${node.label}` : node.label,
      // isLeaf: !node.children || node.children.length === 0,
      isLeaf: node.__typename == "CourseVersion",
      children: node.children ? transformData(node.children) : [],
      typename: node.__typename,
      item: node,
      level: node.children ? 1 : 2,
    }));
  }, []);

  if (loadStdsErr) {
    // alert("error getting forms!");
    dispatch(
      showMessage({
        message: loadStdsErr.message,
        variant: "error",
      })
    );
  }

  if (reqsErr) {
    // alert("error getting forms!");
    dispatch(
      showMessage({
        message: reqsErr.message,
        variant: "error",
      })
    );
  }

  useEffect(() => {
    if (reqsRes && !stdInfoReqs.campus) {
      // console.log(reqsRes);
      const payload = {
        campus: reqsRes.campuses[0].id,
        intake: reqsRes.intakes[0].id,
        acc_yr: reqsRes.acc_yrs[0].id,
      };

      dispatch(setStdInfoReqs(payload));
    }
    if (reqsRes) {
      dispatch(setAllInfoReqs(reqsRes));
    }
  }, [reqsRes]);

  useEffect(() => {
    if (stdInfoReqs) {
      _getProgrammesCategorisedByCollege(stdInfoReqs.campus);
    }
  }, [stdInfoReqs]);

  const _getProgrammesCategorisedByCollege = async (campus_id) => {
    const res = await getAllProgrammesCategorisedByCollege({
      variables: {
        campusId: campus_id,
      },
    });

    // console.log("res", res.data);
  };

  // console.log("dynamic height", dynamicHeight);

  const updateHeight = () => {
    const newHeight = window.innerHeight - 290; // Subtracting 100px for any padding/header/etc.
    setDynamicHeight(newHeight);
  };

  useEffect(() => {
    // Update the height initially
    updateHeight();

    // Listen for screen resize events
    window.addEventListener("resize", updateHeight);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  if (error) {
    dispatch(
      showMessage({
        message: error.message,
        variant: "error",
      })
    );
  }

  const _reloadStdCourses = async () => {
    if (reloadStdCourses) {
      const res = await refetch();
      dispatch(setAllStudentCourses(res.data.colleges));
      if (networkStatus === NetworkStatus.refetch) {
        console.log("Refetching...");
      }
      dispatch(setReloadStdCourses(false));
    }
  };

  useEffect(() => {
    _reloadStdCourses();
  }, [reloadStdCourses]);

  const _reloadStudents = async () => {
    if (reloadStudents) {
      const res = await refetchStudents();

      // console.log("res", res.data.students);
      dispatch(setStudents(res.data.students));
      if (networkStatus === NetworkStatus.refetch) {
        console.log("Refetching...");
      }
      dispatch(setReloadStudents(false));
    }
  };

  useEffect(() => {
    _reloadStudents();
  }, [reloadStudents]);

  // console.log("the data", data);

  useEffect(() => {
    if (data) {
      dispatch(setAllStudentCourses(data.colleges));
      const searchResult = searchHierarchy(data.colleges, searchValue);

      // Instead of updating the original data, update filtered data
      // dispatch(updateFilteredProgrammes(searchResult));
      dispatch(setUserFilteredCourses(searchResult));
      // dispatch(updateExpandedItems(extractIds(data.schools)));

      // Dispatch updateExpandedItems only once
      if (!hasExpandedItemsDispatched.current) {
        dispatch(setStdInfoExpandedItems(extractIds(data.colleges)));
        hasExpandedItemsDispatched.current = true; // Set to true after dispatch
      }
    }
  }, [data, dispatch]);

  // console.log("all programs", allProgrammes);

  useEffect(() => {
    dispatch(setLoadingStudents(loadingStudents));
  }, [loadingStudents]);

  const onSelect = async (keys, info) => {
    // console.log("Trigger Select", keys, info);

    if (info.selectedNodes[0].typename == "CourseVersion") {
      dispatch(setSelectedStdInfoItem(info.selectedNodes[0].item));

      await fetchStudents(info.selectedNodes[0].item.id);
    }
  };

  const fetchStudents = async (courseVersionId) => {
    const payload = {
      campus: stdInfoReqs.campus,
      intake: stdInfoReqs.intake,
      accYr: stdInfoReqs.acc_yr,
      courseVersion: courseVersionId,
      sic: true,
    };

    // console.log("payload", payload);

    const res = await getStudents({
      variables: payload,
    });

    // console.log("students", res.data);

    if (res.data) {
      dispatch(setStudents(res.data.students));
    }
  };

  useEffect(() => {
    if (selectedStdInfoItem) {
      fetchStudents(selectedStdInfoItem.id);
    }
  }, [stdInfoReqs]);
  // const onExpand = (keys, info) => {
  //   // console.log("Trigger Expand", keys, info);
  //   // setExpandedKeys(keys);
  //   dispatch(updateExpandedItems(keys));
  // };

  // Memoized transformed tree data
  const memoizedTreeData = useMemo(
    () => transformData(userFilteredCourses || []),
    [userFilteredCourses]
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Perform the search on the original allProgrammes data
    const searchResult = searchHierarchy(allStudentCourses, value);

    // Instead of updating the original data, update filtered data
    // dispatch(updateFilteredProgrammes(searchResult));
    dispatch(setUserFilteredCourses(searchResult));
    // console.log("result", searchResult);
  };

  // console.log("allcourses", allProgrammes);

  // // Filtered tree data based on search
  // const filteredTreeData = useMemo(() => {
  //   return searchValue
  //     ? filterTreeData(memoizedTreeData, searchValue, 2) // 2 is the bottom-most level
  //     : memoizedTreeData;
  // }, [searchValue, memoizedTreeData]);

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
    dispatch(setStdInfoExpandedItems(newExpandedKeys));
  };

  // console.log(filteredTreeData);

  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#fff",
        borderTopColor: "lightgray",
        borderTopWidth: 1,
        // height: "calc(100vh - 155px)",
      }}
    >
      <Spin
        tip="Loading Courses..."
        spinning={loading}
        style={{
          height: "calc(100vh)",
          // backgroundColor: "red",
        }}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <div
              style={{
                paddingBottom: 8,
              }}
            >
              <Select
                size="default"
                placeholder="Campus"
                value={stdInfoReqs.campus}
                loading={loadingReqs}
                onChange={async (value) => {
                  dispatch(
                    setStdInfoReqs({
                      campus: value,
                    })
                  );
                  await _getProgrammesCategorisedByCollege(value);
                }}
                style={{
                  width: "100%",
                }}
                options={
                  reqsRes
                    ? reqsRes.campuses.map((campus) => ({
                        value: campus.id,
                        label: `${campus.campus_title} CAMPUS`,
                      }))
                    : []
                }
              />
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div
              style={{
                paddingBottom: 8,
              }}
            >
              <Select
                placeholder="Intake"
                size="default"
                value={stdInfoReqs.intake}
                loading={loadingReqs}
                onChange={async (value) => {
                  dispatch(
                    setStdInfoReqs({
                      intake: value,
                    })
                  );

                  // check the user has already selected the version
                  if (selectedStdInfoItem) {
                    await fetchStudents(selectedStdInfoItem.id);
                  }
                }}
                style={{
                  width: "100%",
                }}
                options={
                  reqsRes
                    ? reqsRes.intakes.map((intake) => ({
                        value: intake.id,
                        label: `${intake.intake_title} INTAKE`,
                      }))
                    : []
                }
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <div
              style={{
                paddingBottom: 8,
              }}
            >
              <Select
                size="default"
                placeholder="acc_yr"
                value={stdInfoReqs.acc_yr}
                loading={loadingReqs}
                onChange={async (value) => {
                  dispatch(
                    setStdInfoReqs({
                      acc_yr: value,
                    })
                  );

                  // check the user has already selected the version
                  if (selectedStdInfoItem) {
                    await fetchStudents(selectedStdInfoItem.id);
                  }
                }}
                style={{
                  width: "100%",
                }}
                options={
                  reqsRes
                    ? reqsRes.acc_yrs.map((acc) => ({
                        value: acc.id,
                        label: `${acc.acc_yr_title}`,
                      }))
                    : []
                }
              />
            </div>
          </Col>
        </Row>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={onSearchChange}
        />
        <div>
          <DirectoryTree
            //   multiple
            // defaultExpandAll
            showLine={true}
            height={dynamicHeight}
            onSelect={onSelect}
            onExpand={onExpand}
            expandedKeys={expandedItems}
            // treeData={memoizedTreeData ? memoizedTreeData : []}
            autoExpandParent={autoExpandParent}
            treeData={memoizedTreeData}
            showIcon={true}
            icon={(item) =>
              item.data.typename == "CourseVersion" ? (
                <FileIcon />
              ) : item.expanded ? (
                <DirectoryOpenIcon />
              ) : (
                <DirectoryClosedIcon />
              )
            }
            titleRender={(item) => titleRender(item, panelWidth)}
          />
        </div>
      </Spin>
    </div>
  );
};
export default AllCourses;
