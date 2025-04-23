import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import ItemIcon from "./ItemIcon";
import { setSelectedItem } from "./store/itemsSlice";
import { useEffect } from "react";
import { setCourseUnits } from "./store/customSlice";

function FileItem(props) {
  const { item } = props;
  const dispatch = useDispatch();
  const selectedCourseVid = useSelector((state) => state.customSlice);

  if (!item) {
    return null;
  }

  useEffect(() => {
    console.log("the id", selectedCourseVid);
  }, [selectedCourseVid]);

  return (
    <Box
      sx={{ backgroundColor: "background.paper" }}
      className="flex flex-col relative w-full sm:w-160 h-160 m-8 p-16 shadow rounded-16 cursor-pointer"
      // onClick={() => dispatch(setSelectedItem(item.id))}
    >
      <IconButton
        className="absolute z-20 top-0 right-0 m-6 w-32 h-32 min-h-32"
        onClick={() => dispatch(setSelectedItem(item.id))}
      >
        <FuseSvgIcon size={20}>heroicons-solid:information-circle</FuseSvgIcon>
      </IconButton>
      <div
        className="flex flex-auto w-full items-center justify-center"
        onClick={() => dispatch(setCourseUnits(item.id))}
      >
        <ItemIcon className="" type={item.type} />
      </div>
      <div className="flex shrink flex-col justify-center text-center">
        <Typography className="truncate text-12 font-medium">
          {item.name}
        </Typography>
        {item.contents && (
          <Typography
            className="truncate text-12 font-medium"
            color="text.secondary"
          >
            {item.contents}
          </Typography>
        )}
      </div>
    </Box>
  );
}

export default FileItem;
