import { useEffect, useMemo, useState } from "react";
import { Badge, ConfigProvider, Dropdown, Space, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCourseUnits,
  selectDefaultExpandedModuleRowKeys,
  selectGroupedData,
  selectLoadingCourseUnits,
  setDefaultExpandedModuleRowKeys,
  setGroupedData,
} from "../../store/progAndCoursesSlice";

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const TestTable = ({ panelWidth }) => {
  const defaultExpandedRowKeys = useSelector(
    selectDefaultExpandedModuleRowKeys
  );

  // const { courseUnits, loadingCourseUnits } = useSelector(
  //   (state) => state.progAndCourses
  // );
  const courseUnits = useSelector(selectCourseUnits);
  const loadingCourseUnits = useSelector(selectLoadingCourseUnits);
  const dispatch = useDispatch();

  const groupedData = useSelector(selectGroupedData);

  useEffect(() => {
    const grouped = {};

    courseUnits.forEach((course) => {
      const yearSemKey = `${course.course_unit_year}-${course.course_unit_sem}`;

      if (!grouped[yearSemKey]) {
        grouped[yearSemKey] = {
          course_unit_year: course.course_unit_year,
          course_unit_sem: course.course_unit_sem,
          courses: [],
        };
      }

      grouped[yearSemKey].courses.push(course);
    });

    // Convert the grouped data to an array
    let data = Object.values(grouped);

    // Sort the data based on course_unit_year and course_unit_sem
    data.sort((a, b) => {
      if (a.course_unit_year === b.course_unit_year) {
        return a.course_unit_sem - b.course_unit_sem; // Compare by semester if years are the same
      }
      return a.course_unit_year - b.course_unit_year; // Compare by year
    });

    // setGroupedData(data);
    dispatch(setGroupedData(data));

    // Set default expanded row keys based on the available data
    const expandedKeys = data.map(
      (group) => `${group.course_unit_year}-${group.course_unit_sem}`
    );
    dispatch(setDefaultExpandedModuleRowKeys(expandedKeys));
  }, [courseUnits]);

  // console.log("defaultExpandedRowKeys", defaultExpandedRowKeys);

  // const columns = [
  //   {
  //     title: "Course Code",
  //     dataIndex: "course_code",
  //     width: 120,
  //     ellipsis: true,
  //     key: "date",
  //   },
  //   {
  //     title: "Course Title",
  //     dataIndex: "course_title",
  //     width: 300,
  //     ellipsis: true,
  //     key: "ct",
  //   },
  //   {
  //     title: "Credit Units",
  //     key: "cu",
  //     dataIndex: "credit_units",
  //     width: 80,
  //   },
  //   {
  //     title: "Study Yr",
  //     dataIndex: "study_yr",
  //     key: "upgradeNum",
  //     width: 70,
  //   },
  //   {
  //     title: "Sem",
  //     dataIndex: "sem",
  //     key: "sem",
  //     width: 50,
  //   },
  //   {
  //     title: "Level",
  //     dataIndex: "level",
  //     key: "level",
  //     width: 100,
  //   },
  // ];

  const innerColumns = [
    {
      title: "Code",
      dataIndex: "course_unit_code",
      key: "course_unit_code",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Course Unit Title",
      dataIndex: "course_unit_title",
      key: "course_unit_title",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Credit Units",
      dataIndex: "credit_units",
      key: "credit_units",
      width: 80,
    },
    {
      title: "Study Yr",
      dataIndex: "course_unit_year",
      width: 70,
    },
    {
      title: "Sem",
      dataIndex: "course_unit_sem",
      key: "sem",
      width: 50,
    },
    {
      title: "Level",
      dataIndex: "course_unit_level",
      key: "course_unit_level",
      width: 70,
    },
  ];

  // Expanded row render function: reuses the same columns for inner table
  const expandedRowRender = (record) => {
    const data = [];
    // for (let i = 0; i < 3; ++i) {
    //   data.push({
    //     key: i.toString(),
    //     course_code: "BIT203939",
    //     course_title: "DATA COMMUNICATION AND NETWORKS",
    //     credit_units: "3",
    //     study_yr: "1",
    //     sem: "1",
    //     level: "elective",
    //   });
    // }
    return (
      <Table
        columns={innerColumns} // Use the same columns as outer table
        dataSource={record.courses}
        pagination={false}
        // loading={loadingCourseUnits}
        bordered
        style={{
          minWidth: panelWidth * 16.25,
          borderRadius: 0,
        }}
        tableLayout="fixed"
      />
    );
  };

  // Outer table data, each row is just a sentence like "Study Year 1"
  const outerData = [];
  for (let i = 0; i < 3; ++i) {
    outerData.push({
      key: i.toString(),
      name: `Study Year ${i + 1}`, // This will span across all columns
    });
  }

  // Customize colSpan to make the outer table row span all columns
  const outerColumns = [
    {
      title: "Year",
      dataIndex: "course_unit_year",
      key: "year",
      render: (text, record) => (
        <span
          style={{
            color: "dodgerblue",
            fontWeight: "600",
          }}
        >
          {" "}
          {`Year ${record.course_unit_year}, Semester ${record.course_unit_sem}`}
        </span>
      ),
    },
    // {
    //   title: "Semester",
    //   dataIndex: "course_unit_sem",
    //   key: "sem",
    //   render: (text, record) => `Semester ${record.course_unit_sem}`,
    // },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#f9f9f9",
            headerBorderRadius: 0,
          },
        },
      }}
    >
      <Table
        columns={outerColumns} // Outer table has only one column with colSpan
        dataSource={groupedData}
        bordered
        pagination={false}
        showHeader={false}
        loading={loadingCourseUnits}
        size="small"
        expandable={{
          expandedRowRender, // Inner table will appear when expanded
          // defaultExpandedRowKeys, // Expand rows by default
          expandedRowKeys: defaultExpandedRowKeys,
          onExpand: (expanded, record) => {
            // console.log("key", record);
            dispatch(
              setDefaultExpandedModuleRowKeys(
                expanded
                  ? [
                      ...defaultExpandedRowKeys,
                      `${record.course_unit_year}-${record.course_unit_sem}`,
                    ]
                  : defaultExpandedRowKeys.filter(
                      (key) =>
                        key !==
                        `${record.course_unit_year}-${record.course_unit_sem}`
                    )
              )
            );
          },
        }}
        rowKey={(record) =>
          `${record.course_unit_year}-${record.course_unit_sem}`
        }
        style={{
          width: "100%",
          borderColor: "lightgray",
          borderWidth: 0.5,
          borderRadius: 8,
        }}
        scroll={{
          y: "calc(100vh - 180px)",
        }}
      />
    </ConfigProvider>
  );
};

export default TestTable;
