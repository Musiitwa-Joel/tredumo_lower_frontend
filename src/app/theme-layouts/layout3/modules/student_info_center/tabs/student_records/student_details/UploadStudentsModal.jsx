import React, { useEffect, useState } from "react";
import { Button, Modal, Space, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  selectUploadStudentsModalVisible,
  setUploadStudentsModalVisible,
} from "../../../store/infoCenterSlice";
import { useMutation } from "@apollo/client";
import { UPLOAD_STUDENTS } from "../../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { Dragger } = Upload;

const UploadStudentsModal = () => {
  const dispatch = useDispatch();
  const uploadStdModalVisible = useSelector(selectUploadStudentsModalVisible);
  const [fileList, setFileList] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [
    uploadStudents,
    { error: uploadErr, loading: uploadingStds, data: uploadRes },
  ] = useMutation(UPLOAD_STUDENTS);

  const handleFileExtraction = async (file) => {
    try {
      // Read the file as binary
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      // Convert the first sheet to JSON
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      //   console.log("Extracted JSON Data:", jsonData);
      const cleanData = jsonData.map((item) => {
        const cleanedItem = {};
        Object.entries(item).forEach(([key, value]) => {
          // Remove surrounding quotes from keys and values
          const cleanKey = key.replace(/^"|"$/g, "").trim();
          const cleanValue = value.replace(/^"|"$/g, "").trim();
          cleanedItem[cleanKey] = cleanValue;
        });
        return cleanedItem;
      });
      setExtractedData(cleanData); // Store extracted data in state
      message.success("File processed successfully!");
    } catch (error) {
      console.error("Error processing file:", error);
      message.error("Failed to process the file!");
    }
  };

  useEffect(() => {
    if (uploadErr) {
      dispatch(
        showMessage({
          message: uploadErr.message,
          variant: "error",
        })
      );
    }
  }, [uploadErr]);

  const handleUpload = async () => {
    if (!extractedData) {
      message.error("No data to upload. Please drag and process a file first.");
      return;
    }

    // console.log("extracted data", extractedData);
    const res = await uploadStudents({
      variables: {
        payload: extractedData,
      },
    });

    dispatch(
      showMessage({
        message: res.data.uploadStudents.message,
        variant: "success",
      })
    );
  };

  const props = {
    name: "file",
    multiple: false,
    accept: ".xlsx",
    beforeUpload: (file) => {
      // Ensure the file is an Excel file
      if (!file.name.endsWith(".xlsx")) {
        message.error("You can only upload Excel files!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]); // Add file to the list
      handleFileExtraction(file); // Extract data immediately
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setFileList([]); // Clear file list
      setExtractedData(null); // Clear extracted data
    },
    fileList,
  };

  return (
    <Modal
      title="Upload Students"
      open={uploadStdModalVisible}
      maskClosable={false}
      onOk={() => dispatch(setUploadStudentsModalVisible(false))}
      onCancel={() => dispatch(setUploadStudentsModalVisible(false))}
      width={500}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            danger
            onClick={() =>
              (window.location.href = "/template/student_upload_template.xlsx")
            }
          >
            Download Template
          </Button>
          <Space>
            <Button
              onClick={() => dispatch(setUploadStudentsModalVisible(false))}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={uploadingStds}
              disabled={!extractedData}
            >
              Upload
            </Button>
          </Space>
        </div>
      }
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to process
        </p>
        <p className="ant-upload-hint">
          Ensure the file matches the required template structure.
        </p>
      </Dragger>
      {/* {extractedData && (
        <div style={{ marginTop: 20 }}>
          <strong>Preview:</strong>
          <pre style={{ maxHeight: 200, overflow: "auto" }}>
            {JSON.stringify(extractedData, null, 2)}
          </pre>
        </div>
      )} */}
    </Modal>
  );
};

export default UploadStudentsModal;
