import React from "react";
import { url2 } from "app/configs/apiConfig";

function UniversityLogo() {
  return (
    <>
      <h5
        style={{
          fontSize: 25,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        University Logo
      </h5>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <img
          src={`${url2}/university/nkumba-university.png`}
          style={{
            width: "80%",
          }}
        />
      </div>
    </>
  );
}

export default UniversityLogo;
