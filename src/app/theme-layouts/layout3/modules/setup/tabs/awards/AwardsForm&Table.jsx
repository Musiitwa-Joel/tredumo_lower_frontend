import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";

import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  FormControl,
  InputLabel,
  TableRow,
  MenuItem,
  Checkbox,
  IconButton,
  Tooltip,
  TableSortLabel,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";

function TaskDistributionWidget() {
  const [award1, setAward] = React.useState("");
  const handleChange = (event) => {
    setAward(event.target.value);
  };

  const theme = useTheme();
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      awardName: "",
    },
  });
  const [awaitRender, setAwaitRender] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("award");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([
    {
      id: 1,
      award: "Associate's Degree",
      level: "Associate's Degree level",
      created_at: "12/07/2021",
      created_by: "Akampa Darlington",
      updated_by: "Liam Williams",
      updated_when: "2022-12-15T08:30:00",
    },
    {
      id: 2,
      award: "Barchelor's Degree",
      level: "Bachelor's Degree level",
      created_at: "01/15/2022",
      created_by: "John Doe",
      updated_by: "Emma Davis",
      updated_when: "2022-12-15T09:45:00",
    },
    {
      id: 3,
      award: "Marter's Degree",
      level: "Master's Degree level",
      created_at: "03/22/2022",
      created_by: "Jane Smith",
      updated_by: "Michael Brown",
      updated_when: "2022-12-15T11:15:00",
    },
    {
      id: 4,
      award: "Doctoral Degree",
      level: "Doctoral Degree level",
      created_at: "03/22/2022",
      created_by: "Jane Smith",
      updated_by: "Michael Brown",
      updated_when: "2022-12-15T11:15:00",
    },
    {
      id: 5,
      award: "Professional Degree",
      level: "Professional Degrees level",
      created_at: "03/22/2022",
      created_by: "Jane Smith",
      updated_by: "Michael Brown",
      updated_when: "2022-12-15T11:15:00",
    },
    {
      id: 6,
      award: "Certificate",
      level: "Certificate Programs level",
      created_at: "03/22/2022",
      created_by: "Jane Smith",
      updated_by: "Michael Brown",
      updated_when: "2022-12-15T11:15:00",
    },
  ]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const Textarea = styled("textarea")`
    width: 100%;
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 1.6rem;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? "#E5EAF2" : "#1C2025"};
    background: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? "#6B7A90" : "#DAE2ED"};
    box-shadow: 0px 2px 2px
      ${theme.palette.mode === "dark" ? "#1C2025" : "#F3F6F9"};
    &:hover {
      border-color: #3399ff;
    }
    &:focus {
      border-color: #3399ff;
      box-shadow: 0 0 0 3px
        ${theme.palette.mode === "dark" ? "#0072E5" : "#DAECFF"};
      outline: none;
    }
  `;

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (rowData) => {
    setValue("awardName", rowData.award);
  };

  const handleDeleteClick = (id) => {
    setOpenDeleteDialog(true);
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      setRows(rows.filter((row) => row.id !== deleteTargetId));
      setSelected(selected.filter((id) => id !== deleteTargetId));
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    reset();
  };

  if (awaitRender) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <motion.div variants={item}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              display: "flex",
              flexDirection: "column",
            }}
            className="flex flex-col flex-auto p-24 shadow overflow-hidden h-full"
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1 },
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl className="uppercase" fullWidth>
                <InputLabel id="demo-simple-select-label">Level</InputLabel>
                <Select
                  className="uppercase"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={award1}
                  label="Level"
                  onChange={handleChange}
                >
                  <MenuItem value={"Associates_Degree_level"}>
                    Associate's Degree level
                  </MenuItem>
                  <MenuItem value={"Bachelors_Degree_level"}>
                    Bachelor's Degree level{" "}
                  </MenuItem>
                  <MenuItem value={"Masters_Degree_level"}>
                    Master's Degree level{" "}
                  </MenuItem>
                  <MenuItem value={"Doctoral_Degree_level	"}>
                    Doctoral Degree level{" "}
                  </MenuItem>
                  <MenuItem value={"Professional_Degrees_level	"}>
                    Professional Degrees level{" "}
                  </MenuItem>
                  <MenuItem value={"Certificate_Programs_level	"}>
                    Certificate Programs level{" "}
                  </MenuItem>
                </Select>
              </FormControl>
              <Controller
                name="awardName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Award Name"
                    variant="outlined"
                    fullWidth
                    className="uppercase"
                    margin="normal"
                    helperText="Add Award and click Save"
                  />
                )}
              />
              <Box sx={{ alignSelf: "flex-end" }}>
                <Button type="submit" variant="contained" color="secondary">
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Grid>

      <Grid item xs={8}>
        <motion.div variants={item}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="medium">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      checked={
                        rows.length > 0 && selected.length === rows.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    key="award"
                    align="left"
                    padding={"normal"}
                    sortDirection={orderBy === "award" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "award"}
                      direction={orderBy === "award" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "award")}
                      sx={{ display: "flex", alignItems: "center" }} // Add these styles
                    >
                      Award
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>level</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell>Updated When</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.award}
                        </TableCell>
                        <TableCell>{row.level}</TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell>{row.created_by}</TableCell>
                        <TableCell>{row.updated_by}</TableCell>
                        <TableCell>{row.updated_when}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              color="info"
                              aria-label="edit"
                              size="small"
                              onClick={() => handleEdit(row)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              aria-label="delete"
                              size="small"
                              onClick={() => handleDeleteClick(row.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </motion.div>
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Academic Award?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Academic Award?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default TaskDistributionWidget;
