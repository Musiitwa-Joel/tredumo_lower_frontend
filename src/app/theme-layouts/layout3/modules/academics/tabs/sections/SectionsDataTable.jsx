import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Edit } from "@mui/icons-material";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  resetSectionFormState,
  updateSections,
  updateSelectedSection,
} from "../../store/academicsSlice";

// Dummy data for sections
const rows = [
  {
    id: 1,
    section_name: "North",
    created_at: "01/10/2022",
    created_by: "Dr. Alice Mwangi",
    updated_by: "Dr. Alice Mwangi",
    updated_when: "2022-12-15T08:30:00",
  },
  {
    id: 2,
    section_name: "East",
    created_at: "01/12/2022",
    created_by: "Dr. John Doe",
    updated_by: "Dr. John Doe",
    updated_when: "2022-12-15T09:00:00",
  },
  {
    id: 3,
    section_name: "South",
    created_at: "01/15/2022",
    created_by: "Dr. Jane Smith",
    updated_by: "Dr. Jane Smith",
    updated_when: "2022-12-15T09:30:00",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const columns = [
  { id: "id", label: "#", minWidth: 10 },
  {
    id: "section_name",
    numeric: false,
    label: "Section Name",
  },
  {
    id: "",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow
        style={{
          backgroundColor: "lightblue",
          borderBottomColor: "blue",
          borderBottomWidth: 1.5,
        }}
      >
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              textAlign: "left",
              color: "blue",
              opacity: 0.7,
              fontSize: 13,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{ display: "none" }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function SectionsDataTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("section_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();

  // Use fallback to prevent undefined error
  const sections = useSelector((state) => state.academics.sections);

  // On mount, if no sections in Redux, load dummy data
  useEffect(() => {
    if (!sections || sections.length === 0) {
      dispatch(updateSections(rows));
    }
  }, [dispatch, sections]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Ensure sections is an array before sorting
  const visibleRows = React.useMemo(
    () =>
      stableSort(
        Array.isArray(sections) ? sections : [],
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, sections]
  );

  const totalSections = Array.isArray(sections) ? sections.length : 0;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalSections) : 0;

  return (
    <div className="p-16">
      <Box
        className="w-full border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.9)
              : lighten(theme.palette.background.default, 0.02),
          overflow: "auto",
        }}
      >
        <div className="max-w-full relative">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 290px)",
              minHeight: "calc(100vh - 290px)",
            }}
          >
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
              stickyHeader
              style={{
                borderCollapse: "collapse",
                width: "100%",
              }}
              aria-label="sticky table"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{ cursor: "pointer", fontSize: 13 }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      style={{
                        border: "1px solid #ddd",
                        paddingLeft: 10,
                        textAlign: "left",
                        fontSize: 13,
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      style={{
                        border: "1px solid #ddd",
                        paddingLeft: 10,
                        textAlign: "left",
                        fontSize: 13,
                      }}
                    >
                      {row.section_name}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        border: "1px solid #ddd",
                        textAlign: "left",
                      }}
                    >
                      <Tooltip title="Edit">
                        <Edit
                          onClick={() => {
                            dispatch(updateSelectedSection(row));
                          }}
                          style={{
                            color: "blue",
                            fontSize: 18,
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalSections}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

        <div
          style={{
            padding: 5,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              dispatch(resetSectionFormState());
            }}
          >
            {"Add New Section"}
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default SectionsDataTable;
