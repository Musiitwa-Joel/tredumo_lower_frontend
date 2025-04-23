import React, { useRef, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { List, Typography } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmployees,
  setDetailsModalVisible,
  setSelectedEmployee,
  setViewEmployeeDetails,
} from "../store/hrSlice";

const data = [
  {
    key: "1",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "2",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
  {
    key: "3",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "4",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
  {
    key: "5",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "6",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
  {
    key: "7",
    name: "PROFESSOR JUDE LUBEGA",
    employee_id: "NUA213",
    designation: "VICE CHANCELLOR",
    email: "jud@gmail.com",
    telno: "0785635363",
  },
  {
    key: "8",
    name: "MR. MULINDE HAKIN",
    employee_id: "NUA211",
    designation: "ASISTANT SYSTEM ADMINISTRATOR",
    email: "mulinde@gmail.com",
    telno: "0785635363",
  },
];

const EmployeesList = ({ loading }) => {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);

  // console.log("students", students);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      const updateScrollableHeight = () => {
        if (scrollContainerRef.current) {
          const containerHeight = scrollContainerRef.current.clientHeight;
          const contentHeight = scrollContainerRef.current.scrollHeight;
          setScrollableHeight(contentHeight - containerHeight);
        }
      };

      updateScrollableHeight();
      window.addEventListener("resize", updateScrollableHeight);

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
        window.removeEventListener("resize", updateScrollableHeight);
      };
    }
  }, []);

  //   useEffect(() => {
  //     if (psRef.current) {
  //       psRef.current.update();
  //     }
  //   }, [students]);

  // console.log("students", students);

  const handleWheel = (e) => {
    const container = scrollContainerRef.current;
    if (container) {
      const { deltaY } = e;
      const { scrollTop } = container;

      if (
        (deltaY > 0 && scrollTop >= scrollableHeight) ||
        (deltaY < 0 && scrollTop <= 0)
      ) {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      style={{
        borderWidth: 1,
        borderColor: "lightgray",
        marginTop: 7,
      }}
    >
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        style={{
          position: "relative",
          backgroundColor: "#dfe5ef",
          height: "calc(100vh - 232px)",
          padding: "10px",
          overflow: "hidden",

          // borderColor: "lightgray",
          // borderWidth: 1.2,
        }}
      >
        <List
          grid={{
            gutter: 16,
            column: 4,
          }}
          pagination={employees.length > 0}
          dataSource={employees}
          loading={loading}
          renderItem={(item) => (
            <List.Item>
              <Paper className="flex flex-col flex-auto items-center shadow rounded-2xl overflow-hidden">
                <div className="flex flex-col flex-auto w-full p-16 text-center">
                  <div className="w-130 h-128 mx-auto rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={`http://localhost:2222/api/student_image/${item.staff_id}`}
                      // src={`https://tredumo.nkumbauniversity.ac.ug:2222/api/student_image/${studentFile?.student_no}`}
                      //   src={` https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${item.student_no}`}
                      alt="member"
                    />
                  </div>
                  <Typography className="mt-10 font-medium">
                    {`${item?.salutation} ${item?.surname} ${item?.other_names}`.toUpperCase()}
                  </Typography>
                  <span style={{ color: "dodgerblue" }}>{item.staff_id}</span>
                  <Typography color="text.secondary">
                    {item.designation}
                  </Typography>
                </div>
                <div className="flex items-center w-full border-t divide-x">
                  <a
                    className="flex flex-auto items-center justify-center py-16 hover:bg-hover"
                    href={`mailto:d@gmail.com`}
                    role="button"
                  >
                    <FuseSvgIcon size={20} color="action">
                      heroicons-solid:mail
                    </FuseSvgIcon>
                    <span className="ml-8">Email</span>
                  </a>
                  <a
                    className="flex flex-auto items-center justify-center py-16 hover:bg-hover"
                    role="button"
                    onClick={() => {
                      // dispatch(setViewEmployeeDetails(true));
                      dispatch(setDetailsModalVisible(true));
                      dispatch(setSelectedEmployee(item));
                    }}
                  >
                    <FuseSvgIcon size={20} color="action">
                      heroicons-solid:view-list
                    </FuseSvgIcon>
                    <span className="ml-8">View Details</span>
                  </a>
                </div>
              </Paper>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default EmployeesList;
