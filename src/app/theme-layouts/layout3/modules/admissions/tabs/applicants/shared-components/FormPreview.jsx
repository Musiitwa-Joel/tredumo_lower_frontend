import { useContext, useRef } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { Printer, RefreshCcw } from "lucide-react";
import styled from "styled-components";
import { useReactToPrint } from "react-to-print";
import { url2 } from "app/configs/apiConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  selectApplicationForm,
  selectApplicationPreviewModalOpen,
  setAddStdToAdmissionModalVisible,
  setApplicationPreviewModalOpen,
} from "../../../admissionsSlice";
import checkSchemeStatus from "app/theme-layouts/layout3/utils/checkSchemeStatus";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
// import "./print.css";

const TableContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: auto;
  text-align: center;
  margin-top: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 2px 10px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
    color: #1a4b96;
    font-weight: bold;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  text-align: left;
  width: 25%;
  background-color: #f4f4f4;
  font-weight: bold;
  padding: 2px 10px;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 2px 10px;
  text-align: left;
  width: 25%;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const FormPreview = () => {
  const applicationForm = useSelector(selectApplicationForm);
  const contentRef = useRef(null);

  //   const contentRef = useRef<HTMLDivElement>(null);
  const applicationDetails = applicationForm?.application;
  const form_sections = applicationForm?.applicant_form_sections;
  const dispatch = useDispatch();
  const applicationPreviewModalOpen = useSelector(
    selectApplicationPreviewModalOpen
  );
  const reactToPrintFn = useReactToPrint({
    contentRef,
    // onBeforePrint: async () => {
    //   const style = document.createElement("style");
    //   style.innerHTML = `
    //       @media print {
    //         body {
    //           font-family: Arial, sans-serif;
    //           color: black;
    //           background: white;
    //         }
    //         .no-print {
    //           display: none !important;
    //         }
    //         .page-break {
    //           page-break-before: always;
    //         }
    //         h1 {
    //         font-size: 24pt;
    //     }

    //     h2 {
    //         font-size: 18pt;
    //     }

    //     .print-container {
    //         padding: 20mm; /* Adjust print padding */
    //     }

    //     @page {
    //       size: A4;
    //       margin: 15mm 10mm; /* Custom page margins */
    //     }
    //       }
    //     `;
    //   document.head.appendChild(style);
    // },
  });

  let leftOlevelColumn = [];
  let rightOlevelColumn = [];

  let leftAlevelColumn = [];
  let rightAlevelColumn = [];

  //   console.log("application details", applicationDetails);
  //   console.log("form sections", form_sections);

  // Split oleveel results into  two equal columns

  if (!applicationDetails) return;

  if (
    applicationDetails?.olevel_info?.uneb_results &&
    applicationDetails?.olevel_info?.uneb_results?.length > 0
  ) {
    const midIndex = Math.ceil(
      applicationDetails.olevel_info.uneb_results.length / 2
    );
    leftOlevelColumn = applicationDetails.olevel_info.uneb_results.slice(
      0,
      midIndex
    );
    rightOlevelColumn =
      applicationDetails.olevel_info.uneb_results.slice(midIndex);
  }

  if (
    applicationDetails?.alevel_info?.uneb_results &&
    applicationDetails?.alevel_info?.uneb_results?.length > 0
  ) {
    const midIndex = Math.ceil(
      applicationDetails.alevel_info.uneb_results.length / 2
    );
    leftAlevelColumn = applicationDetails.alevel_info.uneb_results.slice(
      0,
      midIndex
    );
    rightAlevelColumn =
      applicationDetails.alevel_info.uneb_results.slice(midIndex);
  }

  return (
    <Modal
      title={
        <div
          style={{
            padding: "7px 10px",
          }}
          className="font-bold py-2 px-4 rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-500 no-print"
        >
          {"APPLICATION PREVIEW"}
        </div>
      }
      open={applicationPreviewModalOpen}
      onOk={() => dispatch(setApplicationPreviewModalOpen(false))}
      onCancel={() => dispatch(setApplicationPreviewModalOpen(false))}
      maskClosable={false}
      width={850}
      style={{
        top: 0,
      }}
      styles={{
        body: {
          paddingLeft: 10,
          paddingRight: 10,
          height: "auto",
          // Ensure the content is not clipped
        },
        content: {
          padding: 0,
          height: "auto",
          // Ensure the content is not clipped
        },
        footer: {
          padding: 10,
        },
      }}
      zIndex={1000}
    >
      <div
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}
        className="no-print"
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
              FORM NUMBER: {applicationDetails?.form_no}
              <Space size="large">
                <Button
                  type="primary"
                  danger
                  //   ghost
                  size="small"
                  onClick={() =>
                    dispatch(setAddStdToAdmissionModalVisible(true))
                  }
                  disabled={applicationDetails?.is_admitted}
                  //   icon={<RefreshCcw size={13} />}
                >
                  ADD STUDENT TO ADMISSION LIST
                </Button>
                <Button
                  size="small"
                  icon={<Printer size={13} />}
                  //   onClick={handlePrint}
                  onClick={() => reactToPrintFn()}
                >
                  PRINT FORM
                </Button>
              </Space>
            </div>
          }
        />
      </div>
      {/* <div ref={componentRef}>Content to print</div> */}
      <div id="printable-content" ref={contentRef}>
        <div
          className="bg-white p-0"
          style={{ height: "auto", overflow: "visible" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-4">
              {/* Logo Section */}
              <img
                width={90}
                src={`${url2}/university/nkumba-logo.png`}
                style={{
                  marginRight: 0,
                }}
              />

              {/* Text Content */}
              <div className="flex-grow justify-center">
                {/* University Name */}
                <h1
                  style={{
                    fontSize: "4.0rem",
                  }}
                  className="text-center text-[1.9rem] font-serif text-[#1a4b96] leading-tight mb-2"
                >
                  Nkumba University Online Application Form
                </h1>

                {/* Charter Text */}
                <div
                  style={{
                    fontSize: "1.2rem",
                  }}
                  className="text-center text-[0.6rem] text-gray-600 uppercase Tracking-wide mt-0 pb-0"
                >
                  CHARTERED SINCE 2006 BY THE GOVERNMENT OF UGANDA
                </div>

                {/* RegisTrar Title */}
                <div className="mt-0 border-t border-gray-700 py-1">
                  <h2
                    style={{
                      fontSize: "2.6rem",
                      margin: "2px 0px",
                    }}
                    className="text-center text-[1.2rem] font-bold text-red-700 Tracking-wide"
                  >
                    OFFICE OF THE ACADEMIC REGISTRAR
                  </h2>
                </div>
              </div>
            </div>
            <div
              className="mt-0 border-t border-red-800 py-1"
              style={{
                borderTopWidth: 1.5,
              }}
            >
              {/* Mission Statement */}
              {/* <div className="mt-0 text-[0.75rem] text-gray-700">
              The mission of The University is to provide an environment That
              enables The cultivation of Competence, Confidence, Creativity, and
              Character, in The academic, professional and social interactions.
            </div> */}
            </div>
          </div>
        </div>

        <TableContainer>
          <Typography.Title level={5}>FORM DETAILS</Typography.Title>
          <Table>
            <Tr>
              <Th>ACADEMIC YEAR</Th>
              <Td>
                {applicationDetails?.running_admissions?.acc_yr?.acc_yr_title}
              </Td>

              <Th>INTAKE</Th>
              <Td>
                {applicationDetails?.running_admissions?.intake?.intake_title}
              </Td>
            </Tr>
            <Tr>
              <Th>SCHEME</Th>
              <Td>
                {applicationDetails?.running_admissions?.scheme?.scheme_title}
              </Td>

              <Th>FORM NUMBER</Th>
              <Td>{applicationDetails?.form_no}</Td>
            </Tr>
            <Tr>
              <Th>CATEGORY</Th>
              <Td>
                {
                  applicationDetails?.running_admissions?.admission_level
                    ?.admission_level_title
                }
              </Td>

              <Th>APPLICATION FEE</Th>
              <Td>
                UGX{" "}
                {parseInt(applicationDetails?.application_fee).toLocaleString()}
              </Td>
            </Tr>
            <Tr>
              <Th>PAYMENT STATUS</Th>
              <Td>PENDING</Td>

              <Th>SCHEME STATUS</Th>
              <Td>
                {checkSchemeStatus(
                  parseInt(applicationDetails?.running_admissions?.start_date),
                  parseInt(applicationDetails?.running_admissions?.end_date)
                ) == "running" ? (
                  <Typography.Text className="p-0 font-bold text-green-600">
                    RUNNING
                  </Typography.Text>
                ) : (
                  <Typography.Text className="p-0 font-bold text-red-600">
                    STOPPED
                  </Typography.Text>
                )}
              </Td>
            </Tr>
            <Tr>
              <Th>FORM STATUS</Th>
              <Td>
                {applicationDetails ? (
                  applicationDetails.status == "in_progress" ? (
                    <Typography.Text className="p-0 font-bold text-green-600">
                      IN PROGRESS
                    </Typography.Text>
                  ) : (
                    <Typography.Text className="p-0 font-bold text-blue-400">
                      {applicationDetails.status.toUpperCase()}
                    </Typography.Text>
                  )
                ) : (
                  <Typography.Text className="p-0 font-bold text-orange-400">
                    {"PENDING"}
                  </Typography.Text>
                )}
              </Td>
              <Th>CREATED ON</Th>
              <Td>
                {convertTimestampToDate(applicationDetails?.creation_date)}
              </Td>
            </Tr>
            <Tr>
              <Th>SUBMITTED ON</Th>
              <Td>
                {applicationDetails?.submission_date
                  ? convertTimestampToDate(applicationDetails?.submission_date)
                  : "---"}
              </Td>
            </Tr>
          </Table>

          {form_sections && (
            <>
              <div
                style={{
                  marginTop: 10,
                }}
              >
                <Typography.Title
                  level={5}
                  style={{
                    textAlign: "center",
                  }}
                >
                  APPLICANT DETAILS
                </Typography.Title>

                {form_sections.map((section) => (
                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    <Divider
                      orientation="left"
                      orientationMargin="0"
                      style={{
                        borderColor: "#ddd",
                        color: "#1a4b96",
                      }}
                    >
                      {section.section_title}
                    </Divider>
                    {section.section_id == "bio_data" && (
                      <div className="table-container">
                        <Table>
                          <Tr>
                            <Th>APPLICANT'S NAME</Th>
                            <Td>
                              {applicationDetails.applicant.surname +
                                " " +
                                applicationDetails.applicant.other_names}
                            </Td>

                            <Th>SALUTATION</Th>
                            <Td>{applicationDetails.applicant.salutation}</Td>
                          </Tr>
                          <Tr>
                            <Th>GENDER</Th>
                            <Td>
                              {applicationDetails.applicant.gender?.toUpperCase()}
                            </Td>

                            <Th>EMAIL</Th>
                            <Td>{applicationDetails.applicant.email}</Td>
                          </Tr>
                          <Tr>
                            <Th>PHONE NUMBER</Th>
                            <Td>{applicationDetails.applicant.phone_no}</Td>

                            <Th>MARITAL STATUS</Th>
                            <Td>
                              {applicationDetails.applicant.marital_status?.toUpperCase()}
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>RELIGION</Th>
                            <Td>{applicationDetails.applicant.religion}</Td>

                            <Th>DATE OF BIRTH</Th>
                            <Td>
                              {applicationDetails?.applicant?.date_of_birth
                                ? convertTimestampToDate(
                                    applicationDetails.applicant.date_of_birth
                                  )
                                : null}
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>NATIONALITY</Th>
                            <Td>
                              {
                                applicationDetails.applicant.nationality
                                  .nationality_title
                              }
                            </Td>
                            <Th>DISTRICT OF ORIGIN</Th>
                            <Td>
                              {applicationDetails.applicant.district_of_origin}
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>DISTRICT OF BIRTH</Th>
                            <Td>
                              {applicationDetails.applicant.district_of_birth}
                            </Td>
                            <Th>PLACE OF RESIDENCE</Th>
                            <Td>
                              {applicationDetails.applicant.place_of_residence}
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>NATIONAL ID NO</Th>
                            <Td>
                              {applicationDetails?.applicant?.nin
                                ? applicationDetails.applicant.nin
                                : "---"}
                            </Td>
                          </Tr>
                        </Table>
                      </div>
                    )}

                    {section.section_id === "programme_choices" &&
                      (applicationDetails?.program_choices?.length === 0 ? (
                        <Empty />
                      ) : (
                        <StyledTable>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Code</th>
                              <th>Program</th>
                              <th>Campus</th>
                              <th>Study Time</th>
                              <th>Entry Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applicationDetails.program_choices.map(
                              (choice, index) => (
                                <tr key={index}>
                                  <th scope="row">{choice.choice_no}</th>
                                  <td>{choice.course.course_code}</td>
                                  <td>{choice.course.course_title}</td>
                                  <td>{choice.campus_title}</td>
                                  <td>{choice.study_time_title}</td>
                                  <td>{choice.entry_yr}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </StyledTable>
                      ))}

                    {section.section_id === "o_level" &&
                      (!applicationDetails?.olevel_info ? (
                        <Empty />
                      ) : applicationDetails.olevel_info.did_exams ? (
                        <>
                          <Row gutter={80}>
                            <Col span={10}>
                              SCHOOL:{" "}
                              <strong>
                                {" "}
                                {
                                  applicationDetails.olevel_info.school
                                    .center_name
                                }
                              </strong>
                            </Col>
                            <Col span={6}>
                              INDEX NO:{" "}
                              <strong>
                                {" "}
                                {`${applicationDetails.olevel_info.school.center_number}/${applicationDetails.olevel_info.index_no}`}
                              </strong>
                            </Col>
                            <Col span={8}>
                              YEAR OF SITTING:{" "}
                              <strong>
                                {" "}
                                {applicationDetails.olevel_info.year_of_sitting}
                              </strong>
                            </Col>
                          </Row>

                          {/* Results Grid */}
                          <div
                            style={{
                              maxWidth: 700,
                              marginTop: 10,
                            }}
                          >
                            <div className="grid grid-cols-2 gap-x-32 gap-y-4">
                              {/* Left Column */}
                              <div className="space-y-1">
                                {leftOlevelColumn.map((result) => (
                                  <div
                                    key={result.id}
                                    className="grid grid-cols-[1fr_auto] gap-x-8"
                                  >
                                    <div className="text-right">
                                      {result.subject.uneb_subject_title}:
                                    </div>
                                    <div className="font-bold">
                                      {result.grade}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Right Column */}
                              <div className="space-y-1">
                                {rightOlevelColumn.map((result) => (
                                  <div
                                    key={result.id}
                                    className="grid grid-cols-[1fr_auto] gap-x-8"
                                  >
                                    <div className="text-right">
                                      {result.subject.uneb_subject_title}:
                                    </div>
                                    <div className="font-bold">
                                      {" "}
                                      {result.grade}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Alert message="APPLICANT DIDN'T SIT FOR UNEB O-LEVEL EXAMINATION" />
                      ))}

                    {section.section_id === "a_level" &&
                      (!applicationDetails?.alevel_info ? (
                        <Empty />
                      ) : applicationDetails.alevel_info.did_exams ? (
                        <>
                          <Row gutter={80}>
                            <Col span={10}>
                              SCHOOL:{" "}
                              <strong>
                                {" "}
                                {
                                  applicationDetails.alevel_info.school
                                    .center_name
                                }
                              </strong>
                            </Col>
                            <Col span={6}>
                              INDEX NO:{" "}
                              <strong>
                                {" "}
                                {`${applicationDetails.alevel_info.school.center_number}/${applicationDetails.alevel_info.index_no}`}
                              </strong>
                            </Col>
                            <Col span={8}>
                              YEAR OF SITTING:{" "}
                              <strong>
                                {" "}
                                {applicationDetails.alevel_info.year_of_sitting}
                              </strong>
                            </Col>
                          </Row>

                          {/* Results Grid */}
                          <div
                            style={{
                              maxWidth: 700,
                              marginTop: 10,
                            }}
                          >
                            <div className="grid grid-cols-2 gap-x-32 gap-y-4">
                              {/* Left Column */}
                              <div className="space-y-1">
                                {leftAlevelColumn.map((result) => (
                                  <div
                                    key={result.id}
                                    className="grid grid-cols-[1fr_auto] gap-x-8"
                                  >
                                    <div className="text-right">
                                      {result.subject.uneb_subject_title}:
                                    </div>
                                    <div className="font-bold">
                                      {result.grade}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Right Column */}
                              <div className="space-y-1">
                                {rightAlevelColumn.map((result) => (
                                  <div
                                    key={result.id}
                                    className="grid grid-cols-[1fr_auto] gap-x-8"
                                  >
                                    <div className="text-right">
                                      {result.subject.uneb_subject_title}:
                                    </div>
                                    <div className="font-bold">
                                      {" "}
                                      {result.grade}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Alert message="APPLICANT DIDN'T SIT FOR UNEB O-LEVEL EXAMINATION" />
                      ))}

                    {section.section_id === "other_qualifications" &&
                      (applicationDetails.has_other_qualifications ? (
                        applicationDetails.other_qualifications?.length > 0 ? (
                          <StyledTable>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Institute Name</th>
                                <th>Award Obtained</th>
                                <th>Grade</th>
                                <th>Award Duration</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {applicationDetails.other_qualifications.map(
                                (qual, index) => (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{qual.institute_name}</td>
                                    <td>{qual.award_obtained}</td>
                                    <td>{qual.grade}</td>
                                    <td>{qual.award_duration}</td>
                                    <td>
                                      {convertTimestampToDate(qual.start_date)}
                                    </td>
                                    <td>
                                      {convertTimestampToDate(qual.end_date)}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </StyledTable>
                        ) : (
                          <Empty />
                        )
                      ) : (
                        <Alert message="APPLICANT DOESN'T HAVE OTHER QUALIFICATIONS" />
                      ))}

                    {section.section_id === "attachments" &&
                      (applicationDetails &&
                      applicationDetails?.has_attachments !== null ? (
                        applicationDetails?.has_attachments && (
                          <StyledTable>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>File</th>
                              </tr>
                            </thead>
                            <tbody>
                              {applicationDetails.attachments.map(
                                (attachment, index) => (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{attachment.description}</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        href={`${attachment.url}`}
                                        className="text-[#1a4b96]"
                                      >
                                        {attachment.file_name}
                                      </a>{" "}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </StyledTable>
                        )
                      ) : applicationDetails?.has_attachments === null ? (
                        <Empty />
                      ) : (
                        !applicationDetails?.has_attachments && (
                          <Alert message="YOU SELECTED YOU DON'T HAVE ANY ATTACHMENTS" />
                        )
                      ))}

                    {section.section_id === "next_of_kin" &&
                      (applicationDetails &&
                      applicationDetails?.next_of_kin !== null ? (
                        <div className="table-container">
                          <Table>
                            <Tr>
                              <Th>FULL NAME</Th>
                              <Td>
                                {applicationDetails.next_of_kin?.full_name?.toUpperCase() ||
                                  "N/A"}
                              </Td>

                              <Th>EMAIL</Th>
                              <Td>
                                {applicationDetails.next_of_kin?.email || "N/A"}
                              </Td>
                            </Tr>
                            <Tr>
                              <Th>RELATIONSHIP</Th>
                              <Td>
                                {applicationDetails.next_of_kin?.relation ||
                                  "N/A"}
                              </Td>

                              <Th>MOBILE NO</Th>
                              <Td>
                                {applicationDetails.next_of_kin?.phone_no ||
                                  "N/A"}
                              </Td>
                            </Tr>
                            <Tr>
                              <Th>ADDRESS</Th>
                              <Td>
                                {applicationDetails.next_of_kin?.address ||
                                  "N/A"}
                              </Td>
                            </Tr>
                          </Table>
                        </div>
                      ) : (
                        <Empty />
                      ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </TableContainer>
      </div>
    </Modal>
  );
};
export default FormPreview;
