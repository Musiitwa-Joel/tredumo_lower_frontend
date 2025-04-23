import React from "react";
import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
// import DemoContent from "@fuse/core/DemoContent";
import { useDispatch, useSelector } from "react-redux";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./table.css";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_APPLICANT_FORMS } from "app/theme-layouts/layout3/graphql/queries";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import { Input } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Grid from "@mui/material/Grid";
import {
  applicantFormsLoaded,
  applicationPreviewOpened,
} from "app/store/admissions/applicantsSlice";
import { Check, CheckTwoTone } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import AdmitStdsModal from "../AdmitStdsModal";
import {
  updateAdmitStdsModalOpen,
  updateStudentsToBeAdmitted,
} from "app/store/admissionsSlice";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-toolbar": {},
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

const data = [
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
  {
    id: 1,
    date: "2022-09-02",
    name: "AKAMPA DARLINGTON",
    form_no: "36367326t23766732",
    gender: "M",
    phone_no: "2675176353535",
    paid: "YES",
    nationality: "UGANDAN",
    district_of_birth: "KAMPALA",
  },
];

const options = [
  "Preview Application",
  "Admit Students",
  "Export to excel",
  "Push to POST GRADUATE",
  "Print Selected",
];

const formatDateString = (timestamp) => {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
    return "Invalid Date";
  }

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const [weekday, month, day, year, time] = formattedDate.split(" ");

  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${weekday}-${month}-${day}-${year} ${time} ${ampm}`
    .replace(/,/g, "")
    .toUpperCase();
};

const Ribbon = ({ title }) => (
  <div>
    <div
      style={{
        margin: "10px 0",
        color: "white",
        width: "100%",
        borderBottom: "2px solid #01a2e9",
      }}
    ></div>
    <span
      style={{
        padding: "10px 15px",
        background: "#01a2e9",
        color: "white",
      }}
    >
      <b>{title}</b>
    </span>
  </div>
);

const Record = ({ key1, value }) => (
  <Grid
    container
    rowSpacing={1}
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    className="row-xs align-items-center mg-b-5"
    style={{
      // backgroundColor: "red",
      marginBottom: 5,
    }}
  >
    <Grid item xs={6}>
      <Typography className="mg-b-0" style={{ fontSize: 14 }}>
        {`${key1}:`}
      </Typography>
    </Grid>
    <Grid item xs={6} className=" mg-md-t-0">
      {key1 === "EMAIL" ? (
        <InputLabel
          className="mg-b-0"
          style={{
            fontSize: 14,
            fontWeight: "bolder",
            color: "black",
            // width: "150px" /* Set the width of your container */,
            whiteSpace: "nowrap" /* Prevent text from wrapping */,
            overflow: "hidden" /* Hide the overflowing content */,
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </InputLabel>
      ) : key1 === "ATTACHMENT" ? (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {"Click to view"}
        </a>
      ) : (
        <InputLabel
          className="mg-b-0"
          style={{
            fontSize: 14,
            fontWeight: "bolder",
            color: "black",
          }}
        >
          {value}
        </InputLabel>
      )}
    </Grid>
  </Grid>
);

function DataTable({}) {
  const [tableData, setTableData] = useState(data);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState();
  const [scroll, setScroll] = React.useState("paper");
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedprog = useSelector((state) => state.applicants.selectedProgram);

  const dispatch = useDispatch();
  const applicantForms = useSelector(
    (state) => state.applicants.applicantForms
  );

  const applicationPreviewOpen = useSelector(
    (state) => state.applicants.applicationPreviewOpen
  );
  const handleSaveCell = (cell, value) => {
    //@ts-ignore
    if (value > 70) {
      return alert("Final exam mark cant exceed 70");
    } else {
      tableData[cell.row.index][cell.column.id] = value;
      setTableData([...tableData]);
    }
  };
  const [getApplicantForms, { loading, error, data: applicantFormRes }] =
    useLazyQuery(GET_APPLICANT_FORMS);

  if (error) {
    // alert("error getting forms!");
    console.log("error", error.message);
  }

  const _getApplicantForms = async () => {
    if (Object.keys(selectedprog).length !== 0) {
      console.log("variables", {
        schemeId: selectedprog.scheme_id,
        programId: selectedprog.program.id,
      });
      const res = await getApplicantForms({
        variables: {
          schemeId: selectedprog.scheme_id,
          programId: selectedprog.program.id,
          campusId: selectedprog.campus.cam_id,
        },
      });

      // console.log("response ", res.data);
      dispatch(
        applicantFormsLoaded(res.data ? res.data.applicant_forms : null)
      );
    }
  };

  useEffect(() => {
    _getApplicantForms();
  }, [selectedprog]);

  const handleClickActions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "sl",
        enableEditing: false,
        size: 20,
      },
      {
        accessorKey: "created_on",
        enableEditing: false,
        header: "Date",
        size: 100,
        Cell: ({ row }) => (
          <span
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {formatDateString(parseInt(row.original.created_on))}
          </span>
        ),
      },
      { accessorKey: "form_no", enableEditing: false, header: "Form Number" },
      {
        accessorKey: "surname",
        enableEditing: false,
        header: "Name",
        Cell: ({ row }) => (
          <span
            style={{
              whiteSpace: "nowrap",
            }}
          >{`${row.original.surname} ${row.original.other_names}`}</span>
        ),
      },
      { accessorKey: "gender", enableEditing: false, header: "Sex", size: 10 },
      { accessorKey: "phone_no", enableEditing: false, header: "Phone No" },
      {
        accessorKey: "paid",
        enableEditing: false,
        header: "Paid",
        size: 10,

        Cell: ({ row }) => (
          <>
            {row.original.payments[0] ? (
              <CheckTwoTone
                style={{
                  fontSize: "2.7rem",
                }}
              />
            ) : (
              <Close
                style={{
                  fontSize: "2.7rem",
                }}
              />
            )}
          </>
        ),
      },
      {
        accessorKey: "admitted",
        enableEditing: false,
        header: "Admitted",
      },
      {
        accessorKey: "nationality",
        enableEditing: false,
        header: "Nationality",
      },
      {
        accessorKey: "district_of_birth",
        enableEditing: false,
        header: "District of Birth",
      },
      //   {
      //     accessorKey: "acc_yr",

      //     // disablePadding: true,
      //     header: "Accademic Year",
      // }

      //   {
      //     accessorKey: "final_mark",
      //     header: "Final Mark",
      //   },
      //   {
      //     accessorKey: "remark",
      //     header: "Remark",
      //   },
    ],
    []
  );

  const handleClick = () => {
    window.location.href =
      "http://localhost:2222/templates/final_exam_submission_template.xlsx"; // Add download attribute
  };

  const handleClickMenu = (option) => {
    if (option == "Preview Application") {
      //preview application
      if (table.getSelectedRowModel().rows > 1) {
        return alert("You have selected more than one row");
      } else if (table.getSelectedRowModel().rows == 0) {
        return alert("No row is selected");
      } else {
        setSelectedRow(table.getSelectedRowModel().rows[0].original);
        console.log(
          "row to preview",
          table.getSelectedRowModel().rows[0].original
        );
        dispatch(applicationPreviewOpened(true));
      }
    } else if (option == "Admit Students") {
      setSelectedRows(table.getSelectedRowModel().rows);
      let _rows = [];
      table.getSelectedRowModel().rows.map((row) => {
        if (row.original.admitted == "false") {
          _rows.push(row.original);
        }
        return _rows;
      });
      console.log("selected rows", _rows);
      dispatch(updateStudentsToBeAdmitted(_rows));
      dispatch(updateAdmitStdsModalOpen(true));
    }
    handleClose();
  };

  // const _data = useMemo(() => {
  //   if (applicantForms) {
  //     return applicantForms;
  //   }
  //   return [];
  // }, [applicantFormRes]);

  const table = useMaterialReactTable({
    columns,
    data: applicantForms, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableStickyHeader: true,
    enablePagination: false,
    enableEditing: false,
    editDisplayMode: "cell",
    enableRowSelection: true,
    muiSelectCheckboxProps: {
      color: "secondary",
    },
    state: {
      isLoading: loading,
    },
    // enableColumnResizing: true,
    // columnResizeMode: "onChange",

    // enableColumnActions: false,

    muiEditTextFieldProps: ({ cell }) => ({
      onBlur: (event) => {
        handleSaveCell(cell, event.target.value);
      },
    }),
    // onRowSelectionChange: ({ row }) => {
    //   console.log("row", row);
    // },
    renderTopToolbarCustomActions: () => {
      return (
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          style={{
            //   opacity: 0.7,
            // color: "#00008B",
            paddingTop: 5,
            paddingLeft: 5,
          }}
        >
          {Object.keys(selectedprog).length === 0
            ? ""
            : selectedprog.program.program +
              ` - (${selectedprog.program.course_code})`}
        </Typography>
        // <span
        //   style={{
        //     // fontSize: 13,
        //     fontSize: "1.8rem",
        //     paddingTop: 10,
        //     paddingLeft: 5,
        //   }}
        // >

        // </span>
      );
    },
    positionToolbarAlertBanner: "none",

    renderToolbarInternalActions: ({ table }) => {
      return (
        <>
          <MRT_ToggleGlobalFilterButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <Button
            variant="contained"
            size="small"
            color="secondary"
            aria-controls={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={handleClickActions}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            Action
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {options.map((option, index) => (
              <MenuItem key={index} onClick={() => handleClickMenu(option)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </>
      );
    },
    renderBottomToolbarCustomActions: () => {
      return (
        <div>
          {/* <Button
            variant="contained"
            disabled={true}
            size="small"
            color="secondary"
          >
            Upload Final Exam Results
          </Button> */}
          {applicantForms.length} records
        </div>
      );
    },
    // renderEmptyRowsFallback: () => {
    //   return <></>;
    // },
    muiTableProps: {
      sx: {
        boxShadow: "none",
        // height: 300,
      },
    },
    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        "& td": {
          backgroundColor: "#fff",
          borderRight: "1px solid #ccc",
          // height: 300,
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        borderBottom: "1px solid #e0e0e0", //add a border between columns
        fontSize: "1.6rem",
        color:
          row.original.payments && row.original.payments[0] ? "blue" : "red",
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        borderBottom: "1px solid #e0e0e0", //add a border between columns
        fontSize: "1.6rem",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        border: "1px solid #fff",
        fontSize: "1.8rem",
      },
    },
    muiTopToolbarProps: {
      sx: {
        // backgroundColor: "#fff",
        background: "linear-gradient(to left, #f3f3f3, #dadcde)",
        padding: 0,
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#fff",
        padding: 1,
      },
    },
    muiTableContainerProps: {
      sx: {
        boxShadow: "none",
        height: "calc(100vh - 280px)",
        // height: 500,
        backgroundColor: "#fff",
      },
    },
    muiTableFooterProps: {
      sx: {
        backgroundColor: "red",
      },
    },
    muiTableFooterRowProps: {
      sx: {
        backgroundColor: "red",
      },
    },
  });

  // console.log("rows", table.getSelectedRowModel().rows);
  return (
    <>
      <AdmitStdsModal />
      <div className="flex-auto p-0 sm:p-10 h-full">
        <Dialog
          open={applicationPreviewOpen}
          onClose={() => {
            dispatch(applicationPreviewOpened(false));
          }}
          scroll={scroll}
          maxWidth="xl"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          style={{
            height: "calc(100vh - 50px)",
          }}
        >
          {selectedRow && (
            <>
              <DialogTitle id="scroll-dialog-title">
                FORM NUMBER: {selectedRow.form_no}
              </DialogTitle>
              <DialogContent dividers={scroll === "paper"}>
                <Grid container spacing={2} style={{ padding: 10 }}>
                  <Grid item xs={12} md={4}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography className="text-3">Scheme:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          style={{ fontWeight: "bolder", fontSize: 13 }}
                        >
                          {selectedRow.scheme.scheme_category.scheme_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Scheme Status:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography style={{ fontWeight: "bolder" }}>
                          OPEN
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography>Intake:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography style={{ fontWeight: "bolder" }}>
                          {selectedRow.scheme.intake.intake_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Created On:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography style={{ fontWeight: "bolder" }}>
                          {formatDateString(parseInt(selectedRow.created_on))}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography>Acc Yr:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography style={{ fontWeight: "bolder" }}>
                          {selectedRow.scheme.acc_yr}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Form Status:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography style={{ fontWeight: "bolder" }}>
                          {selectedRow.form_status === 1
                            ? "PARTIALLY FILLED"
                            : "COMPLETED"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <div>
                  <Ribbon title={"BIO DATA"} />

                  <Grid
                    container
                    spacing={2}
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Grid item xs={6}>
                      <Record
                        key1="SALUTATION"
                        value={selectedRow.salutation}
                      />
                      <Record key1="FIRST NAME" value={selectedRow.surname} />
                      <Record
                        key1="OTHER NAMES"
                        value={selectedRow.other_names}
                      />
                      <Record key1="EMAIL" value={selectedRow.email} />
                      <Record
                        key1="TELEPHONE NO"
                        value={selectedRow.phone_no}
                      />
                      <Record
                        key1="DATE OF BIRTH"
                        value={formatDateString(parseInt(selectedRow.DOB))}
                      />
                      <Record
                        key1="ADDRESS"
                        value={selectedRow.district_of_residence}
                      />
                    </Grid>

                    {/* Second Column */}
                    <Grid item xs={6}>
                      <Record key1={"RELIGION"} value={selectedRow.religion} />
                      <Record key1="GENDER" value={selectedRow.gender} />
                      <Record
                        key1="MARITAL STATUS"
                        value={selectedRow.marital_status}
                      />
                      <Record
                        key1="NATIONALITY"
                        value={selectedRow.nationality}
                      />
                      <Record key1="NIN N0" value={selectedRow.nin_no} />
                    </Grid>
                  </Grid>

                  {selectedRow.prog_choices.length > 0 && (
                    <>
                      <Ribbon title={"PROGRAM CHOICES"} />

                      <div
                        // className="table-responsive country-table"
                        style={{
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            fontSize: 14,
                            padding: 0,
                            // backgroundColor: "red",
                          }}
                          size="small"
                          aria-label="simple table"
                        >
                          <TableHead
                            sx={{
                              fontSize: 20,
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography>CHOICE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>PROG CODE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>PROGRAM</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>CAMPUS</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>STUDY TIME</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>ENTRY YR</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <tbody>
                            {/* {console.log(
                            "programchoices",
                            selectedRow.prog_choices
                          )} */}
                            {selectedRow.prog_choices.map((choice, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {choice.choice}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {choice.program.course_code}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {choice.program.program}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {" "}
                                  {choice.campus.campus_name}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {choice.study_time.study_time_name}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {" "}
                                  {choice.entry_yr}
                                </TableCell>
                              </TableRow>
                              // <tr key={index}>
                              //   <td>{choice.choice}</td>
                              //   <td className="tx-right tx-medium tx-inverse">
                              //     {choice.program.course_code}
                              //   </td>
                              //   <td className="tx-right tx-medium tx-inverse">
                              //     {choice.program.program}
                              //   </td>
                              //   <td className="tx-right tx-medium tx-inverse">
                              //     {choice.campus.campus_name}
                              //   </td>
                              //   <td className="tx-right tx-medium tx-inverse">
                              //     {choice.study_time.study_time_name}
                              //   </td>
                              //   <td className="tx-right tx-medium tx-inverse">
                              //     {choice.entry_yr}
                              //   </td>
                              // </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  {selectedRow.other_qualifications.length > 0 && (
                    <>
                      <Ribbon title={"OTHER QUALIFICATIONS"} />

                      <div
                        // className="table-responsive country-table"
                        style={{
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            fontSize: 14,
                            padding: 0,
                            // backgroundColor: "red",
                          }}
                          size="small"
                          aria-label="simple table"
                        >
                          <TableHead
                            sx={{
                              fontSize: 20,
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography>#</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>INSTITUTE NAME</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>AWARD</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>TYPE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>DURATION</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>START DATE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>END DATE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>ATTACHMENT</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <tbody>
                            {/* {console.log(
                            "programchoices",
                            selectedRow.prog_choices
                          )} */}
                            {selectedRow.other_qualifications.map(
                              (qual, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {index + 1}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {qual.institute_name}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {qual.award_obtained}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {" "}
                                    {qual.award_type}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {qual.award_duration}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {" "}
                                    {qual.start_date}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {" "}
                                    {qual.end_date}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    <a
                                      href={`http://localhost:9400/upload/admission_attachments/${qual.attachment}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {"Click to view"}
                                    </a>
                                  </TableCell>
                                </TableRow>
                                // <tr key={index}>
                                //   <td>{choice.choice}</td>
                                //   <td className="tx-right tx-medium tx-inverse">
                                //     {choice.program.course_code}
                                //   </td>
                                //   <td className="tx-right tx-medium tx-inverse">
                                //     {choice.program.program}
                                //   </td>
                                //   <td className="tx-right tx-medium tx-inverse">
                                //     {choice.campus.campus_name}
                                //   </td>
                                //   <td className="tx-right tx-medium tx-inverse">
                                //     {choice.study_time.study_time_name}
                                //   </td>
                                //   <td className="tx-right tx-medium tx-inverse">
                                //     {choice.entry_yr}
                                //   </td>
                                // </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  <Ribbon title={"O LEVEL INFORMATION"} />
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <Grid container spacing={2} style={{ padding: 0 }}>
                      <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                          <Grid item xs={2}>
                            <Typography
                              style={{
                                fontSize: 13,
                              }}
                            >
                              SCHOOL:
                            </Typography>
                          </Grid>
                          <Grid item xs={10}>
                            <Typography
                              style={{ fontWeight: "bolder", fontSize: 13 }}
                            >
                              {selectedRow.olevel_info.school_name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography
                              style={{
                                fontSize: 13,
                              }}
                            >
                              INDEX No:
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography
                              style={{ fontWeight: "bolder", fontSize: 13 }}
                            >
                              {selectedRow.olevel_info.index_no}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                          <Grid item xs={5}>
                            <Typography
                              style={{
                                fontSize: 13,
                              }}
                            >
                              YEAR OF SITTING:
                            </Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <Typography
                              style={{ fontWeight: "bolder", fontSize: 13 }}
                            >
                              {selectedRow.olevel_info.yr_of_sitting}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={0}
                      style={{
                        marginTop: 10,
                        // marginBottom: 20,
                      }}
                    >
                      {selectedRow.olevel_info.olevel_results.map(
                        (subject, index) =>
                          index % 2 === 0 && (
                            <>
                              <Grid item xs={6}>
                                {selectedRow.olevel_info.olevel_results[
                                  index
                                ] && (
                                  <Record
                                    key1={
                                      selectedRow.olevel_info.olevel_results[
                                        index
                                      ].subject.subject_name
                                    }
                                    value={
                                      selectedRow.olevel_info.olevel_results[
                                        index
                                      ].grade
                                    }
                                  />
                                )}
                              </Grid>
                              <Grid item xs={6}>
                                {selectedRow.olevel_info.olevel_results[
                                  index + 1
                                ] && (
                                  <Record
                                    key1={
                                      selectedRow.olevel_info.olevel_results[
                                        index + 1
                                      ].subject.subject_name
                                    }
                                    value={
                                      selectedRow.olevel_info.olevel_results[
                                        index + 1
                                      ].grade
                                    }
                                  />
                                )}
                              </Grid>
                            </>
                          )
                      )}
                    </Grid>
                  </div>

                  <Ribbon title={"A LEVEL INFORMATION"} />
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <Grid container spacing={2} style={{ padding: 0 }}>
                      <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                          <Grid item xs={2}>
                            <Typography
                              style={{
                                fontSize: 13,
                              }}
                            >
                              SCHOOL:
                            </Typography>
                          </Grid>
                          <Grid item xs={10}>
                            <Typography
                              style={{ fontWeight: "bolder", fontSize: 13 }}
                            >
                              {selectedRow.alevel_info.school_name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography
                              style={{
                                fontSize: 13,
                              }}
                            >
                              INDEX No:
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography
                              style={{ fontWeight: "bolder", fontSize: 13 }}
                            >
                              {selectedRow.alevel_info.index_no}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                          <Grid item xs={5}>
                            <Typography
                              style={{
                                fontSize: 13,
                              }}
                            >
                              YEAR OF SITTING:
                            </Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <Typography
                              style={{ fontWeight: "bolder", fontSize: 13 }}
                            >
                              {selectedRow.alevel_info.yr_of_sitting}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={0}
                      style={{
                        marginTop: 10,
                        // marginBottom: 20,
                      }}
                    >
                      {selectedRow.alevel_info.alevel_results.map(
                        (subject, index) =>
                          index % 2 === 0 && (
                            <>
                              <Grid item xs={6}>
                                {selectedRow.alevel_info.alevel_results[
                                  index
                                ] && (
                                  <Record
                                    key1={
                                      selectedRow.alevel_info.alevel_results[
                                        index
                                      ].subject.subject_name
                                    }
                                    value={
                                      selectedRow.alevel_info.alevel_results[
                                        index
                                      ].grade
                                    }
                                  />
                                )}
                              </Grid>
                              <Grid item xs={6}>
                                {selectedRow.alevel_info.alevel_results[
                                  index + 1
                                ] && (
                                  <Record
                                    key1={
                                      selectedRow.alevel_info.alevel_results[
                                        index + 1
                                      ].subject.subject_name
                                    }
                                    value={
                                      selectedRow.alevel_info.alevel_results[
                                        index + 1
                                      ].grade
                                    }
                                  />
                                )}
                              </Grid>
                            </>
                          )
                      )}
                    </Grid>
                  </div>

                  {selectedRow.referees.length > 0 && (
                    <>
                      <Ribbon title={"REFEREES"} />

                      <div
                        // className="table-responsive country-table"
                        style={{
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            fontSize: 14,
                            padding: 0,
                            // backgroundColor: "red",
                          }}
                          size="small"
                          aria-label="simple table"
                        >
                          <TableHead
                            sx={{
                              fontSize: 20,
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography>#</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>NAME</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>EMAIL</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>ADDRESS</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>PHONE</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <tbody>
                            {/* {console.log(
                            "programchoices",
                            selectedRow.prog_choices
                          )} */}
                            {selectedRow.referees.map((referee, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {referee.ref_name}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {referee.ref_email}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {" "}
                                  {referee.ref_address}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {referee.ref_phone_no}
                                </TableCell>
                              </TableRow>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  {selectedRow.medical_history && (
                    <>
                      <Ribbon title={"MEDICAL HISTORY"} />

                      <div
                        // className="table-responsive country-table"
                        style={{
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            fontSize: 14,
                            padding: 0,
                            // backgroundColor: "red",
                          }}
                          size="small"
                          aria-label="simple table"
                        >
                          <TableHead
                            sx={{
                              fontSize: 20,
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography>#</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>BLOOD TYPE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>DISABILITY</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>EMERGENCY CONTACT</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <tbody>
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {1}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.medical_history.blood_type}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.medical_history.disability}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.medical_history.emergency_contact}
                              </TableCell>
                            </TableRow>
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  {selectedRow.next_of_kin && (
                    <>
                      <Ribbon title={"NEXT OF KIN"} />

                      <div
                        // className="table-responsive country-table"
                        style={{
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            fontSize: 14,
                            padding: 0,
                            // backgroundColor: "red",
                          }}
                          size="small"
                          aria-label="simple table"
                        >
                          <TableHead
                            sx={{
                              fontSize: 20,
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography>#</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>NAME</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>RELATION</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>EMAIL</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>CONTACT</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <tbody>
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {1}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.next_of_kin.name}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.next_of_kin.relation}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.next_of_kin.email}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {selectedRow.next_of_kin.contact}
                              </TableCell>
                            </TableRow>
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  {selectedRow.payments.length > 0 && (
                    <>
                      <Ribbon title={"PAYMENTS"} />

                      <div
                        // className="table-responsive country-table"
                        style={{
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            fontSize: 14,
                            padding: 0,
                            // backgroundColor: "red",
                          }}
                          size="small"
                          aria-label="simple table"
                        >
                          <TableHead
                            sx={{
                              fontSize: 20,
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography>DATE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>AMOUNT</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>PAYMENT REF</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <tbody>
                            {/* {console.log(
                            "programchoices",
                            selectedRow.prog_choices
                          )} */}
                            {selectedRow.payments.map((payment, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {formatDateString(parseInt(payment.date))}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {payment.amount}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {" "}
                                  {payment.payment_ref}
                                </TableCell>
                              </TableRow>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </>
          )}
          <DialogActions>
            <Button
              onClick={() => {
                dispatch(applicationPreviewOpened(false));
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            width: "100%",
            // backgroundColor: "#fff",
            // padding: 2,

            borderRadius: 5,
          }}
        >
          <MaterialReactTable
            muiTableContainerProps={{
              sx: {
                boxShadow: "none",
              },
            }}
            muiTableBodyRowProps={({ row, staticRowIndex, table }) => ({
              onClick: (event) =>
                getMRT_RowSelectionHandler({
                  row,
                  staticRowIndex,
                  table,
                })(event),
              style: {
                cursor: "pointer",
                userSelect: "none",
              },
            })}
            table={table}
          />
        </Box>
      </div>
    </>
  );
}

export default DataTable;
