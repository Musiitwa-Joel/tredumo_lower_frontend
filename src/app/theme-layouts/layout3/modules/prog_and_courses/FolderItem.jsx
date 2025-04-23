import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setSelectedItem } from "./store/itemsSlice";
import ItemIcon from "./ItemIcon";
import { useNavigate } from "react-router-dom";

function FolderItem(props) {
  const { item } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!item) {
    return null;
  }

  return (
    <Box
      sx={{ backgroundColor: "background.paper" }}
      className="relative w-full sm:w-160 h-160 m-8 p-16 shadow rounded-16"
    >
      <IconButton
        className="absolute z-20 top-0 right-0 m-6 w-32 h-32 min-h-32"
        onClick={() => dispatch(setSelectedItem(item.id))}
      >
        <FuseSvgIcon size={20}>heroicons-solid:information-circle</FuseSvgIcon>
      </IconButton>
      <div
        className="flex flex-col h-full w-full"
        onClick={() => navigate(`/apps/file-manager/${item.id}`)}
        // to={`/apps/file-manager/${item.id}`}
        role="button"
      >
        <div className="flex flex-auto w-full items-center justify-center">
          <ItemIcon className="" type={item.type} />
        </div>
        <div className="flex shrink flex-col justify-center text-center">
          <Typography className="truncate text-12 font-medium">
            {item.code}
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
      </div>
    </Box>
  );
}

export default FolderItem;
