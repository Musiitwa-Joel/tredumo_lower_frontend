import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";

function Elearnig() {
  const [loading, setLoading] = useState(false);
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const activeApp = useSelector((state) => state.apps.activeApp);

  useEffect(() => {
    // const exists = checkAppExistence(taskBarApps, "route", "admissions");

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
        <div
          style={{
            height: "calc(100vh - 200px)",
          }}
        >
          <iframe
            src={activeApp?.url}
            style={{ width: "100%", height: "100vh", border: "none" }}
            title="Embedded App"
          />
        </div>
      )}
    </>
  );
}

export default Elearnig;
