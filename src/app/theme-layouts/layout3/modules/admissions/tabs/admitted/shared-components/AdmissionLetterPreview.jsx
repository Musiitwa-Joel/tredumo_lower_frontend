import { Alert, Button, Flex, Modal, Space, Typography } from "antd";
import Box from "@mui/material/Box";
import clsx from "clsx";
import { Add, Close } from "@mui/icons-material";
import { useContext, useRef } from "react";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import "./letter.css";
import { useDispatch, useSelector } from "react-redux";
import Typography2 from "@mui/material/Typography";
import {
  selectAdmissionLetterModalVisible,
  selectAdmissionLetters,
  setAdmissionLetterModalVisible,
} from "../../../admissionsSlice";
import { borderRadius } from "@mui/system";

const AdmissionLetterPreview = ({ application }) => {
  const dispatch = useDispatch();
  const admisionLetters = useSelector(selectAdmissionLetters);
  const admissionPreviewVisible = useSelector(
    selectAdmissionLetterModalVisible
  );

  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  const certificateStyles = {
    "--layout-width": `210mm`,
    "--layout-height": `297mm`,
    // "--certificate-background": appContext?.admissionLetterPreview
    //   ?.background_image
    //   ? `url(${appContext?.admissionLetterPreview?.background_image})`
    //   : "none",
  };

  return (
    <Modal
      // title={
      //   <div className="text-black font-bold py-2 px-4 rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-500 no-print">
      //     {"ADMISSION LETTER PREVIEW"}
      //   </div>
      // }
      open={admissionPreviewVisible}
      onOk={() => dispatch(setAdmissionLetterModalVisible(false))}
      onCancel={() => dispatch(setAdmissionLetterModalVisible(false))}
      width="90%" // Adjust modal width dynamically
      // closeIcon={<}
      style={{ maxWidth: "210mm", top: 10 }} // Prevent modal from exceeding A4 size
      styles={{
        body: {
          // padding: "0px 0px",
          height: "auto",
          overflow: "visible", // Ensure the content is not clipped
        },
        content: {
          padding: 0,
          height: "auto",
          overflow: "visible", // Ensure the content is not clipped
        },
        footer: {
          padding: 10,
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1e293b",
        }}
        className="p-10"
        id="draggable-dialog-title"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          cursor: "move",
          marginBottom: 10,
          // borderRadius: 20
        }}
      >
        <Typography2
          variant="h6"
          color="inherit"
          component="div"
          style={{
            //   opacity: 0.7,
            color: "white",
          }}
        >
          {"Admission Letters"}
        </Typography2>

        <Close
          style={{
            color: "white",
            fontSize: 25,
            cursor: "pointer",
            //  marginRight: 10,
          }}
          onClick={() => {
            dispatch(setAdmissionLetterModalVisible(false));
            //   handleClose();
          }}
        />
      </Box>
      <div
        style={{
          padding: "0px 10px",
        }}
      >
        <Alert
          message={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 0,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {`NUMBER OF LETTERS: ${admisionLetters.length}`}
              <Space size="large">
                <Button
                  size="small"
                  icon={<Printer size={13} />}
                  //   onClick={handlePrint}
                  onClick={() => reactToPrintFn()}
                >
                  PRINT LETTER
                </Button>
              </Space>
            </div>
          }
        />
      </div>
      <div id="printable-content" ref={contentRef}>
        {admisionLetters.map((letter) => (
          <>
            <div>
              <div
                className={`certificate`}
                style={{
                  ...certificateStyles,
                  width: "100%", // Ensure content fits inside the modal
                  // maxWidth: "210mm", // Restrict maximum width to A4 size
                  height: "auto", // Adjust height dynamically
                  margin: "0 auto", // Center content
                  padding: "20px 50px", // Add padding for better spacing
                  boxSizing: "border-box", // Ensure padding doesn’t affect width
                  // wordWrap: "break-word", // Prevent overflow from long words
                  overflowX: "hidden", // Prevent horizontal scrolling
                }}
                dangerouslySetInnerHTML={{
                  __html: letter.admission_letter,
                }}
              />
              <div className="background" />
              <hr />
              <div className="pagebreak"> </div>
            </div>
          </>
        ))}
      </div>
    </Modal>
  );
};
export default AdmissionLetterPreview;
