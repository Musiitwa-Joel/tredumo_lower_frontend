import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import ClickableCardComponent from "./CardComponent";
import Box from "@mui/material/Box";
import StudentBooth from "./StudentBooth/StudentBooth";
import StaffBooth from "./StaffBooth/StaffBooth";
import { selectActiveBooth, setActiveBooth } from "./store/photosSlice";
import AppNav from "../../components/AppNav";

function PhotosManager() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeBooth = useSelector(selectActiveBooth);
  const dispatch = useDispatch();
  const activeApp = useSelector((state) => state.apps.activeApp);

  const tabs = [
    activeBooth == "student"
      ? "Student Booth"
      : activeBooth == "staff"
        ? "Staff Booth"
        : "Main Menu",
  ];

  const handleStudentCardClick = () => {
    dispatch(setActiveBooth("student"));
  };
  const handleStaffCardClick = () => {
    dispatch(setActiveBooth("staff"));
  };
  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {loading ? (
        <FuseLoading logo={activeApp?.logo} />
      ) : (
        <Suspense fallback={<FuseLoading logo={activeApp?.logo} />}>
          <Box sx={{ flexGrow: 1 }}>
            <AppNav tabs={tabs} activeApp={activeApp} activeTab={0} />
            {!activeBooth && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100vh - 106px)",
                }}
              >
                <div>
                  <ClickableCardComponent
                    title="Student Booth"
                    content="Add student photos."
                    onClick={handleStudentCardClick}
                  />
                </div>
                <div style={{ marginLeft: 10 }}>
                  <ClickableCardComponent
                    title="Staff Booth"
                    content="Add staff photos."
                    onClick={handleStaffCardClick}
                  />
                </div>
              </div>
            )}

            {activeBooth == "student" && <StudentBooth />}
            {activeBooth == "staff" && <StaffBooth />}
          </Box>
        </Suspense>
      )}
    </>
  );
}

export default PhotosManager;
