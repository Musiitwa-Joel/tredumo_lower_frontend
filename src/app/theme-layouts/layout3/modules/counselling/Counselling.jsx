import React, { useState } from "react";
import { Spin } from "antd"; // Ant Design spinner (optional)
import { useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";

const Counselling = () => {
  const [loading, setLoading] = useState(true);
  const activeApp = useSelector((state) => state.apps.activeApp);

  return (
    <>
      {/* Show loader while iframe is loading */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {loading && <FuseLoading logo={activeApp?.logo} />}
      </div>

      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        {/* iframe with onLoad event to hide loader when loaded */}
        <iframe
          src="http://localhost:8001"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: loading ? "none" : "block", // Hide until loaded
          }}
          onLoad={() => setLoading(false)}
        />
      </div>
    </>
  );
};

export default Counselling;
