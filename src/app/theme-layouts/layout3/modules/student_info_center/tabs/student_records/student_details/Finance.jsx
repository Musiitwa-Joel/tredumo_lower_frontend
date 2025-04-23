import React, { useRef, useEffect } from "react";
import { Table, ConfigProvider } from "antd";
import PerfectScrollbar from "perfect-scrollbar";

const columns = [
  {
    title: "Invoice No",
    dataIndex: "invoice_no",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 150,
  },
  {
    title: "Narration",
    ellipsis: true,
    dataIndex: "narration",
    render: (text, record, index) => renderRow(record, text),
    width: 140,
  },
  {
    title: "Invoice Total",
    ellipsis: true,
    dataIndex: "invoice_total",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    ellipsis: true,
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Amount Due",
    dataIndex: "amount_due",
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, record.biodata.gender),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Date",
    dataIndex: "date",
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) =>
      renderRow(record, record.course.course_code),
    // sorter: (a, b) => a.age - b.age,
  },
];

const Finance = () => {
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
          Student Payments
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

export default Finance;
