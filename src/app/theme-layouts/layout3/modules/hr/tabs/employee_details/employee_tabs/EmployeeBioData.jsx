import React, { useRef } from "react";
import { Badge, Descriptions, Spin, Tooltip } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { useSelector } from "react-redux";

const EmployeeBioData = () => {
  const scrollContainerRef = useRef(null);
  const psRef = React.useRef(null);

  let items = [
    {
      key: "1",
      label: "Surname",
      children: "LUBEGA",
      span: 1,
    },
    {
      key: "2",
      label: "Other Names",
      children: "JUDE",
      span: 1,
    },
    {
      key: "3",
      label: "Staff ID",
      children: "NUA213",
      span: 1,
    },
    {
      key: "4",
      label: "Status",
      children: true ? (
        <Badge
          status={true ? "processing" : "error"}
          text={true ? "Active" : "Inactive"}
        />
      ) : null,
      span: 1,
    },
    {
      key: "5",
      label: "Designation",
      children: "Vice Chancellor",
      span: 1,
    },

    {
      key: "7",
      label: "Gender",
      children: "M",
      span: 1,
    },
    {
      key: "8",
      label: "Join Date",
      children: "MON 09 JULY 2023",
      span: 1,
    },
    {
      key: "9",
      label: "Email",
      children: "jud@gmail.com",
      span: 1,
    },
    {
      key: "15",
      label: "Tel No",
      children: "0378377848983",
      span: 1,
    },
    {
      key: "10",
      label: "Nationality",
      children: "UGANDAN",
      span: 1,
    },

    {
      key: "16",
      label: "Address",
      children: "Entebbe, Wakiso",
      span: 1,
    },

    {
      key: "23",
      label: "Religion",
      children: "PROTESTANT",

      span: 1,
    },
    {
      key: "24",
      label: "Date Of Birth",
      children: "1974-05-09",
      span: 1,
    },
    {
      key: "25",
      label: "College",
      children: "NKUMBA",
      span: 1,
    },
    {
      key: "27",
      label: "School Title",
      children: "School of Computing and Informatics",
      span: 1,
    },
    {
      key: "26",
      label: "School Code",
      children: "SCI",
      span: 1,
    },
    {
      key: "28",
      label: "Department",
      children: "DCS",
      span: 1,
    },
    {
      key: "29",
      label: "Campus",
      children: "MAIN",
      span: 1,
    },
  ];

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
  return (
    <div
      ref={scrollContainerRef}
      style={{
        // marginTop: 10,
        // backgroundColor: "red",
        overflow: "hidden",
        position: "relative",
        height: "calc(100vh - 230px)",
      }}
    >
      <Descriptions
        size="small"
        column={2}
        bordered
        items={items}
        labelStyle={{
          backgroundColor: "#e7edfe",
          color: "#0832b7",
          fontWeight: "bold",
          width: "20%",
        }}
        contentStyle={{
          //   backgroundColor: "red",
          width: "38%",
        }}
      />
    </div>
  );
};
export default EmployeeBioData;
