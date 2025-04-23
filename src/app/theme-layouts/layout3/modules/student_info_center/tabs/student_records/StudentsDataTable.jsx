import { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Table, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoadingStudents,
  selectStudents,
  setSelectedStudent,
  setShowInfoModal,
} from "../../store/infoCenterSlice";

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

const getUniqueStudyYears = (students) => {
  const uniqueStudyYears = Array.from(
    new Set(students.map((student) => student.study_yr))
  )
    .sort((a, b) => a - b) // Sorting numerically
    .map((study_yr) => ({ study_yr }));

  return uniqueStudyYears;
};

const StudentDataTable = ({ panelWidth }) => {
  const dispatch = useDispatch();
  const students = useSelector(selectStudents);
  const uniqueStudyYears = getUniqueStudyYears(students);
  const loadingStudents = useSelector(selectLoadingStudents);

  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState(
    uniqueStudyYears.map((year) => year.study_yr)
  );

  // useEffect(() => {
  //   const grouped = {};

  //   courseUnits.forEach((course) => {
  //     const yearSemKey = `${course.course_unit_year}-${course.course_unit_sem}`;

  //     if (!grouped[yearSemKey]) {
  //       grouped[yearSemKey] = {
  //         course_unit_year: course.course_unit_year,
  //         course_unit_sem: course.course_unit_sem,
  //         courses: [],
  //       };
  //     }

  //     grouped[yearSemKey].courses.push(course);
  //   });

  //   // Convert the grouped data to an array
  //   let data = Object.values(grouped);

  //   // Sort the data based on course_unit_year and course_unit_sem
  //   data.sort((a, b) => {
  //     if (a.course_unit_year === b.course_unit_year) {
  //       return a.course_unit_sem - b.course_unit_sem; // Compare by semester if years are the same
  //     }
  //     return a.course_unit_year - b.course_unit_year; // Compare by year
  //   });

  //   setGroupedData(data);

  //   // Set default expanded row keys based on the available data
  //   const expandedKeys = data.map(
  //     (group) => `${group.course_unit_year}-${group.course_unit_sem}`
  //   );
  //   setDefaultExpandedRowKeys(expandedKeys);
  // }, [courseUnits]);

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
      title: "#",
      dataIndex: "#",
      key: "#",
      render: (text, record, index) => index + 1,
      width: 50,
      ellipsis: true,
    },
    {
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name",
      render: (text, record) =>
        `${record.biodata.surname} ${record.biodata.other_names}`,
      width: 300,
      ellipsis: true,
    },
    {
      title: "Student No",
      dataIndex: "student_no",
      key: "student_no",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Registration No",
      dataIndex: "registration_no",
      key: "registration_no",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Study Time",
      dataIndex: "study_time_title",
      width: 100,
      ellipsis: true,
    },
  ];

  // Expanded row render function: reuses the same columns for inner table
  const expandedRowRender = (record) => {
    const _students = students.filter((std) => std.study_yr == record.study_yr);

    return (
      <Table
        columns={innerColumns} // Use the same columns as outer table
        dataSource={_students}
        rowKey={"student_no"}
        pagination={false}
        size="small"
        onRow={(record, index) => ({
          onDoubleClick: () => {
            // console.log("record", record);
            dispatch(setSelectedStudent(record));
            dispatch(setShowInfoModal(true));
          },
        })}
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
          {`Study Year ${record.study_yr}`}
          {/* {`Year ${record.course_unit_year}, Semester ${record.course_unit_sem}`} */}
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
        algorithm: theme.compactAlgorithm,
      }}
    >
      <Table
        columns={outerColumns} // Outer table has only one column with colSpan
        dataSource={uniqueStudyYears}
        bordered
        showHeader={false}
        loading={loadingStudents}
        size="small"
        expandable={{
          expandedRowRender, // Inner table will appear when expanded
          // defaultExpandedRowKeys, // Expand rows by default
          expandedRowKeys: defaultExpandedRowKeys,
          onExpand: (expanded, record) => {
            setDefaultExpandedRowKeys(
              expanded
                ? [...defaultExpandedRowKeys, `${record.study_yr}`]
                : defaultExpandedRowKeys.filter(
                    (key) => key !== `${record.study_yr}`
                  )
            );
          },
        }}
        rowKey={`study_yr`}
        style={{
          width: "100%",
          borderColor: "lightgray",
          // borderWidth: 1,
        }}
        pagination={false}
        scroll={{
          y: "calc(100vh - 245px)",
        }}
      />
    </ConfigProvider>
  );
};

export default StudentDataTable;
