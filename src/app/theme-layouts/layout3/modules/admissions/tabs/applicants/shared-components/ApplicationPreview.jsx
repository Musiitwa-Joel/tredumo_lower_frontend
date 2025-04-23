// import { faPrint, faRefresh } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Empty, Row } from "antd";
// import { Alert, Image, Table, Badge as Badge2 } from "react-bootstrap";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";
import { Descriptions, Card, Alert } from "antd";
import Typography from "@mui/material/Typography";
// import Empty from "../empty/Empty";
import { useSelector } from "react-redux";
// import { selectApplication } from "../../store/appSlice";
import {
  selectApplicationForm,
  selectSelectedApplications,
} from "../../../admissionsSlice";
import "./mystyles.css";
import formatToShortDate from "app/theme-layouts/layout3/utils/formatToShortDate";
import { url2 } from "app/configs/apiConfig";
// import checkSchemeStatus from "../../utils/checkSchemeStatus";
// import formatApplicationDate from "../../utils/formatApplicationDate";
// import formatToShortDate from "../../utils/formatToShortDate";

function ApplicationPreview() {
  const applicationForm = useSelector(selectApplicationForm);
  const selectedApplications = useSelector(selectSelectedApplications);
  const form_details = selectedApplications[selectedApplications.length - 1];

  // console.log("application form", applicationForm);
  //   console.log("form details", form_details)
  if (!form_details) return null;
  return (
    <div
      style={{
        width: "100%",

        // overflow: "auto",
      }}
    >
      <div>
        <Alert
          style={{
            padding: 0,
          }}
          message={
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 7,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                FORM NUMBER: {applicationForm.form_no}
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    type="primary"
                    // danger
                    size="small"
                    style={{
                      marginRight: 10,
                      backgroundColor: "#1677ff",
                    }}
                  >
                    {/* <FontAwesomeIcon
                icon={faRefresh}
                style={{
                  marginRight: 5,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              /> */}
                    RELOAD FORM
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    // danger
                    style={{
                      backgroundColor: "#1677ff",
                    }}
                  >
                    {/* <FontAwesomeIcon
                icon={faPrint}
                style={{
                  marginRight: 5,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              /> */}
                    PRINT FORM
                  </Button>
                </div>
              </div>
            </>
          }
        ></Alert>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
          flexWrap: "wrap",
          alignContent: "center",
        }}
      >
        <img
          width={150}
          src={`${url2}/university/nkumba-logo.png`}
          style={{
            marginRight: 20,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              NKUMBA UNIVERSITY ONLINE APPLICATION FORM
            </Typography>
          </div>

          <div
            style={{
              marginBottom: 15,
            }}
          >
            <Typography
              variant="p"
              letterSpacing="0.4rem"
              fontWeight="bold"
              fontSize="1.7rem"
              color="#6c757d"
            >
              CHARTERED SINCE 2006 BY THE GOVERNMENT OF UGANDA
            </Typography>
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontStyle: "italic",
              textAlign: "center",
              //   fontWeight: "bold",
            }}
            className="text-muted fw-bold"
          >
            <Typography
              variant="p"
              gutterBottom
              // letterSpacing="0.4rem"
              fontWeight="bold"
              fontSize="2.0rem"
              color="#6c757d"
              fontStyle="italic"
            >
              Office of the Academic Registrar
            </Typography>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "gray",
          width: "100%",
          height: 2,
          marginBottom: 20,
        }}
      />

      <div
        style={{
          marginBottom: 30,
          //   width: 900,
          overflow: "auto",
        }}
      >
        <Descriptions
          title="FORM DETAILS"
          size="small"
          style={{
            textAlign: "center",
            margin: 0,
            width: "100%",
          }}
          bordered
          items={[
            {
              key: "1",
              label: "ACADEMIC YEAR",
              children: form_details.running_admissions.acc_yr.acc_yr_title,
              span: 1,
            },
            {
              key: "2",
              label: "INTAKE",
              children: form_details.running_admissions.intake.intake_title,
              span: 1,
            },
            {
              key: "3",
              label: "SCHEME",
              children: form_details.running_admissions.scheme.scheme_title,
              span: 1,
            },
            {
              key: "4",
              label: "FORM NUMBER",
              children: form_details.form_no,
              span: 1,
            },
            {
              key: "5",
              label: "CATEGORY",
              children:
                form_details.running_admissions.admission_level
                  .admission_level_title,
              span: 1,
            },
            {
              key: "6",
              label: "APPLICATION FEE",
              children: `UGX ${form_details.application_fee}`,
              span: 3,
            },
            {
              key: "7",
              label: "PAYMENT STATUS",
              children: "Payment Received - APPLICATION SUBMITTED",
              span: 6,
            },
            {
              key: "8",
              label: "SCHEME STATUS",
              // children:
              //   checkSchemeStatus(
              //     parseInt(form_details.running_admissions.start_date),
              //     parseInt(form_details.running_admissions.end_date)
              //   ) == "running" ? (
              //     <Badge2
              //       bg="primary"
              //       className=""
              //       style={{
              //         fontSize: 12,
              //       }}
              //     >
              //       RUNNING
              //     </Badge2>
              //   ) : (
              //     <Badge2
              //       bg="danger"
              //       className=""
              //       style={{
              //         fontSize: 12,
              //       }}
              //     >
              //       STOPPED
              //     </Badge2>
              //   ),
              span: 1,
            },
            {
              key: "9",
              label: "FORM STATUS",
              // children:
              //   form_details.status == "in_progress" ? (
              //     <Badge2
              //       bg="warning"
              //       className=""
              //       style={{
              //         fontSize: 12,
              //       }}
              //     >
              //       {"IN PROGRESS"}
              //     </Badge2>
              //   ) : (
              //     form_details.status.toUpperCase()
              //   ),
              span: 1,
            },
            {
              key: "10",
              label: "CREATED ON",
              // children: formatToShortDate(parseInt(form_details.creation_date)),
              span: 1,
            },
            {
              key: "11",
              label: "SUBMITTED ON",
              children: "---",
              span: 1,
            },
          ]}
          column={2}
          labelStyle={{
            fontWeight: "bold",
            //   backgroundColor: "red",
            width: 200,
          }}
          contentStyle={{
            borderBottomColor: "red",
            //   backgroundColor: "red",
            textAlign: "left",
          }}
        />
      </div>
      <div
        style={{
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "0.9rem",
          marginBottom: 20,
        }}
      >
        <Typography variant="p" fontWeight="bold" fontSize="2.0rem">
          APPLICANT DETAILS
        </Typography>
      </div>

      {applicationForm.applicant && (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="BIO DATA"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            <Descriptions
              // title="FORM DETAILS"
              size="small"
              style={{
                textAlign: "center",
                margin: 0,
              }}
              // bordered
              items={[
                {
                  key: "1",
                  label: "APPLICANT'S NAME",
                  children: `${applicationForm.applicant.surname} ${applicationForm.applicant.other_names}`,
                  span: 1,
                },
                {
                  key: "2",
                  label: "SALUTATION",
                  children: `${applicationForm.applicant.salutation}`,
                  span: 1,
                },
                {
                  key: "3",
                  label: "GENDER",
                  children: `${applicationForm.applicant.gender.toUpperCase()}`,
                  span: 1,
                },
                {
                  key: "4",
                  label: "EMAIL",
                  children: `${applicationForm.applicant.email}`,
                  span: 1,
                },
                {
                  key: "5",
                  label: "PHONE NUMBER",
                  children: `${applicationForm.applicant.phone_no}`,
                  span: 1,
                },
                {
                  key: "6",
                  label: "MARITAL STATUS",
                  children: `${applicationForm.applicant.marital_status.toUpperCase()}`,
                  span: 1,
                },
                {
                  key: "7",
                  label: "RELIGION",
                  children: `${applicationForm.applicant.religion}`,
                  span: 1,
                },
                {
                  key: "8",
                  label: "DATE OF BIRTH",
                  // children: `${formatToShortDate(
                  //   parseInt(applicationForm.applicant.date_of_birth)
                  // )}`,
                  span: 1,
                },
                {
                  key: "9",
                  label: "NATIONALITY",
                  children: `${applicationForm.applicant.nationality.nationality_title}`,
                  span: 1,
                },
                {
                  key: "8",
                  label: "DISTRICT OF ORIGIN",
                  children: `${applicationForm.applicant.district_of_origin.toUpperCase()}`,
                  span: 1,
                },
                {
                  key: "9",
                  label: "DISTRICT OF BIRTH",
                  children: `${applicationForm.applicant.district_of_birth.toUpperCase()}`,
                  span: 1,
                },
                {
                  key: "10",
                  label: "PLACE OF RESIDENCE",
                  children: `${applicationForm.applicant.place_of_residence.toUpperCase()}`,
                  span: 1,
                },
                {
                  key: "11",
                  label: "NATIONAL ID NO",
                  children: `${applicationForm.applicant.nin.toUpperCase()}`,
                  span: 1,
                },
                //   {
                //     key: "12",
                //     label: "PERMANENT ADDRESS",
                //     children: "KAMPALA",
                //     span: 1,
                //   },
              ]}
              column={2}
              labelStyle={{
                fontWeight: "bold",
                //   backgroundColor: "red",
                width: 200,
                color: "black",
              }}
              contentStyle={{
                borderBottomColor: "red",
                //   backgroundColor: "red",
                textAlign: "left",
              }}
            />
          </Card>
        </div>
      )}

      {applicationForm.next_of_kin && (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="NEXT OF KIN"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            <Descriptions
              //   title="FORM DETAILS"
              size="small"
              style={{
                textAlign: "center",
                margin: 0,
              }}
              // bordered
              items={[
                {
                  key: "1",
                  label: "FULL NAME",
                  children: `${applicationForm.next_of_kin.full_name.toUpperCase()}`,
                  span: 1,
                },
                {
                  key: "2",
                  label: "EMAIL",
                  children: `${applicationForm.next_of_kin.email}`,
                  span: 1,
                },
                {
                  key: "3",
                  label: "RELATIONSHIP",
                  children: `${applicationForm.next_of_kin.relation}`,
                  span: 1,
                },
                {
                  key: "4",
                  label: "MOBILE NO",
                  children: `${applicationForm.next_of_kin.phone_no}`,
                  span: 1,
                },
                {
                  key: "5",
                  label: "ADDRESS",
                  children: `${applicationForm.next_of_kin.address}`,
                  span: 1,
                },
              ]}
              column={2}
              labelStyle={{
                fontWeight: "bold",
                //   backgroundColor: "red",
                width: 200,
                color: "black",
              }}
              contentStyle={{
                borderBottomColor: "red",
                //   backgroundColor: "red",
                textAlign: "left",
              }}
            />
          </Card>
        </div>
      )}

      {applicationForm.program_choices && (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="PROGRAM CHOICES"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            {applicationForm.program_choices.length > 0 ? (
              <div>
                <TableContainer>
                  <Table size="small" aria-label="program choices table">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Program</TableCell>
                        <TableCell>Campus</TableCell>
                        <TableCell>Study Time</TableCell>
                        <TableCell>Entry Year</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applicationForm.program_choices.map((choice, index) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {choice.choice_no}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {choice.course.course_code}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {choice.course.course_title}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {choice.campus_title}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {choice.study_time_title}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {choice.entry_yr}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>
      )}

      {applicationForm.olevel_info && (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="O LEVEL INFORMATION"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            {applicationForm.olevel_info.did_exams ? (
              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <Row gutter={80}>
                  <Col>
                    <strong>SCHOOL:</strong>{" "}
                    {applicationForm.olevel_info.school.center_name}
                  </Col>
                  <Col>
                    <strong>INDEX NO:</strong>{" "}
                    {`${applicationForm.olevel_info.school.center_number}/${applicationForm.olevel_info.index_no}`}
                  </Col>
                  <Col>
                    <strong>YEAR OF SITTING:</strong>{" "}
                    {applicationForm.olevel_info.year_of_sitting}
                  </Col>
                </Row>

                <Descriptions
                  //   title="FORM DETAILS"
                  size="small"
                  style={{
                    // textAlign: "center",
                    marginTop: 20,
                  }}
                  // bordered
                  items={applicationForm.olevel_info.uneb_results.map(
                    (result, index) => ({
                      key: `${index}`,
                      label: result.subject.uneb_subject_title,
                      children: result.grade,
                      span: 1,
                    })
                  )}
                  column={2}
                  labelStyle={{
                    fontWeight: "bold",
                    // backgroundColor: "red",
                    width: 300,
                    color: "black",
                    textAlign: "right",
                  }}
                  contentStyle={{
                    // borderBottomColor: "red",
                    // backgroundColor: "green",
                    textAlign: "center",
                    // textAlign: "end",
                  }}
                />
              </div>
            ) : (
              <div>
                <Alert>APPLICANT DIDN'T DO O LEVEL EXAMINATIONS</Alert>
              </div>
            )}
          </Card>
        </div>
      )}

      {applicationForm.alevel_info && (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="A LEVEL INFORMATION"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            {applicationForm.alevel_info.did_exams ? (
              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <Row gutter={80}>
                  <Col>
                    <strong>SCHOOL:</strong>{" "}
                    {applicationForm.alevel_info.school.center_name}
                  </Col>
                  <Col>
                    <strong>INDEX NO:</strong>{" "}
                    {`${applicationForm.alevel_info.school.center_number}/${applicationForm.olevel_info.index_no}`}
                  </Col>
                  <Col>
                    <strong>YEAR OF SITTING:</strong>{" "}
                    {applicationForm.alevel_info.year_of_sitting}
                  </Col>
                </Row>

                <Descriptions
                  //   title="FORM DETAILS"
                  size="small"
                  style={{
                    // textAlign: "center",
                    marginTop: 20,
                  }}
                  // bordered
                  items={applicationForm.alevel_info.uneb_results.map(
                    (result, index) => ({
                      key: `${index}`,
                      label: result.subject.uneb_subject_title,
                      children: result.grade,
                      span: 1,
                    })
                  )}
                  column={2}
                  labelStyle={{
                    fontWeight: "bold",
                    // backgroundColor: "red",
                    width: 300,
                    color: "black",
                    textAlign: "right",
                  }}
                  contentStyle={{
                    // borderBottomColor: "red",
                    // backgroundColor: "green",
                    textAlign: "center",
                    // textAlign: "end",
                  }}
                />
              </div>
            ) : (
              <div>
                <Alert>APPLICANT DIDN'T DO A LEVEL EXAMINATIONS</Alert>
              </div>
            )}
          </Card>
        </div>
      )}

      {applicationForm.has_attachments && (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="ATTACHMENTS"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            {applicationForm.attachments.length > 0 ? (
              <div>
                <TableContainer component={Paper}>
                  <Table
                    size="small"
                    sx={{ minWidth: 650 }}
                    aria-label="attachments table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          #
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          File
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applicationForm.attachments.map((attachment, index) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            {attachment.description}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "1.7rem",
                            }}
                          >
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {attachment.file_name}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>
      )}

      {applicationForm.has_other_qualifications ? (
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Card
            type="inner"
            title="OTHER QUALIFICATIONS"
            style={{
              // textAlign: "center",
              borderColor: "lightgray",
              padding: 0,
            }}
            size="small"
            bordered
          >
            {applicationForm.other_qualifications.length > 0 ? (
              <div>
                <TableContainer>
                  <Table
                    size="small"
                    // sx={{ minWidth: 650 }}
                    aria-label="Qualifications table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          #
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          Institute Name
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          Award Obtained
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          Award Type
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          Award Duration
                        </TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          Start Date
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          style={{
                            fontSize: "1.6rem",
                          }}
                        >
                          End Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applicationForm.other_qualifications.map(
                        (qual, index) => (
                          <TableRow key={index}>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{
                                fontSize: "1.7rem",
                              }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              sx={{ whiteSpace: "nowrap" }}
                              style={{
                                fontSize: "1.7rem",
                              }}
                            >
                              {qual.institute_name}
                            </TableCell>
                            <TableCell
                              sx={{ whiteSpace: "nowrap" }}
                              style={{
                                fontSize: "1.7rem",
                              }}
                            >
                              {qual.award_obtained}
                            </TableCell>
                            <TableCell
                              sx={{ whiteSpace: "nowrap" }}
                              style={{
                                fontSize: "1.6rem",
                              }}
                            >
                              {qual.award_type}
                            </TableCell>
                            <TableCell
                              sx={{ whiteSpace: "nowrap" }}
                              style={{
                                fontSize: "1.6rem",
                              }}
                            >
                              {qual.award_duration}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "1.6rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {qual.grade}
                            </TableCell>
                            <TableCell
                              sx={{ whiteSpace: "nowrap" }}
                              style={{
                                fontSize: "1.6rem",
                              }}
                            >
                              {formatToShortDate(parseInt(qual.start_date))}
                            </TableCell>
                            <TableCell
                              sx={{ whiteSpace: "nowrap" }}
                              style={{
                                fontSize: "1.6rem",
                              }}
                            >
                              {formatToShortDate(parseInt(qual.end_date))}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default ApplicationPreview;
