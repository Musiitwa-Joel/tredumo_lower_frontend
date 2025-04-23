import { useTimeout } from "@fuse/hooks";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import clsx from "clsx";
import Box from "@mui/material/Box";
import { url2 } from "app/configs/apiConfig";
// import tredumoLogo from "/assets/images/logo/tred-logo.png";

function FuseLoading(props) {
  const [showLoading, setShowLoading] = useState(!props.delay);

  useTimeout(() => {
    setShowLoading(true);
  }, props.delay);

  return (
    <div
      className={clsx(
        "flex flex-1 flex-col items-center justify-center p-24",
        !showLoading && "hidden"
      )}
    >
      {/* <Typography className="text-13 sm:text-20 font-medium -mb-16" color="text.secondary">
        Loading
      </Typography> */}

      {props.logo ? (
        <img width="300" src={props.logo} alt="logo" />
      ) : (
        <div class="logo">
          {/* <img width="128" src="assets/images/logo/logo.svg" alt="logo" /> */}
          <img
            width="128"
            src={`${url2}/university/tred-logo.png`}
            alt="logo"
          />
        </div>
      )}
      <Box
        id="spinner"
        sx={{
          "& > div": {
            backgroundColor: "palette.secondary.main",
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

FuseLoading.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

FuseLoading.defaultProps = {
  delay: false,
};

export default FuseLoading;
