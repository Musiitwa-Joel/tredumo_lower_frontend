import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Modal,
  Image,
  Typography,
  QRCode,
  Divider,
  Row,
  Col,
  Button,
  Alert,
  Space,
} from "antd";
import ModuleTable from "./ModuleTable";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRegistrationPermitModalVisible,
  selectStudentData,
  setRegistrationPermitModalVisible,
} from "../../../../store/registrationSlice";
import { Print, Refresh } from "@mui/icons-material";
import PerfectScrollbar from "perfect-scrollbar";

const { Text, Title } = Typography;

// Correctly forward the ref to the printable content
const PrintableContent = React.forwardRef((props, ref) => {
  const studentFile = useSelector(selectStudentData);

  const totalCreditUnits = props.selectedModules.reduce((total, item) => {
    const creditUnits = parseInt(item?.course_unit?.credit_units, 10) || 0;
    return total + creditUnits;
  }, 0);
  //   console.log("course units", props.selectedModules);
  return (
    <div
      ref={ref} // Pass the ref to the root DOM element
      style={{
        padding: 16,
        //   backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Image
          preview={false}
          width={200}
          src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
        />
        <Row justify="center">
          <div style={{ textAlign: "center", marginTop: "0px" }}>
            <Text strong style={{ fontSize: "2rem" }}>
              OFFICE OF THE ACADEMIC REGISTRAR
            </Text>
            <br />
            <Text>STUDENT EXAMINATION PERMIT</Text>
            <br />
            <Text style={{ fontSize: "1.4rem" }}>
              PRINT DATE:{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Text>
          </div>
        </Row>
        <QRCode
          size={70}
          bordered={false}
          type="svg"
          value={props.reg?.registration_token}
        />
      </div>

      <Divider
        style={{
          marginTop: 10,
          borderColor: "#00008B",
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      />

      <div
        style={{
          padding: 6,
          border: "1px dotted #00008B",
          borderRadius: 5,
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              marginRight: 30,
            }}
          >
            <Image
              preview={false}
              width={100}
              style={{ borderRadius: "50%" }}
              // src={`https://tredumo.nkumbauniversity.ac.ug:2222/api/student_image/${studentFile?.student_no}`}
              src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile?.student_no}`}
            />
          </div>

          <div span={20}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Text strong>PROGRAMME:</Text>{" "}
                {`(${studentFile?.course_details.course.course_code}) ${studentFile?.course_details.course.course_title}`}
              </Col>
              <Col span={24}>
                <Text strong>REGISTRATION NO:</Text>{" "}
                {studentFile?.registration_no}
              </Col>
              <Col span={12}>
                <Text strong>FULL NAME:</Text>{" "}
                {`${studentFile?.biodata.surname} ${studentFile?.biodata.other_names}`}
              </Col>
              <Col span={12}>
                <Text strong>STUDENT NO:</Text> {studentFile?.student_no}
              </Col>
              <Col span={12}>
                <Text strong>STUDY YEAR:</Text> YEAR {props?.study_yr}
              </Col>
              <Col span={12}>
                <Text strong>SEMESTER:</Text> SEMESTER {props?.semester}
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <Title
        level={5}
        style={{
          color: "green",
          textAlign: "center",
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        REGISTERED COURSE UNITS
      </Title>
      <div style={{ marginTop: "-5px" }}>
        <ModuleTable courseUnits={props.selectedModules} />
      </div>

      <Divider
        style={{
          borderColor: "#00008B",
          borderStyle: "dashed",
          borderWidth: 1,
          marginTop: 5,
          marginBottom: 20,
        }}
      />

      <div>
        <Title level={5}>NOTES:</Title>
        <Text style={{ fontStyle: "italic", lineHeight: 0.75 }}>
          <em>
            {`1. The total credits registered for Semester ${props.semester} of the ${props.reg?.acc_yr_title} academic year is ${totalCreditUnits}`}
            .
          </em>
          <br />
          <em>
            2. This card is confidential and must be presented to the
            invigilator upon request at each examination.
          </em>
          <br />
          <em>
            3. Your <strong>STUDENT NUMBER</strong>, not your name, must be
            written on every answer booklet or supplementary sheet.
          </em>
          <br />
          <em>
            4. Unauthorized materials or notes must NOT be brought into the
            examination room.
          </em>
          <br />
          <em>
            5. Mobile phones, iPads, and tablets must NOT be brought near the
            examination room.
          </em>
          <br />
          <em>
            6. Students must comply with the University Examination Regulations.
          </em>
        </Text>
      </div>

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Image
          preview={false}
          width={200}
          src="https://content.govdelivery.com/attachments/fancy_images/USSOH/2015/12/704441/pdr-signature_original.png"
        />
        <div>ACADEMIC REGISTRAR</div>
      </div>
    </div>
  );
});

function ExaminationPermit({ study_yr, semester, selectedModules, reg }) {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const registrationPermitModalVisible = useSelector(
    selectRegistrationPermitModalVisible
  );

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Examination_Permit",
    pageStyle: `
    @media print {
        @page { size: landscape; }
    }
    html, body {
        width: 100%;
        height: 100%;
       margin: 0 !important;
        padding: 0 !important;
        background-color: white !important;
        overflow: hidden;
    }
    .print-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: white !important;
    }
    .print-container {
      background-color: red; 
    }
    .ant-table {
      border-collapse: collapse;
    }
  `,
  });

  const handleReload = () => {
    console.log("Reloading data...");
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, [reg]);

  if (!reg) return null;
  return (
    <div>
      <Modal
        title="Examination Permit Preview"
        open={registrationPermitModalVisible}
        onCancel={() => dispatch(setRegistrationPermitModalVisible(false))}
        footer={false}
        width={1000}
        style={{ top: 20, maxHeight: 500 }}
      >
        <Alert
          message={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Text>REGISTRATION TOKEN: {reg?.registration_token}</Text>
              </div>

              <Space>
                <Button
                  type="primary"
                  size="small"
                  ghost
                  icon={<Refresh />}
                  onClick={handleReload}
                >
                  Reload
                </Button>
                <Button
                  type="primary"
                  size="small"
                  ghost
                  icon={<Print />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </Space>
            </div>
          }
        />
        <div
          ref={scrollContainerRef}
          style={{
            position: "relative",
            maxHeight: "calc(100vh - 220px)",
            overflowY: "hidden",
          }}
        >
          <div>
            <PrintableContent
              study_yr={study_yr}
              semester={semester}
              ref={componentRef}
              selectedModules={selectedModules}
              reg={reg}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExaminationPermit;
