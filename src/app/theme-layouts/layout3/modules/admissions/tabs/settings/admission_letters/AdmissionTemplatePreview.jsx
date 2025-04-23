import { Button, Flex, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmissionTemplatePreview,
  setAdmissionTemplatePreview,
} from "../../../admissionsSlice";

const AdmissionTemplatePreview = ({ content }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectAdmissionTemplatePreview);
  return (
    <Modal
      title="Admission Template View"
      open={isOpen}
      onOk={() => dispatch(setAdmissionTemplatePreview(false))}
      onCancel={() => dispatch(setAdmissionTemplatePreview(false))}
      width="90%" // Adjust modal width dynamically
      style={{ maxWidth: "210mm" }} // Prevent modal from exceeding A4 size
    >
      <div
        // className="ql-editor"
        style={{
          width: "100%", // Ensure content fits inside the modal
          maxWidth: "210mm", // Restrict maximum width to A4 size
          height: "auto", // Adjust height dynamically
          margin: "0 auto", // Center content
          padding: "20px", // Add padding for better spacing
          boxSizing: "border-box", // Ensure padding doesn’t affect width
          wordWrap: "break-word", // Prevent overflow from long words

          overflowX: "hidden", // Prevent horizontal scrolling
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div class="pagebreak"> </div>
    </Modal>
  );
};
export default AdmissionTemplatePreview;
