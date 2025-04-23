import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { setViewEmployeeDetails } from "../../store/hrSlice";
import { Button, Space } from "antd";
import { Edit, Print } from "@mui/icons-material";
// import { setActiveBooth } from "../store/photosSlice";

function DemoHeader() {
  const dispatch = useDispatch();
  const onLeftSidebarToggle = () => {
    dispatch(setViewEmployeeDetails(false));
  };
  return (
    <div
      className="flex flex-col w-full sm:py-10 sm:px-40"
      style={{
        backgroundColor: "#dfe5ef",
      }}
    >
      <div>
        <div className="flex sm:hidden" />
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="flex items-center w-full mt-8 -mx-10">
          <div className="flex shrink-0 items-center">
            <IconButton
              onClick={onLeftSidebarToggle}
              aria-label="toggle sidebar"
            >
              <FuseSvgIcon>material-twotone:keyboard_backspace</FuseSvgIcon>
            </IconButton>
          </div>

          <Typography
            component="h2"
            className="flex-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate mx-10"
          >
            Back to Performance Reviews
          </Typography>
        </div>
        <Space>
          {/* <Button type="primary" danger>
            Block Employee
          </Button> */}
          {/* <Button icon={<Print />}>Print Employee File</Button> */}
          <Button icon={<Edit />}>Respond</Button>
        </Space>
      </div>
    </div>
  );
}

export default DemoHeader;
