import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Box, maxWidth } from "@mui/system";
import { lighten } from "@mui/material/styles";
import Card from "@mui/material/Card";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import Button from "@mui/material/Button";
import _ from "lodash";
import { styled, alpha } from "@mui/material/styles";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
// import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { List, AutoSizer } from "react-virtualized";
// import { FixedSizeList as List } from "react-window";
// import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TreeItem2, TreeItem2Content } from "@mui/x-tree-view/TreeItem2";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import {
  Download,
  KeyboardArrowRight,
  Refresh,
  Search,
  Upload,
} from "@mui/icons-material";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import Add from "@mui/icons-material/Add";
import { useQuery, NetworkStatus, useMutation } from "@apollo/client";
import { GET_ALL_PROGRAMMES } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  resetProgrammeFormDetails,
  updateAddVersionModalOpen,
  updateAllProgrammes,
  updateDownloadProgrammesModalOpen,
  updateExpandedItems,
  updateSelectedTreeItemId,
  updateUploadProgrammesModalOpen,
  updatecreateProgrammeModalOpen,
} from "../../store/progAndCoursesSlice";
import extractIds from "../../utilities/extractIDs";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import CreateProgrammeModal from "./create_new_program/CreateProgrammeModal";
import "./programs.css";
import UploadProgrammesModal from "./UploadProgrammesModal";
import AllProgrammesModal from "./AllProgrammesModal";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
// import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { useTreeItem2Utils } from "@mui/x-tree-view/hooks";
import * as yup from "yup";
import SvgIcon from "@mui/material/SvgIcon";
import Dialog from "@mui/material/Dialog";
import Close from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import TextField from "@mui/material/TextField";
import { SAVE_COURSE_VERSION } from "../../gql/mutations";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  version_title: yup.string().required("version title is required"),
});

const initialVersionDefaultValues = {
  id: null,
  version_title: "",
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const StyledMenu = styled((props) => (
  <Menu
    elevation={1}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,

    // backgroundColor: "#EEF7FF",

    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const ITEMS = [
  {
    id: "1",
    label: "(SBA) SCHOOL OF BUSINESS ADMINISTRATION",
    expanded: true,
    children: [
      {
        id: "2",
        label: "(DBA) DEPARTMENT OF BUSINESS ADMINISTRATION",

        children: [
          {
            id: "6",
            label: "V2019",
          },
        ],
      },
    ],
  },
  {
    id: "SCI",
    label: "(SCI) SCHOOL OF COMPUTING AND INFORMATICS",
    children: [
      {
        id: "DCI",
        label: "(DCI) DEPARTMENT OF COMPUTING",
        children: [
          {
            id: "7",
            label: "V1",
          },
          {
            id: "8",
            label: "V2019",
          },
        ],
      },
    ],
  },

  {
    id: "SLAW",
    label: "(SLAW) SCHOOL OF LAW",
    children: [
      {
        id: "10",
        label: "(DLA) DEPARTMENT OF LAW",

        children: [
          {
            id: "11",
            label: "V2019",
          },
        ],
      },
    ],
  },
  {
    id: "SOSS",
    label: "(SOSS) SCHOOL OF SOCIAL SCIENCES",
    children: [
      {
        id: "DSOSS",
        label: "(DCI) DEPARTMENT OF SOCIAL SCIENCES",
        children: [
          {
            id: "12",
            label: "V1",
          },
          {
            id: "13",
            label: "V2019",
          },
        ],
      },
    ],
  },

  {
    id: "SCOS",
    label: "(SCOS) SCHOOL OF SCIENCES",
    children: [
      {
        id: "15",
        label: "(DOSS) DEPARTMENT OF SCIENCES",

        children: [
          {
            id: "18",
            label: "V2019",
          },
        ],
      },
    ],
  },
  {
    id: "SCIAD",
    label: "(SCIAD) SCHOOL OF INDUSTRIAL ART AND DESIGN",

    children: [
      {
        id: "DCIAD",
        label: "(DCIAD) DEPARTMENT OF ART",
        children: [
          {
            id: "21",
            label: "(BATS) BACHELORS OF ARTS",
            children: [],
          },
          {
            id: "19",
            label: "V1",
            children: null,
          },
          {
            id: "20",
            label: "V2019",
            children: null,
          },
        ],
      },
    ],
  },

  {
    id: "SCIAD5",
    label: "(SCIAD) SCHOOL OF INDUSTRIAL ART AND DESIGN",

    children: [
      {
        id: "DCIA",
        label: "(DCIAD) DEPARTMENT OF ART",
        children: [
          {
            id: "25",
            label: "(BATS) BACHELORS OF ARTS",
            children: [],
          },
          {
            id: "27",
            label: "V1",
            children: null,
          },
          {
            id: "28",
            label: "V2019",
            children: null,
          },
        ],
      },
    ],
  },
];

const DirectoryOpenIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="octicon octicon-file-directory-open-fill"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#54aeff"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z" />
  </svg>
));

const DirectoryClosedIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="octicon octicon-file-directory-fill"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#54aeff"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
  </svg>
));

const FileIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    className="octicon octicon-file"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#636c76"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
  </svg>
));

// const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
//   // flexDirection: 'row-reverse',

//   fontWeight: 500,
//   [`&.Mui-expanded `]: {
//     "&::before": {
//       content: '""',
//       display: "block",
//       position: "absolute",
//       left: "16px",
//       top: "44px",
//       height: "calc(100% - 48px)",
//       width: "1.5px",
//       backgroundColor:
//         theme.palette.mode === "light"
//           ? theme.palette.grey[300]
//           : theme.palette.grey[700],
//     },
//   },
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.primary.main, 0.1),
//     color:
//       theme.palette.mode === "light" ? theme.palette.primary.main : "white",
//   },
//   [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
//     backgroundColor:
//       theme.palette.mode === "light"
//         ? theme.palette.primary.main
//         : theme.palette.primary.dark,
//     color: theme.palette.primary.contrastText,
//   },
//   [`& .${TreeItem2Content.groupTransition}`]: {
//     marginLeft: 15,
//     paddingLeft: 18,
//     borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
//   },
// }));

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

// const CustomTreeItem = React.memo(
//   React.forwardRef(function CustomTreeItem(props, ref) {
//     // console.log("props", props);
//     const { interactions } = useTreeItem2Utils({
//       itemId: props.itemId,
//       children: props.children,
//     });

//     const handleContentClick = (event) => {
//       event.defaultMuiPrevented = true;
//       interactions.handleSelection(event);
//     };

//     const handleIconContainerClick = (event) => {
//       interactions.handleExpansion(event);
//     };

//     const { id, itemId, label, disabled, children, type, item, ...other } =
//       props;

//     const {
//       getRootProps,
//       getContentProps,
//       getIconContainerProps,
//       getCheckboxProps,
//       getLabelProps,
//       getGroupTransitionProps,
//       status,
//     } = useTreeItem2({
//       id,
//       itemId,
//       children,
//       label,
//       disabled,
//       rootRef: ref,
//     });

//     // console.log("props ", props);
//     // console.log("ref", ref);

//     return (
//       <TreeItem2Provider
//         itemId={itemId}
//         // slotProps={{
//         //   content: { onClick: handleContentClick },
//         //   iconContainer: { onClick: handleIconContainerClick },
//         // }}
//       >
//         <TreeItem2Root {...getRootProps(other)}>
//           <CustomTreeItemContent
//             {...getContentProps()}
//             style={{
//               backgroundColor: status.selected ? "rgba(30, 41, 59, 0.15)" : "",
//               // color: status.selected ? "rgb(255, 255, 255)" : "",
//             }}
//             onClick={handleContentClick}
//             onDoubleClick={handleIconContainerClick}
//           >
//             <TreeItem2IconContainer
//               {...getIconContainerProps()}
//               onClick={handleIconContainerClick}
//             >
//               {/* {console.log("status ", status)} */}
//               <TreeItem2Icon status={status} />
//             </TreeItem2IconContainer>
//             {/* <TreeItem2Checkbox {...getCheckboxProps()} /> */}
//             <Box
//               sx={{
//                 flexGrow: 1,
//                 display: "flex",
//                 gap: 1,
//               }}
//               // onClick={(e) => e.stopPropagation()}
//             >
//               {children && children.length > 0 ? (
//                 status.expanded ? (
//                   <DirectoryOpenIcon />
//                 ) : (
//                   <DirectoryClosedIcon />
//                 )
//               ) : (
//                 <FileIcon />
//               )}

//               <TreeItem2Label
//                 className="text-16 font-semibold"
//                 style={{
//                   textOverflow: "ellipsis",
//                   overflow: "hidden",
//                   width: props.panelWidth,
//                 }}
//                 {...getLabelProps()}
//               />
//             </Box>
//           </CustomTreeItemContent>
//           {children && (
//             <TreeItem2GroupTransition {...getGroupTransitionProps()} />
//           )}
//         </TreeItem2Root>
//       </TreeItem2Provider>
//     );
//   }),
//   (prevProps, nextProps) => {
//     return (
//       prevProps.id === nextProps.id &&
//       prevProps.itemId === nextProps.itemId &&
//       prevProps.label === nextProps.label &&
//       prevProps.disabled === nextProps.disabled &&
//       prevProps.children === nextProps.children &&
//       prevProps.type === nextProps.type &&
//       prevProps.item === nextProps.item
//     );
//   }
// );

const CustomOpenIcon = () => (
  <div
    style={
      {
        // marginRight: 10,
        // width: 100,
      }
    }
  >
    <KeyboardArrowDownIcon style={{ width: 20, height: 20, marginRight: 5 }} />
    <DirectoryOpenIcon />
  </div>
);

const CustomCloseIcon = () => (
  <div
    style={
      {
        // marginRight: 10,
        // width: 100,
      }
    }
  >
    <KeyboardArrowRight style={{ width: 20, height: 20, marginRight: 5 }} />
    <DirectoryClosedIcon />
  </div>
);

const CustomTreeItemContent = styled(TreeItem)(({ theme }) => ({
  color:
    theme.palette.mode === "light"
      ? theme.palette.grey[800]
      : theme.palette.grey[200],

  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: 2,
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: "1.6rem",
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    // borderRadius: "50%",
    // backgroundColor:
    //   theme.palette.mode === "light"
    //     ? alpha(theme.palette.primary.main, 0.25)
    //     : theme.palette.primary.dark,
    // color: theme.palette.mode === "dark" && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
    width: 38,
    // marginLeft: 9,
    // paddingLeft: 3,
    // paddingRight: 5,
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 8,
    paddingLeft: 13,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  [`& .${treeItemClasses.root}`]: {
    borderRadius: "4px",
    padding: "2px",
    // margin: "0.8px 0px",
  },
}));

const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleContentClick = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event) => {
    interactions.handleExpansion(event);
  };

  return (
    <CustomTreeItemContent
      {...props}
      ref={ref}
      slotProps={{
        content: { onClick: handleContentClick },
        iconContainer: { onClick: handleIconContainerClick },
      }}
    />
  );
});

const rowRenderer =
  (
    allProgrammes,
    expandedItems,
    handleExpandedItemsChange,
    panelWidth,
    handleContextMenu,
    handleContextMenu2,
    handleItemSelectionToggle
  ) =>
  ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      allProgrammes.length > 0 && (
        <SimpleTreeView
          defaultExpandedItems={expandedItems}
          onItemSelectionToggle={handleItemSelectionToggle}
          // expandedItems={expandedItems}
          // onExpandedItemsChange={handleExpandedItemsChange}
          slots={{
            expandIcon: CustomCloseIcon,
            collapseIcon: CustomOpenIcon,
            // endIcon: CloseSquare,
          }}
          // sx={{
          //   [`& .${treeItemClasses.groupTransition}`]: {
          //     marginLeft: 2,
          //     paddingLeft: 3,
          //     borderLeft: `1px dashed black`,
          //   },
          // }}
          // style={{
          //   width: 300,
          // }}
        >
          <CustomTreeItem
            itemId={allProgrammes[index].id}
            label={`(${allProgrammes[index].code}) ${allProgrammes[index].label}`}
            panelWidth={panelWidth * 10.7}
          >
            {allProgrammes[index].children ? (
              allProgrammes[index].children.map((child) => (
                <CustomTreeItem
                  itemId={child.id}
                  label={`(${child.code}) ${child.label}`}
                  panelWidth={panelWidth * 10.7}
                >
                  {child.children ? (
                    child.children.map((child_2) => (
                      <CustomTreeItem
                        itemId={child_2.id}
                        label={`(${child_2.code}) ${child_2.label}`}
                        panelWidth={panelWidth * 10.7}
                        onContextMenu={handleContextMenu}
                        style={{ cursor: "context-menu" }}
                      >
                        {child_2.children ? (
                          child_2.children.map((child_3) => (
                            <>
                              <CustomTreeItem
                                itemId={child_3.id}
                                label={child_3.label}
                                panelWidth={panelWidth * 10.7}
                                onContextMenu={handleContextMenu2}
                                style={{ cursor: "context-menu" }}
                              />
                            </>
                          ))
                        ) : (
                          <CustomTreeItem
                            itemId={child_2.id}
                            label={`(${child_2.code}) ${child_2.label}`}
                            panelWidth={panelWidth * 10.7}
                            onContextMenu={handleContextMenu}
                            style={{ cursor: "context-menu" }}
                          />
                        )}
                      </CustomTreeItem>
                    ))
                  ) : (
                    <CustomTreeItem
                      itemId={child.id}
                      label={`(${child.code}) ${child.label}`}
                      panelWidth={panelWidth * 10.7}
                      onContextMenu={handleContextMenu}
                      style={{ cursor: "context-menu" }}
                    />
                  )}
                </CustomTreeItem>
              ))
            ) : (
              <CustomTreeItem
                itemId={allProgrammes[index].id}
                label={`(${allProgrammes[index].code}) ${allProgrammes[index].label}`}
                panelWidth={panelWidth * 10.7}
              />
            )}
          </CustomTreeItem>
        </SimpleTreeView>
      )
    );
  };

function AllProgrammes({ panelWidth }) {
  const [contextMenu, setContextMenu] = React.useState(null);
  const [contextMenu2, setContextMenu2] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const apiRef = useTreeViewApiRef();
  const user = useSelector((state) => state.user.user);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const lastSelectedItemRef = useRef(null);
  const {
    allProgrammes,
    expandedItems,
    addVersionModalOpen,
    selectedTreeItemId,
  } = useSelector((state) => state.progAndCourses);
  const scrollRef = useRef(null);

  const selected = lastSelectedItemRef.current;

  const [
    saveCourseVersion,
    {
      error: saveCourseVersionError,
      loading: savingCourseVersion,
      data: saveCourseVersionRes,
    },
  ] = useMutation(SAVE_COURSE_VERSION, {
    refetchQueries: ["getAllProgrammesCategorisedBySchools"],
  });

  if (saveCourseVersionError) {
    dispatch(
      showMessage({
        message: "Error saving course " + saveCourseVersionError.message,
        variant: "error",
      })
    );
  }
  const [lastSelectedItem, setLastSelectedItem] = React.useState(null);
  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      // setLastSelectedItem(itemId);
      lastSelectedItemRef.current = itemId;
      // dispatch(updateSelectedTreeItemId(itemId));
    }
  };

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      initialVersionDefaultValues,
      resolver: yupResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  const handleCloseModal = () => {
    dispatch(updateAddVersionModalOpen(false));
    // setOpen(false);
  };

  const handleContextMenu = (event) => {
    // handleCloseContextMenu2(); // Close the second context menu if open
    // if (selected) {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
    // }
  };

  const handleContextMenu2 = (event) => {
    // handleCloseContextMenu(); // Close the first context menu if open

    event.preventDefault();
    setContextMenu2(
      contextMenu2 === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
    setContextMenu(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCloseContextMenu2 = () => {
    setContextMenu2(null);
  };

  // console.log("panel width", panelWidth);
  const _allProgrammes = useMemo(
    () => allProgrammes,
    [allProgrammes, expandedItems]
  );

  // const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {

  // });

  async function onSubmit(data) {
    let payload = {
      courseId: selected,
      versionTitle: data.version_title,
      addedBy: user.biodata.id,
    };

    // const selectedItem = handleItemSelectionToggle();

    // console.log("payload", { ...data, selected });

    // if (selected) {
    // if (id) {
    //   payload = { ...payload, saveGradingId: id };
    // }

    const res = await saveCourseVersion({
      variables: payload,
    });

    // // console.log("the data", data);
    // console.log("the response", res);

    // dispatch(updateGradingSystems(res.data.saveGrading));

    reset(initialVersionDefaultValues);
    lastSelectedItemRef.current = null;
    // dispatch(updateGrading(defaultValues));

    // // close the dialog box
    handleCloseModal();

    dispatch(
      showMessage({
        message: "Course version saved Succesfully",
        variant: "info",
      })
    );
    // } else {
    //   alert("Please select a course!!");
    // }
  }

  const handleSelectedItemsChange = (event, itemId) => {
    if (itemId == null) {
      setSelectedItem(null);
    } else {
      setSelectedItem(apiRef.current.getItem(itemId));
    }
  };

  function getItemLabel(item) {
    // if (item.)
    // console.log("the item", item);
    if (item.__typename == "CourseVersion") return `${item.label}`;
    return `(${item.code}) ${item.label}`;
  }
  // const ids = extractIds(allProgrammes);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_ALL_PROGRAMMES,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  // console.log("selected row", selectedItem);

  // useEffect(() => {
  //   // setExpandedIds(extractIds(allProgrammes));
  //   dispatch(updateExpandedItems(extractIds(allProgrammes)));
  // }, [loading]);

  useEffect(() => {
    if (data) {
      // console.log("data", data.schools);
      dispatch(updateAllProgrammes(data.schools));
      dispatch(updateExpandedItems(extractIds(data.schools)));
    }
  }, [data]);

  const visibleRows = React.useMemo(() => allProgrammes, []);

  const onRefresh = async () => {
    const res = await refetch();
    // console.log("refetch...");
    dispatch(updateAllProgrammes(res.data.schools));
    if (networkStatus === NetworkStatus.refetch) {
      console.log("Refetching...");
    }
  };

  if (error) {
    dispatch(
      showMessage({
        message: error.message,
        variant: "error",
      })
    );
  }

  // if (data) {
  //   dispatch(updateExpandedItems(extractIds(allProgrammes)));
  // }

  // console.log("extracted ids", extractIds(null));

  const handleExpandedItemsChange = (event, itemIds) => {
    // setExpandedIds(itemIds);
    dispatch(updateExpandedItems(itemIds));
  };

  return (
    <div className="p-24">
      <CreateProgrammeModal />
      <UploadProgrammesModal />
      <AllProgrammesModal />
      <Card
        className={clsx("", "shadow")}
        sx={{
          backgroundColor: (theme) =>
            darken(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.7 : 0.2
            ),
          boxShadow: 100,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#1e293b",
          }}
          className="p-10"
          style={{
            paddingLeft: 15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 15,
          }}
        >
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            component="div"
            style={{
              //   opacity: 0.7,
              color: "white",
            }}
          >
            All Programmes
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Create Programme Version">
              <NoteAddOutlinedIcon
                fontSize=""
                color="white"
                //  onClick={onRefresh}
                style={{
                  color: "white",
                  fontSize: 26,
                  cursor: "pointer",
                  marginRight: 10,
                }}
              />
            </Tooltip>

            <Refresh
              fontSize=""
              color="white"
              onClick={onRefresh}
              style={{
                color: "white",
                fontSize: 26,
                cursor: "pointer",
                marginRight: 10,
              }}
            />
            <div>
              <Button
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="outlined"
                // color="inherit"
                style={{
                  // backgroundColor: "#fff",
                  color: "#fff",
                }}
                size="small"
                // disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Options
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    // console.log("create new programme");
                    dispatch(resetProgrammeFormDetails());
                    dispatch(updatecreateProgrammeModalOpen(true));
                    handleClose();
                  }}
                  disableRipple
                >
                  <Add />
                  Create New Programme
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(updateUploadProgrammesModalOpen(true));
                    handleClose();
                  }}
                  disableRipple
                >
                  <Upload />
                  Upload Programmes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(updateDownloadProgrammesModalOpen(true));
                    handleClose();
                  }}
                  disableRipple
                >
                  <Download />
                  Download Programmes
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleClose} disableRipple>
                  <FileCopyIcon />
                  Copy Version
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                  <Search />
                  Search Programme
                </MenuItem>
              </StyledMenu>
            </div>
          </div>
        </Box>

        <Box
          className="p-8 w-full rounded-16 border"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? lighten(theme.palette.background.default, 0.4)
                : lighten(theme.palette.background.default, 0.02),
            // height: "calc(100vh - 180px)",
            // width: 300,
            overflow: "auto",
            boxShadow: 1,
            position: "relative",
            // overflowX: "scroll",
            // textOverflow: "ellipsis",
            // backgroundColor: "red",
          }}
        >
          <Backdrop
            sx={{
              color: "#fff",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {/* <FuseScrollbars
            className="custom-scroll custom-scroll-height"
            ref={scrollRef}
            suppressScrollX={true}
          > */}
          <AutoSizer
            style={{
              height: "calc(100vh - 195px)",
            }}
          >
            {({ height, width }) => (
              <List
                width={width}
                // autoHeight
                // height={200}
                height={height}
                rowCount={_allProgrammes.length}
                rowHeight={20}
                rowRenderer={rowRenderer(
                  _allProgrammes,
                  expandedItems,
                  handleExpandedItemsChange,
                  panelWidth,
                  handleContextMenu,
                  handleContextMenu2,
                  handleItemSelectionToggle
                )}
                // className="list-containe"
                containerStyle={{
                  // backgroundColor: "red",
                  overflowY: "scroll",
                  minHeight: "calc(100vh - 195px)",
                  overflowX: "hidden",
                  whiteSpace: "nowrap",
                }}
                style={{
                  height: "calc(100vh - 195px)",
                  overflowX: "hidden",
                  whiteSpace: "nowrap",
                }}
                // className="custom-scroll custom-scroll-height"
              />
            )}
          </AutoSizer>
          {/* <List
            width={panelWidth * 12.9}
            // autoHeight
            // height={200}
            height={500}
            rowCount={allProgrammes.length}
            rowHeight={20}
            rowRenderer={rowRenderer}
            containerStyle={{
              // backgroundColor: "red",
              overflowY: "scroll",
              minHeight: "calc(100vh - 195px)",
              overflowX: "hidden",
              whiteSpace: "nowrap",
            }}
            style={{
              height: "calc(100vh - 195px)",
              overflowX: "hidden",
              whiteSpace: "nowrap",
            }}
            // className="custom-scroll custom-scroll-height"
          /> */}
          {/* <RichTreeView
              aria-label="icon expansion"
              expandedItems={expandedItems}
              className="disable-scrolling"
              
              // defaultExpandedItems={expandedItems}
              onExpandedItemsChange={handleExpandedItemsChange}
              getItemLabel={getItemLabel}
              apiRef={apiRef}
              selectedItems={selectedItem?.id ?? null}
              onSelectedItemsChange={handleSelectedItemsChange}
              // onClick={(e) => console.log("clicked", e.target)}
              items={allProgrammes}
              // slotProps={{ item: { slots: { groupTransition: TransitionComponent } } }}
              slots={{ item: CustomTreeItem }}
            /> */}
          {/* </FuseScrollbars> */}

          <div onContextMenu={handleContextMenu}>
            {/* Your component JSX for contextMenu */}
            <Menu
              open={contextMenu !== null}
              onClose={handleCloseContextMenu}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenu !== null
                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                  : undefined
              }
            >
              <MenuItem
                onClick={() => {
                  dispatch(updateAddVersionModalOpen(true));
                  handleCloseContextMenu();
                }}
              >
                Create New Version
              </MenuItem>
              <MenuItem onClick={handleCloseContextMenu}>
                Deactivate Course
              </MenuItem>
            </Menu>
          </div>

          <div onContextMenu={handleContextMenu2}>
            {/* Your component JSX for contextMenu2 */}
            <Menu
              open={contextMenu2 !== null}
              onClose={handleCloseContextMenu2}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenu2 !== null
                  ? {
                      top: contextMenu2.mouseY,
                      left: contextMenu2.mouseX,
                    }
                  : undefined
              }
            >
              <MenuItem onClick={handleCloseContextMenu2}>
                Delete version
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </Card>

      <Dialog
        maxWidth="xs"
        open={addVersionModalOpen}
        onClose={handleCloseModal}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <Card
          className={clsx("", "shadow")}
          sx={{
            backgroundColor: (theme) =>
              darken(
                theme.palette.background.paper,
                theme.palette.mode === "light" ? 0.01 : 0.1
              ),
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1e293b",
            }}
            className="p-10"
            id="draggable-dialog-title"
            style={{
              paddingLeft: 15,
              display: "flex",
              justifyContent: "space-between",
              cursor: "move",
            }}
          >
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              style={{
                //   opacity: 0.7,
                color: "white",
              }}
            >
              Create New Version
            </Typography>

            <Tooltip title="Close">
              <Close
                style={{
                  color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                  //  marginRight: 10,
                }}
                onClick={() => {
                  // dispatch(updateDepartment(defaultValues));
                  handleCloseModal();
                }}
              />
            </Tooltip>
          </Box>
          <div className="max-w-full relative">
            <Box
              // component="form"
              sx={{
                "& .MuiTextField-root": { m: 0, width: "100%" },
              }}
              autoComplete="off"
              className={"max-w-full"}
              style={{
                padding: 15,
                //   backgroundColor: "red",
              }}
            >
              <form
                name="versionForm"
                noValidate
                // className="flex flex-col justify-center w-full mt-32"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="version_title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Version Title"
                      id="outlined-size-small"
                      error={!!errors.version_title}
                      style={{
                        paddingBottom: 15,
                        width: 300,
                      }}
                      // value={formState.college_code}
                      // onChange={e => setFormState({...formState, college_code: e.target.value})}
                      // defaultValue="Small"
                      required
                      size="small"
                    />
                  )}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {savingCourseVersion ? (
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                          color: "#fff",
                          animationDuration: "550ms",
                        }}
                        size={18}
                        thickness={6}
                      />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </Box>
          </div>
        </Card>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default AllProgrammes;
