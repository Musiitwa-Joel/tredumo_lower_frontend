import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  IconButton,
} from "@mui/material";
import { Edit, Add, Delete } from "@mui/icons-material";

const StyledTableContainer = styled(TableContainer)({
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflowX: "auto",
  overflowY: "auto",
  maxHeight: "calc(100vh - 250px)",
  maxWidth: "100%",
  "&::-webkit-scrollbar": { height: "8px", width: "8px" },
  "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
  "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
  "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
});

const HeaderCell = styled(TableCell)({
  backgroundColor: "#2c3e50",
  color: "white",
  fontWeight: "bold",
  fontSize: "14px",
  textAlign: "center",
  padding: "12px 8px",
  border: "2px solid #1a252f",
  minWidth: "100px",
});

const TimeHeaderCell = styled(TableCell)({
  backgroundColor: "#34495e",
  color: "white",
  fontWeight: "bold",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px 4px",
  border: "2px solid #2c3e50",
  minWidth: "80px",
  lineHeight: "1.2",
});

const DayCell = styled(TableCell)({
  backgroundColor: "#ecf0f1",
  color: "#2c3e50",
  fontWeight: "bold",
  fontSize: "14px",
  textAlign: "center",
  padding: "12px 8px",
  border: "2px solid #bdc3c7",
  minWidth: "120px",
});

const SubjectCell = styled(TableCell)(({ selected }) => ({
  backgroundColor: "#ffffff",
  color: "#2c3e50",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px 6px",
  border: selected ? "2px dotted #3498db" : "1px solid #bdc3c7",
  fontWeight: "500",
  lineHeight: "1.3",
  minWidth: "100px",
  height: "60px",
  verticalAlign: "middle",
  cursor: "pointer",
  position: "relative",
}));

const BreakCell = styled(TableCell)({
  backgroundColor: "#2c3e50",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center",
  writingMode: "vertical-lr",
  textOrientation: "mixed",
  padding: "0",
  border: "2px solid #1a252f",
  width: "4px",
});

const PrimaryTimetable = () => {
  const [selected, setSelected] = useState(null);

  const timeSlots = [
    "8:20 AM\n8:55 AM",
    "8:55 AM\n9:30 AM",
    "9:30 AM\n9:50 AM",
    "9:50 AM\n10:25 AM",
    "10:25 AM\n11:00 AM",
    "11:00 AM\n11:30 AM",
    "11:30 AM\n12:05 PM",
    "12:05 PM\n12:40 PM",
    "12:40 PM\n2:00 PM",
    "2:00 PM\n2:35 PM",
  ];

  const timetableData = {
    MONDAY: [
      { subject: "ENGLISH", teacher: "Mr. John" },
      { subject: "MATHS", teacher: "Mrs. Grace" },
      { subject: "", teacher: "" },
      { subject: "INDIG LANG", teacher: "Mr. Peter" },
      { subject: "MOVEMENT (CAS)", teacher: "Coach Ali" },
      { subject: "", teacher: "" },
      { subject: "ENVIRONMENTAL ACTIVITIES", teacher: "Ms. Mary" },
      { subject: "MOVEMENT (CAS)", teacher: "Coach Ali" },
      { subject: "", teacher: "" },
      { subject: "INDIG LANG", teacher: "Mr. Peter" },
    ],
    TUESDAY: [
      { subject: "MATHS", teacher: "Mrs. Grace" },
      { subject: "KISWAHILI", teacher: "Mr. James" },
      { subject: "", teacher: "" },
      { subject: "ENGLISH", teacher: "Mr. John" },
      { subject: "ENVIRONMENTAL ACTIVITIES", teacher: "Ms. Mary" },
      { subject: "", teacher: "" },
      { subject: "MUSIC (CAS)", teacher: "Mr. Paul" },
      { subject: "RELIGIOUS EDUCATION", teacher: "Rev. Isaac" },
      { subject: "", teacher: "" },
      { subject: "", teacher: "" },
    ],
    WEDNESDAY: Array(10).fill({ subject: "", teacher: "" }),
    THURSDAY: Array(10).fill({ subject: "", teacher: "" }),
    FRIDAY: Array(10).fill({ subject: "", teacher: "" }),
  };

  const days = ["MONDAY", "TUESDAY", "WED", "THURS", "FRIDAY"];
  const fullDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

  const getBreakLabel = (index) => {
    if (index === 2 || index === 5) return "BREAK";
    if (index === 8) return "LUNCH";
    return "";
  };

  const isBreakTime = (index) => index === 2 || index === 5 || index === 8;

  return (
    <Box sx={{ p: 0, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <StyledTableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", width: "100%", minWidth: "800px" }}>
          <TableHead>
            <TableRow>
              <HeaderCell rowSpan={2} sx={{ width: "100px" }}>
                <Box>
                  <div style={{ marginBottom: "8px" }}>TIME</div>
                  <div style={{ fontSize: "12px" }}>DAY</div>
                </Box>
              </HeaderCell>
              {timeSlots.map((time, index) => (
                <TimeHeaderCell key={index} sx={{ width: "85px" }}>
                  {time.split("\n").map((line, i) => (
                    <div
                      key={i}
                      style={{ fontSize: "10px", lineHeight: "1.1" }}
                    >
                      {line}
                    </div>
                  ))}
                </TimeHeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {days.map((day, dayIndex) => (
              <TableRow key={day}>
                <DayCell>{day}</DayCell>
                {timeSlots.map((_, timeIndex) => {
                  if (isBreakTime(timeIndex)) {
                    if (dayIndex === 0) {
                      return (
                        <BreakCell key={timeIndex} rowSpan={5}>
                          <Box
                            sx={{
                              transform: "rotate(180deg)",
                              fontSize: "14px",
                              letterSpacing: "2px",
                            }}
                          >
                            {getBreakLabel(timeIndex)}
                          </Box>
                        </BreakCell>
                      );
                    } else return null;
                  }

                  const entry = timetableData[fullDays[dayIndex]]?.[
                    timeIndex
                  ] || { subject: "", teacher: "" };
                  const cellKey = `${fullDays[dayIndex]}-${timeIndex}`;
                  const isSelected = selected === cellKey;

                  return (
                    <SubjectCell
                      key={cellKey}
                      selected={isSelected}
                      onClick={() => setSelected(isSelected ? null : cellKey)}
                    >
                      <Box sx={{ fontWeight: "bold" }}>{entry.subject}</Box>
                      {entry.teacher && (
                        <Box sx={{ fontSize: "10px", color: "#7f8c8d" }}>
                          {entry.teacher}
                        </Box>
                      )}

                      {isSelected && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 2,
                            right: 2,
                            display: "flex",
                            gap: "4px",
                          }}
                        >
                          <IconButton size="small" sx={{ p: "2px" }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ p: "2px" }}>
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ p: "2px" }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </SubjectCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default PrimaryTimetable;
