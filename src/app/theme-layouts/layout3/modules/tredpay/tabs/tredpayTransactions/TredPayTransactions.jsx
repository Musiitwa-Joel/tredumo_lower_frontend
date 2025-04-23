import { useState } from "react";
import { Box } from "@mui/material";
import { Button, Space, DatePicker } from "antd"; // Import DatePicker and Button from Ant Design
import { useDispatch, useSelector } from "react-redux";
import {
  selectFeesVersions,
  setCopyFeesStructureModal,
} from "../../store/feesMgtSlice";
import TransactionsTable from "./TransactionTable";

const { RangePicker } = DatePicker; // Destructure RangePicker from DatePicker

function Tuition() {
  const [contentWidth, setContentWidth] = useState(30);
  const [rightContentWidth, setRightContentWidth] = useState(60);
  const [loading, setLoading] = useState(false); // Loading state for the search button
  const dispatch = useDispatch();
  const feesVersions = useSelector(selectFeesVersions);

  const { selectedItem } = useSelector((state) => state.progAndCourses);

  const handleSearch = () => {
    setLoading(true); // Set loading to true when search starts
    // Simulate a search action (e.g., API call)
    setTimeout(() => {
      setLoading(false); // Set loading to false after search completes
    }, 2000);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 110px)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
        }}
        className="p-8"
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          marginTop: 7,
          marginBottom: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Space wrap>
            <RangePicker /> {/* Add RangePicker for date selection */}
            <Button
              type="primary"
              loading={loading} // Show loading spinner when loading is true
              onClick={handleSearch} // Handle search button click
            >
              Search
            </Button>
          </Space>
        </div>
      </Box>
      <TransactionsTable />
    </div>
  );
}

export default Tuition;
