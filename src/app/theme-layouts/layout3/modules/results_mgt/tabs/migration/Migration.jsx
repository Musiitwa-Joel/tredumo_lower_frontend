import React from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import ActiveStdResultsUpload from "./active_students/ActiveStdResultsUpload";

const Migration = () => {
  return (
    <div
      style={{
        paddingLeft: 15,
        paddingRight: 15,
      }}
    >
      {/* <h1 className="text-3xl font-bold mb-4">Bulk Results Upload</h1> */}
      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: "active_stds_upload",
            label: "Active Students Results Upload",
            children: <ActiveStdResultsUpload />,
          },

          {
            key: "completed_stds_upload",
            label: "Completed Students Results Batch Upload",
            //   children: <CreateReview />,
          },

          {
            key: "upload_history",
            label: "Upload History",
            // children: <ReviewHistory />,
          },
        ]}
      />
    </div>
  );
};

export default Migration;
