import React, { useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelection,
  selectStudentsModalVisible,
  setStudentsModalVisible,
} from "../../../store/registrationSlice";
import StudentsTable from "./StudentsTable";
const StudentsModal = () => {
  const modalVisible = useSelector(selectStudentsModalVisible);
  const selection = useSelector(selectSelection);
  const dispatch = useDispatch();

  // console.log("selection", selection);
  return (
    <>
      <Modal
        title={
          selection?.type === "school"
            ? `Students - (${selection?.details.school_code}) ${selection?.details.school_title}`
            : "Students"
        }
        // centered
        open={modalVisible}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        onOk={() => dispatch(setStudentsModalVisible(false))}
        onCancel={() => dispatch(setStudentsModalVisible(false))}
        cancelText="Close"
        width={1200}
        style={{
          top: 50,
        }}
      >
        <StudentsTable />
      </Modal>
    </>
  );
};
export default StudentsModal;
