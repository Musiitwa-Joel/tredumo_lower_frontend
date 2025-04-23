import React, { useRef, useEffect } from "react";
import { Radio, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PerfectScrollbar from "perfect-scrollbar";

import {
  selectActiveEmployeeBioDataTab,
  selectEmployeeDetails,
  selectLoadingEmployeeDetails,
  setActiveEmployeeBioDataTab,
} from "../../../store/hrSlice";
import PersonalInfo from "./PersonalInfo";
import { useQuery } from "@apollo/client";
import { LOAD_EMPLOYEE_DETAILS } from "../../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Reporting from "../Reporting";
// import AcademicInfo from "./biodata_tabs/AcademicInfo";
// import PersonalInfo from "./biodata_tabs/PersonalInfo";
// import TranscriptSettings from "./biodata_tabs/TranscriptSettings";

function BioData({ form }) {
  const dispatch = useDispatch();
  const activeBioDataTab = useSelector(selectActiveEmployeeBioDataTab);
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const loadingEmployeeDetails = useSelector(selectLoadingEmployeeDetails);

  //   console.log("employee details", employeeDetails);

  const handleTabChange = (e) => {
    dispatch(setActiveEmployeeBioDataTab(e.target.value));
  };

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

  // Update scrollbar when tab changes
  useEffect(() => {
    if (psRef.current) {
      psRef.current.update();
    }
  }, [activeBioDataTab]);

  //   if (!selectedStudent) return;

  return (
    <div>
      <Radio.Group value={activeBioDataTab} onChange={handleTabChange}>
        <Radio.Button value="personal_info">Personal Information</Radio.Button>
        <Radio.Button value="employment_info">
          Employment Information
        </Radio.Button>
        <Radio.Button value="qualifications">Qualifications</Radio.Button>
        <Radio.Button value="reporting">Reporting</Radio.Button>
      </Radio.Group>

      <div
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: 360, // Adjust this height as needed
          marginTop: 10,
          padding: 20,
          // backgroundColor: "red",
          overflow: "hidden", // Hide default scrollbars
        }}
      >
        <Spin spinning={loadingEmployeeDetails}>
          {activeBioDataTab == "personal_info" && <PersonalInfo form={form} />}
          {activeBioDataTab == "reporting" && <Reporting form={form} />}
        </Spin>
        {/* {activeBioDataTab == "academic_info" && <AcademicInfo />}
        {activeBioDataTab == "personal_info" && <PersonalInfo />}
        {activeBioDataTab == "transcript_settings" && <TranscriptSettings />} */}
      </div>
    </div>
  );
}

export default BioData;
