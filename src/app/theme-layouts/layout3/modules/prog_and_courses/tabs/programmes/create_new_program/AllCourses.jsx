import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tree, Input, Spin, ConfigProvider, Modal } from "antd";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import {
  GET_ALL_PROGRAMMES,
  GET_COURSE_UNITS,
  LOAD_COURSE_VERSION_DETAILS,
} from "../../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  NetworkStatus,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import "../myStyles.css";
import extractIds from "../../../utilities/extractIDs";
import {
  selectAddVersionModalOpen,
  selectAllProgrammes,
  selectExpandedItems,
  selectFilteredProgrammes,
  selectReloadCourses,
  selectSearchValue,
  setCourseUnits,
  setCourseVersionDetails,
  setCourseVersionToEdit,
  setFilteredProgrammes,
  setLoadingCourseUnits,
  setReloadCourses,
  setSearchValue,
  setSelectedCourseVersion,
  setSelectedItem,
  updateAllProgrammes,
  updateExpandedItems,
} from "../../../store/progAndCoursesSlice";
import "react-contexify/ReactContexify.css";
import { Delete, Trash2 } from "lucide-react";
import { DELETE_COURSE, DELETE_COURSE_VERSION } from "../../../gql/mutations";
const { DirectoryTree } = Tree;
const { Search } = Input;

const findParent = (treeData, key) => {
  for (const node of treeData) {
    if (node.children?.some((child) => child.id === key)) {
      return node; // Parent found
    }
    const parent = node.children && findParent(node.children, key);
    if (parent) {
      return parent;
    }
  }
  return null; // Parent not found
};

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
  const calculatedWidth = panelWidth * 10.8;
  // console.log(panelWidth)
  // console.log("inner width", innerWidth - 2600);
  // console.log("pannel", panelWidth * 10.8);
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

const filterTreeData = (treeData, searchValue, bottomMostLevel) => {
  const matches = (node) =>
    node.title.toLowerCase().includes(searchValue.toLowerCase());

  const filterNodes = (nodes, currentLevel) => {
    const filtered = [];
    nodes.forEach((node) => {
      // Determine if this node or its children should be included
      const shouldInclude =
        matches(node) || (node.children && node.children.length);
      const children = node.children
        ? filterNodes(node.children, currentLevel + 1)
        : [];

      if (shouldInclude || children.length || currentLevel < bottomMostLevel) {
        filtered.push({
          ...node,
          children,
        });
      }
    });
    return filtered;
  };

  return filterNodes(treeData, 1); // Starting level can be set here
};

const MENU_ID = "blahblah";
const MENU_ID2 = "course";

const AllCourses = memo(({ panelWidth }) => {
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [versionToDelete, setVersionToDelete] = useState(null);
  const [deleteTheCourse, { error: deleteErr, loading: deletingCourse }] =
    useMutation(DELETE_COURSE, {
      refetchQueries: ["getAllProgrammesCategorisedBySchools"],
    });

  const [
    deleteTheCourseVersion,
    { error: deleteVersionErr, loading: deletingCourseVersion },
  ] = useMutation(DELETE_COURSE_VERSION, {
    refetchQueries: ["getAllProgrammesCategorisedBySchools"],
  });
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const { show: showCourseMenu } = useContextMenu({
    id: MENU_ID2,
  });

  function handleContextMenu(event) {
    show({
      event,
      props: {
        key: "value",
      },
    });
  }

  function handleContextMenu2(event) {
    showCourseMenu({
      event,
      props: {
        key: "value",
      },
    });
  }

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;

    Modal.confirm({
      title: "Do you want to delete this course?",
      content:
        "This action is only allowed if no students have enrolled in this course yet! Do you want to delete?",
      onOk() {
        deleteCourse();
      },
      okText: "Delete",
      okButtonProps: {
        danger: true,
        loading: deletingCourse,
        disabled: deletingCourse,
      },
      centered: true,
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDeleteCourseVersion = () => {
    if (!versionToDelete) return;

    Modal.confirm({
      title: "Do you want to delete this course version?",
      content:
        "This action is only allowed if no students have enrolled in this course version yet! Do you want to delete?",
      onOk() {
        deleteCourseVersion();
      },
      okText: "Delete",
      okButtonProps: {
        danger: true,
        loading: deletingCourse,
        disabled: deletingCourse,
      },
      centered: true,
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const deleteCourse = async () => {
    console.log("course", courseToDelete);
    const res = await deleteTheCourse({
      variables: {
        courseId: courseToDelete.key,
      },
    });

    dispatch(
      showMessage({
        message: res.data.deleteCourse.message,
        varaint: "Success",
      })
    );
  };

  const deleteCourseVersion = async () => {
    // console.log("course", courseToDelete);
    const res = await deleteTheCourseVersion({
      variables: {
        courseVersionId: versionToDelete.key,
      },
    });

    // console.log("res", res.data);
    dispatch(
      showMessage({
        message: res.data.deleteCourseVersion.message,
        varaint: "Success",
      })
    );
  };

  const handleItemClick = ({ id, event, props }) => {
    switch (id) {
      case "delete_course":
        handleDeleteCourse();
        break;
      case "delete_course_version":
        console.log("delete course version...");
        handleDeleteCourseVersion();
        break;
      //etc...
    }
  };
  const [dynamicHeight, setDynamicHeight] = useState(window.innerHeight - 215);
  // const [searchValue, setSearchValue] = useState("");
  const searchValue = useSelector(selectSearchValue);
  const dispatch = useDispatch();

  // const { allProgrammes, expandedItems, reloadCourses, addVersionModalOpen } =
  //   useSelector((state) => state.progAndCourses);

  const allProgrammes = useSelector(selectAllProgrammes);
  const expandedItems = useSelector(selectExpandedItems);
  const reloadCourses = useSelector(selectReloadCourses);
  const addVersionModalOpen = useSelector(selectAddVersionModalOpen);
  // const [filteredProgrammes, setFilteredProgrammes] = useState(allProgrammes);
  const filteredProgrammes = useSelector(selectFilteredProgrammes);
  const hasExpandedItemsDispatched = useRef(false);
  const [
    getCourseUnits,
    { error: loadErr, loading: loadingCourseUnits, data: cuRes },
  ] = useLazyQuery(GET_COURSE_UNITS, {
    notifyOnNetworkStatusChange: true, // Essential for accurate loading state
    fetchPolicy: "network-only",
  });

  const [
    loadCourseVersionDetails,
    { error: versionErr, loading: loadingVersionDetails, data: versionRes },
  ] = useLazyQuery(LOAD_COURSE_VERSION_DETAILS, {
    notifyOnNetworkStatusChange: true, // Essential for accurate loading state
    fetchPolicy: "network-only",
  });

  const transformData = useCallback((nodes) => {
    // console.log("nodes", nodes);
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

  useEffect(() => {
    if (loadErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (versionErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: versionErr.message,
          variant: "error",
        })
      );
    }

    if (deleteVersionErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: deleteVersionErr.message,
          variant: "error",
        })
      );
    }
  }, [loadErr, versionErr, deleteVersionErr]);

  // console.log("dynamic height", dynamicHeight);

  const updateHeight = () => {
    const newHeight = window.innerHeight - 215; // Subtracting 100px for any padding/header/etc.
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

  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_ALL_PROGRAMMES,
    {
      notifyOnNetworkStatusChange: true,
    }
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

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [deleteErr, error]);

  const _reloadCourses = async () => {
    if (reloadCourses) {
      const res = await refetch();
      // console.log("res", res.data);
      dispatch(setFilteredProgrammes(res.data.schools));
      if (networkStatus === NetworkStatus.refetch) {
        console.log("Refetching...");
      }
      dispatch(setReloadCourses(false));
    }
  };

  useEffect(() => {
    _reloadCourses();
  }, [reloadCourses]);

  useEffect(() => {
    if (data) {
      dispatch(updateAllProgrammes(data.schools));
      dispatch(setFilteredProgrammes(data.schools));
      const searchResult = searchHierarchy(data.schools, searchValue);

      dispatch(setFilteredProgrammes(searchResult));
      // dispatch(updateExpandedItems(extractIds(data.schools)));

      // Dispatch updateExpandedItems only once
      if (!hasExpandedItemsDispatched.current) {
        dispatch(updateExpandedItems(extractIds(data.schools)));
        hasExpandedItemsDispatched.current = true; // Set to true after dispatch
      }
    }
  }, [data]);

  // console.log("all programs", allProgrammes);

  useEffect(() => {
    dispatch(setLoadingCourseUnits(loadingCourseUnits));
    // dispatch(setFilteredProgrammes(data.schools));
  }, [loadingCourseUnits, loadingVersionDetails]);

  useEffect(() => {
    if (cuRes) {
      dispatch(setCourseUnits(cuRes.course_units));
    }
  }, [cuRes]);

  const onSelect = async (keys, info) => {
    // console.log("Trigger Select", keys, info);

    const parentNode = findParent(
      filteredProgrammes,
      info.selectedNodes[0].key
    );

    dispatch(setSelectedItem(info.selectedNodes[0]));
    // console.log("parent ", {
    //   parent: parentNode,
    //   selected: info.selectedNodes[0].item,
    // });

    if (info.selectedNodes[0].typename == "CourseVersion") {
      // dispatch(setSelectedCourseVersion(info.selectedNodes[0].item));

      dispatch(
        setSelectedCourseVersion({
          parent: parentNode,
          selected: info.selectedNodes[0].item,
        })
      );

      dispatch(setCourseVersionToEdit(info.selectedNodes[0].item));

      const res = await getCourseUnits({
        variables: {
          courseVersionId: info.selectedNodes[0].key,
        },
      });

      // load the version details as well
      const res2 = await loadCourseVersionDetails({
        variables: {
          courseVersionId: info.selectedNodes[0].key,
        },
      });

      // console.log("version details", res2.data);

      if (res.data) {
        dispatch(setCourseUnits(res.data.course_units));
      }

      if (res2.data) {
        dispatch(setCourseVersionDetails(res2.data.course_version_details));
      }
    }
  };
  // const onExpand = (keys, info) => {
  //   // console.log("Trigger Expand", keys, info);
  //   // setExpandedKeys(keys);
  //   dispatch(updateExpandedItems(keys));
  // };

  // Memoized transformed tree data
  const memoizedTreeData = useMemo(
    () => transformData(filteredProgrammes || []),
    [filteredProgrammes]
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    // setSearchValue(value);
    dispatch(setSearchValue(value));

    // Perform the search on the original allProgrammes data
    const searchResult = searchHierarchy(allProgrammes, value);

    // Instead of updating the original data, update filtered data
    // dispatch(updateFilteredProgrammes(searchResult));
    // setFilteredProgrammes(searchResult);
    dispatch(setFilteredProgrammes(searchResult));
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
    // console.log("expansions", newExpandedKeys);
    // setExpandedKeys(newExpandedKeys);
    // setAutoExpandParent(false);
    dispatch(updateExpandedItems(newExpandedKeys));
  };

  // console.log(memoizedTreeData);

  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#fff",
        borderTopColor: "lightgray",
        borderTopWidth: 1,
        height: "calc(100vh - 155px)",
      }}
    >
      <Spin
        tip="Loading Courses..."
        spinning={loading || deletingCourse || deletingCourseVersion}
        style={{
          height: "calc(100vh)",
          // backgroundColor: "red",
        }}
      >
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={onSearchChange}
          value={searchValue}
        />
        <div>
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  directoryNodeSelectedBg: "#c7deff",
                  directoryNodeSelectedColor: "black",
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
              onExpand={onExpand}
              expandedKeys={expandedItems}
              onRightClick={({ event, node }) => {
                if (node.isLeaf) {
                  setVersionToDelete(node);
                  handleContextMenu(event);
                } else if (node.item.__typename == "Course") {
                  // delete course
                  setCourseToDelete(node);
                  handleContextMenu2(event);
                }
              }}
              autoExpandParent={false}
              // defaultExpandedKeys={expandedItems}
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
          </ConfigProvider>
        </div>
      </Spin>

      <Menu id={MENU_ID}>
        <Item id="delete_course_version" onClick={handleItemClick}>
          <Trash2
            size={18}
            style={{
              marginRight: 5,
            }}
          />
          Delete Course Version
        </Item>
      </Menu>

      <Menu id={MENU_ID2}>
        <Item id="delete_course" onClick={handleItemClick}>
          <Trash2
            size={18}
            style={{
              marginRight: 5,
            }}
          />
          Delete Course
        </Item>
      </Menu>
    </div>
  );
});
export default AllCourses;
