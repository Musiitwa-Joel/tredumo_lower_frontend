import { amber, blue, green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import {
  hideMessage,
  selectFuseMessageOptions,
  selectFuseMessageState,
} from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch, useAppSelector } from "app/store/hooks";
import FuseSvgIcon from "../FuseSvgIcon";
import zIndex from "@mui/material/styles/zIndex";

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  "& .FuseMessage-content": {
    ...(variant === "success" && {
      backgroundColor: green[600],
      color: "#FFFFFF",
      zIndex: 10000000,
    }),
    ...(variant === "error" && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark),
      zIndex: 10000000,
    }),
    ...(variant === "info" && {
      backgroundColor: blue[600],
      color: "#FFFFFF",
      zIndex: 10000000,
    }),
    ...(variant === "warning" && {
      backgroundColor: amber[600],
      color: "#FFFFFF",
      zIndex: 10000000,
    }),
  },
}));
const variantIcon = {
  success: "check_circle",
  warning: "warning",
  error: "error_outline",
  info: "info",
};

/**
 * FuseMessage
 * The FuseMessage component holds a snackbar that is capable of displaying message with 4 different variant. It uses the @mui/material React packages to create the components.
 */
function FuseMessage() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectFuseMessageState);
  const options = useAppSelector(selectFuseMessageOptions);
  return (
    <StyledSnackbar
      {...options}
      open={state}
      autoHideDuration={5000}
      style={{
        zIndex: 999999,
      }}
      onClose={() => dispatch(hideMessage())}
    >
      <SnackbarContent
        className="FuseMessage-content"
        style={{
          zIndex: 99999999999999,
        }}
        message={
          <div className="flex items-center">
            {variantIcon[options.variant] && (
              <FuseSvgIcon color="inherit">
                {variantIcon[options.variant]}
              </FuseSvgIcon>
            )}
            <Typography className="mx-8">{options.message}</Typography>
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(hideMessage())}
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>,
        ]}
      />
    </StyledSnackbar>
  );
}

export default memo(FuseMessage);
