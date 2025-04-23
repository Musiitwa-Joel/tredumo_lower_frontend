import React, { useRef, useEffect } from "react";
import { Table, ConfigProvider } from "antd";
import PerfectScrollbar from "perfect-scrollbar";

const columns = [
  {
    title: "#",
    dataIndex: "no",
    key: "index",
    width: 40,
    render: (text, record, index) => renderRow(record, index + 1),
  },
  {
    title: "Action",
    dataIndex: "action",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 200,
  },
  {
    title: "Narration",
    ellipsis: true,
    dataIndex: "narration",
    render: (text, record, index) => renderRow(record, text),
    width: 140,
  },
  {
    title: "Application",
    ellipsis: true,
    dataIndex: "application",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
  {
    title: "Action By",
    dataIndex: "action_by",
    ellipsis: true,
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Action Date",
    dataIndex: "action_date",
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, record.biodata.gender),
    // sorter: (a, b) => a.age - b.age,
  },
];

const StudentLogs = () => {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []);
  return (
    <>
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <span
          style={{
            color: "dodgerblue",
            fontSize: "1.7rem",
            fontWeight: "500",
          }}
        >
          Student Logs
        </span>
      </div>
      {/* <div
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: 360, // Adjust this height as needed
          // marginTop: 10,
          // backgroundColor: "red",
          padding: 20,
          overflow: "hidden", // Hide default scrollbars
        }}
      ></div> */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              // headerBg: "rgba(0, 0, 0, 0.04)",
              borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
              cellFontSize: 10,
              fontSize: 13,
              lineHeight: 0.8,
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={[]}
          // loading={loadingApplications |}
          rowKey="std_id"
          bordered
          sticky
          // rowSelection={rowSelection}
          // expandable={defaultExpandable}
          showHeader={true}
          tableLayout="fixed"
          size="small"
          pagination={{
            position: ["bottomRight"],
          }}
          scroll={{
            y: "calc(100vh - 200px)", // Set the same height as in the style to ensure content scrolls
            // x: "100vw",
          }}

          // scroll={{
          //   y: "calc(100vh - 370px)",
          //   x: "100vw",
          // }}
        />
      </ConfigProvider>
    </>
  );
};

export default StudentLogs;
