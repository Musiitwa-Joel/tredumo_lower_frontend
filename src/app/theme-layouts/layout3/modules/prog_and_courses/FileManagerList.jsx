import React from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Box, maxWidth } from "@mui/system";
import { lighten } from "@mui/material/styles";
import { selectFiles, selectFolders } from "./store/itemsSlice";

import { styled, alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
// import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2Checkbox,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import FuseScrollbars from "@fuse/core/FuseScrollbars";

const ITEMS = [
  {
    id: "1",
    label: "(SBA) SCHOOL OF BUSINESS ADMINISTRATION",
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

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),

  // [`& .${treeItem2Classes.content}`]: {
  //   padding: theme.spacing(0.5, 1),
  //   margin: theme.spacing(0.2, 0),
  // },
  // [`& .${treeItem2Classes.iconContainer}`]: {
  //   "& .close": {
  //     opacity: 0.3,
  //   },
  // },
  // [`& .${treeItem2Classes.groupTransition}`]: {
  //   marginLeft: 15,
  //   paddingLeft: 18,
  //   borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  // },
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, type, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem2({
    id,
    itemId,
    children,
    label,
    disabled,
    rootRef: ref,
  });

  // console.log("status ", status);

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps()}
          style={{
            backgroundColor: status.selected ? "rgb(25, 118, 210, 0.4)" : "",
            // color: status.selected ? "rgb(255, 255, 255)" : "",
          }}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            {/* {console.log("status ", status)} */}
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              gap: 1,
            }}
          >
            {/* <Avatar
              sx={(theme) => ({
                background: theme.palette.primary.main,
                width: 24,
                height: 24,
                fontSize: "0.8rem",
              })}
            >
              {label[0]}
            </Avatar> */}

            {children && children.length > 0 ? (
              status.expanded ? (
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
                  {...props}
                >
                  <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z" />
                </svg>
              ) : (
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
                  {...props}
                >
                  <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
                </svg>
              )
            ) : (
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
                {...props}
              >
                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
              </svg>
            )}

            <TreeItem2Label {...getLabelProps()} />
          </Box>
        </CustomTreeItemContent>
        {children && (
          <TreeItem2GroupTransition {...getGroupTransitionProps()} />
        )}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

function FileManagerList() {
  const folders = useSelector(selectFolders);
  const files = useSelector(selectFiles);

  return (
    <div className="p-24">
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
          height: "calc(100vh - 140px)",
          // width: 300,
          overflowY: "scroll",
          // overflowX: "scroll",
          textOverflow: "ellipsis",
          // backgroundColor: "red",
        }}
      >
        <FuseScrollbars>
          <RichTreeView
            aria-label="icon expansion"
            sx={{
              position: "relative",
              whiteSpace: "nowrap",
              // backgroundColor: "red",
              // overflowX: "scroll",
              textOverflow: "ellipsis",
            }}
            defaultExpandedItems={["3"]}
            items={ITEMS}
            slots={{ item: CustomTreeItem }}
          />
        </FuseScrollbars>
      </Box>
    </div>
  );
}

export default FileManagerList;
