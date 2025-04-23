import React, { useEffect, useState } from "react";
import { Spin } from "antd"; // Ant Design spinner (optional)
import { useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { selectToken } from "app/store/tokenSlice";
import AppNav2 from "../../components/AppNav2";

const Library = () => {
  const [loading, setLoading] = useState(true);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const token = useSelector(selectToken);

  console.log("token", token);

  useEffect(() => {
    const iframe = iframeRef.current;
    iframe.onload = () => {
      iframe.contentWindow.postMessage(
        { type: "AUTH_TOKEN", token: token },
        "http://localhost:3000"
      );
    };
  }, []);

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

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 100px)",
        }}
      >
        {!loading && (
          <AppNav2
            tabs={[]}
            activeApp={activeApp}
            // activeTab={activeTab}
            // handleTabChange={handleTabChange}
          />
        )}
        {/* iframe with onLoad event to hide loader when loaded */}
        <iframe
          src={`http://localhost:8005?token=${encodeURIComponent(token)}`}
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

export default Library;
