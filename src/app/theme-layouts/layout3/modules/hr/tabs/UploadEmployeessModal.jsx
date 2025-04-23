import React, { useEffect, useState } from "react";
import { Button, Modal, Space, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { useMutation } from "@apollo/client";

import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectUploadEmpModalVisible,
  setUploadEmpModalVisible,
} from "../store/hrSlice";
import { url2 } from "app/configs/apiConfig";
import { UPLOAD_EMPLOYEES } from "../gql/mutations";

const { Dragger } = Upload;

const UploadEmployeesModal = () => {
  const dispatch = useDispatch();
  const uploadEmpModalVisible = useSelector(selectUploadEmpModalVisible);
  const [fileList, setFileList] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [uploadEmployees, { error: uploadErr, loading, data }] = useMutation(
    UPLOAD_EMPLOYEES,
    {
      refetchQueries: ["loadEmployees"],
    }
  );

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

        return {
          title: item?.title || null,
          name: item?.name || null,
          staff_id: item?.staff_id || null,
          email: item?.email || null,
          nationality: item?.nationality || null,
          address: item?.address || null,
          telno: item?.telno || null,
          religion: item?.religion || null,
          date_of_birth: item?.date_of_birth || null,
          marital_status: item?.marital_status || null,
        };
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
    const res = await uploadEmployees({
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
      title="Upload Employees"
      open={uploadEmpModalVisible}
      maskClosable={false}
      onOk={() => dispatch(setUploadEmpModalVisible(false))}
      onCancel={() => dispatch(setUploadEmpModalVisible(false))}
      width={500}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            danger
            onClick={() =>
              (window.location.href = `${url2}/templates/upload_employees_template.xlsx`)
            }
          >
            Download Template
          </Button>
          <Space>
            <Button onClick={() => dispatch(setUploadEmpModalVisible(false))}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
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

export default UploadEmployeesModal;
