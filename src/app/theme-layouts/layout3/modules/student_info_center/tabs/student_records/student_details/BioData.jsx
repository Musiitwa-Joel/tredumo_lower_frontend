import React, { useRef, useEffect } from "react";
import { Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PerfectScrollbar from "perfect-scrollbar";
import {
  selectActiveBioDataTab,
  selectSelectedStudent,
  setActiveBioDataTab,
} from "../../../store/infoCenterSlice";
import AcademicInfo from "./biodata_tabs/AcademicInfo";
import PersonalInfo from "./biodata_tabs/PersonalInfo";
import TranscriptSettings from "./biodata_tabs/TranscriptSettings";

function BioData({ form }) {
  const dispatch = useDispatch();
  const activeBioDataTab = useSelector(selectActiveBioDataTab);
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const selectedStudent = useSelector(selectSelectedStudent);

  const handleTabChange = (e) => {
    dispatch(setActiveBioDataTab(e.target.value));
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

  if (!selectedStudent) return;

  return (
    <div>
      <Radio.Group value={activeBioDataTab} onChange={handleTabChange}>
        <Radio.Button value="academic_info">Academic Info</Radio.Button>
        <Radio.Button value="personal_info">Personal Information</Radio.Button>
        <Radio.Button value="transcript_settings">
          Transcript Settings
        </Radio.Button>
      </Radio.Group>

      <div
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: 360, // Adjust this height as needed
          marginTop: 10,
          // backgroundColor: "red",
          overflow: "hidden", // Hide default scrollbars
        }}
      >
        {activeBioDataTab == "academic_info" && <AcademicInfo form={form} />}
        {activeBioDataTab == "personal_info" && <PersonalInfo />}
        {activeBioDataTab == "transcript_settings" && <TranscriptSettings />}
      </div>
    </div>
  );
}

export default BioData;
