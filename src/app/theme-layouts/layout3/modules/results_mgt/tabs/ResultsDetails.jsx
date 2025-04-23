import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Typography,
  Select,
  Button,
  Divider,
  Tooltip,
} from "antd";
import { createStyles } from "antd-style";
import {
  Download,
  Upload,
  Printer,
  History,
  LucideView,
  Settings,
} from "lucide-react";
import PublishResultsModal from "./PublishResultsModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoadingResults,
  selectResults,
  selectResultsConfigurations,
  selectSelectedTreeItem,
  selectTestimonialsToPrint,
  setActiveTab,
  setMarksDetails,
  setPublishResultsModalVisible,
  setResultsConfigModalVisible,
  setResultsConfigurations,
  setStdNo,
  setTestimonialsToPrint,
} from "../store/resultsSlice";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_RESULTS_CONFIG, LOAD_STDS_RESULTS } from "../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAsyncError, useNavigate } from "react-router";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { getUniqueRecords } from "./testimonials/ResultsTable";
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  name: "John Brown",
  age: i + 1,
  street: "Lake Park",
  building: "C",
  number: 2035,
  companyAddress: "Lake Street 42",
  companyName: "SoftLake Co",
  gender: "M",
}));

const ResultDetails = () => {
  const { styles } = useStyle();
  const dispatch = useDispatch();
  const configurations = useSelector(selectResultsConfigurations);
  const selectedItem = useSelector(selectSelectedTreeItem);
  const loadingResults = useSelector(selectLoadingResults);
  const results = useSelector(selectResults);
  const { error, loading, data } = useQuery(GET_RESULTS_CONFIG, {
    notifyOnNetworkStatusChange: true,
  });
  const [
    loadStdsResults,
    { error: loadErr, loading: loadingStdsResults, data: laodRes },
  ] = useLazyQuery(LOAD_STDS_RESULTS, {
    notifyOnNetworkStatusChange: true,
  });
  const testimonialsToPrint = useSelector(selectTestimonialsToPrint);

  // console.log("results", results);
  // console.log("configurations", configurations);

  const columns = [
    {
      title: "#",
      dataIndex: "idex",
      key: "index",
      width: 40,
      fixed: "left",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Std No",
      dataIndex: "student_no",
      key: "student_no",
      width: 110,
      fixed: "left",
      ellipsis: true,
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "John",
          value: "John",
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      render: (text) => (
        <Typography.Link
          style={{
            textDecoration: "none",
          }}
          onClick={() => {
            dispatch(setStdNo(text));
            dispatch(setActiveTab("testimonials"));
            dispatch(setMarksDetails([]));
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      fixed: "left",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "John",
          value: "John",
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      render: (text, record) =>
        `${record.biodata.surname} ${record.biodata.other_names}`,
      ellipsis: true,
    },
    {
      title: "Reg No",
      dataIndex: "registration_no",
      key: "registration_no",
      width: 180,
      ellipsis: true,
      // fixed: "left",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "John",
          value: "John",
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },

    ...(results
      ? results.course_units.map((unit) => {
          return {
            title: (
              <Tooltip title={unit.course_unit_title}>
                <Typography.Text>{unit.course_unit_code}</Typography.Text>
              </Tooltip>
            ),
            key: unit.course_unit_code,
            children: [
              {
                title: "CW",
                dataIndex: `${unit.course_unit_code}_cw`,
                key: `${unit.course_unit_code}_cw`,
                width: 70,
                sorter: (a, b) => a.age - b.age,
                render: (text, record) => {
                  const result = record.student_marks.find(
                    (mark) => unit.course_unit_code == mark.course_unit_code
                  );
                  if (!result) {
                    return null;
                  }

                  return result.coursework;
                },
              },
              {
                title: "Ex",
                dataIndex: `${unit.course_unit_code}_ex`,
                key: `${unit.course_unit_code}_ex`,
                width: 70,
                sorter: (a, b) => a.age - b.age,
                render: (text, record) => {
                  const result = record.student_marks.find(
                    (mark) => unit.course_unit_code == mark.course_unit_code
                  );
                  if (!result) {
                    return null;
                  }

                  return result.exam;
                },
              },
              {
                title: "Mrk",
                dataIndex: `${unit.course_unit_code}_mrk`,
                key: `${unit.course_unit_code}_mrk`,
                width: 70,
                sorter: (a, b) => a.age - b.age,
                render: (text, record) => {
                  const result = record.student_marks.find(
                    (mark) => unit.course_unit_code == mark.course_unit_code
                  );
                  if (!result) {
                    return null;
                  }

                  return result.final_mark;
                },
              },
              {
                title: "GP",
                dataIndex: `${unit.course_unit_code}_gp`,
                key: `${unit.course_unit_code}_gp`,
                width: 70,
                sorter: (a, b) => a.age - b.age,
                render: (text, record) => {
                  const result = record.student_marks.find(
                    (mark) => unit.course_unit_code == mark.course_unit_code
                  );
                  if (!result) {
                    return null;
                  }

                  return result.grade_point;
                },
              },
            ],
          };
        })
      : []),
    {
      title: "CGPA",
      dataIndex: "age",
      key: "age",
      width: 70,
      sorter: (a, b) => {
        if (a.student_marks[0] && b.student_marks[0]) {
          return a.student_marks[0].CGPA - b.student_marks[0].CGPA;
        }
      },
      render: (text, record) => {
        if (record.student_marks.length > 0) {
          return record.student_marks[0].CGPA;
        }
      },
      // fixed: "right",
    },

    {
      title: "Remarks",
      dataIndex: "gender",
      key: "gender",
      width: 80,
      render: (text, record) => {
        if (record.student_marks.length > 0) {
          return record.student_marks[0].remarks;
        }
      },
      // fixed: "right",
    },
  ];

  useEffect(() => {
    if (data) {
      dispatch(setResultsConfigurations(data.get_result_config));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }
  }, [error, loadErr]);

  const handleSelections = (selectedRowKeys, selectedRows) => {
    const selectedStdnos = selectedRows.map((row) => row.student_no);
    // console.log("selected stds", selectedStdnos);
    dispatch(setTestimonialsToPrint(selectedStdnos));
  };

  const handlePrintTestimonnials = async () => {
    const res = await loadStdsResults({
      variables: {
        studentNos: testimonialsToPrint,
      },
    });

    // console.log("response", res.data.std_marks);

    if (res.data.std_marks) {
      const htmlTemplates = res.data.std_marks.map((marksDetails) => {
        const uniqueRecords = getUniqueRecords(marksDetails?.student_marks);

        return `
          <html>
            <head>
              <title>TESTIMONIAL</title>
              <script src="dist/require.js"></script>
              <style>
              
                 @font-face {
              font-family: Rotunda;
              src: url(assets/fonts/Rotunda-regular.ttf);
            }
            div,
            b,
            p,
            th {
              font-family: Rotunda;
            }
            td {
              font-family: Rotunda;
            }
                /* Apply Rotunda font globally */
                body {
                  font-family: 'Rotunda', serif;
                }
          
                .banner {
                  background: url(https://staff1.zeevarsity.com/static/images/out/nkumba_ban.png);
                  background-size: 800px 120px;
                  height: 95px;
                  width: 80%;
                  background-repeat: no-repeat;
                  background-position: 50% -15;
                }
                .banner-wrap {
                  height: auto;
                  width: 100%;
                  border: 1px solid grey;
                  background: #f0f0f0;
                }
                .title {
                  font-size: 20px;
                  text-align: center;
                  padding-top: 10px;
                }
                .tdd {
                  background: #a8a8a8;
                  padding: 1px;
                  font-size: 11px;
                  text-shadow: 1px 1px black;
                  color: white;
                  border: 1px dashed black;
                  font-weight: bold;
                }
                .card {
                  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.32), 0 1px 1px rgba(0, 0, 0, 0.4);
                }
                .marks th {
                  background: #f0f0f0;
                  text-align: start;
                  font-size: 11px;
                }
              </style>
              <script>
                var __awesome_qr_base_path = "dist";
                require([__awesome_qr_base_path + "/awesome-qr"], function (AwesomeQR) {
                  var img = new Image();
                  img.onload = () => {};
                  img.src = "./nkumba.png";
                  img.style = "display:none;";
                });
              </script>
              <script
                type="text/javascript"
                charset="utf-8"
                async=""
                data-requirecontext="_"
                data-requiremodule="dist/awesome-qr"
                src="./dist/awesome-qr.js"
              ></script>
              <script
                type="text/javascript"
                charset="utf-8"
                async=""
                data-requirecontext="_"
                data-requiremodule="dist/gif"
                src="./dist/gif.js"
              ></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            </head>
            <body>
              <div class="banner-wrap" align="center"><div class="banner"></div></div>
              <div class="title">
                <b>TESTIMONIAL</b>
              </div>
              <div align="center">
                <table
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    border-color: grey;
                    font-size: 10px;
                  "
                >
                  <tbody>
                    <tr>
                      <td style="width: 90px">
                        <div
                          id="qrcode${marksDetails?.student_no}"
                          class="card"
                          style="width: 100px; height: 100px"
                        ></div>
                      </td>
                      <td style="width: 10px"></td>
                      <td>
                        <table style="width: 100%; font-size: 10px">
                          <tbody>
                            <tr>
                              <td style="width: 10%">Name:</td>
                              <td style="width: 35%; font-weight: bold">
                                 ${marksDetails?.biodata?.surname + " " + marksDetails?.biodata?.other_names}
                              </td>
                              <td style="width: 15%">Gender:</td>
                              <td style="width: 40%; font-weight: bold">M</td>
                            </tr>
                            <tr>
                              <td style="width: 10%">Reg No.:</td>
                              <td style="width: 35%; font-weight: bold">
                                 ${marksDetails?.registration_no}
                              </td>
                              <td style="width: 15%">Course:</td>
                              <td style="width: 40%; font-weight: bold">
                                 ${marksDetails?.course_details?.course?.course_title}
                              </td>
                            </tr>
                            <tr>
                              <td style="width: 10%">Std No.:</td>
                              <td style="width: 35%; font-weight: bold"> ${marksDetails?.student_no}</td>
                              <td style="width: 15%">Date Of Birth:</td>
                              <td style="width: 40%; font-weight: bold">
                                 ${marksDetails?.biodata?.date_of_birth ? convertTimestampToDate(parseInt(marksDetails?.biodata?.date_of_birth)) : ""}
                              </td>
                            </tr>
                            <tr>
                              <td style="width: 10%">School:</td>
                              <td style="width: 35%; font-weight: bold">
                                ${marksDetails?.course_details?.course?.school?.school_title}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td style="width: 100px">
                        <img
                          style="
                            border: 1px solid grey;
                            width: 100px;
                            height: 100px;
                            margin: 1px;
                          "
                          src="https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&amp;stdno=${marksDetails?.student_no}" 
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
              <table
                style="width: 100%; font-size: 11px; border-collapse: collapse"
                class="marks"
              >
                <tbody>
                ${uniqueRecords
                  ?.map(
                    (mark, index) =>
                      `<tr>
                    <td colspan="7" style="text-align: center" class="tdd">
                      YEAR ${mark?.study_yr} - ${mark?.acc_yr_title} - SEMESTER ${mark?.semester}
                    </td>
                  </tr>
                   <tr>
                    <th
                      style="
                        width: 10%;
                        border-left: 1px solid grey;
                        border-bottom: 1px solid grey;
                      "
                    >
                      CODE
                    </th>
                    <th style="border-bottom: 1px solid grey">TITLE</th>
                    <th style="width: 10%; border-bottom: 1px solid grey">MARK</th>
                    <th style="width: 10%; border-bottom: 1px solid grey">CU's</th>
                    <th style="width: 10%; border-bottom: 1px solid grey">GRADE</th>
                    <th style="width: 10%; border-bottom: 1px solid grey">GD POINT</th>
                    <th
                      style="
                        width: 10%;
                        border-bottom: 1px solid grey;
                        border-right: 1px solid grey;
                      "
                    >
                      REMARK
                    </th>
                  </tr>
                 ${marksDetails.student_marks
                   .filter((m) => m.yrsem == mark.yrsem)
                   .map(
                     (result) => `
                  <tr style="border-bottom: 1px solid #e1e1e1">
                    <td>${result.course_unit_code}</td>
                    <td>${result.course_unit_title}</td>
                    <td>${result.final_mark}</td>
                    <td>${result.credit_units}</td>
                    <td>${result.grade}</td>
                    <td>${result.grade_point}</td>
                    <td>${result.remarks}</td>
                  </tr>
                  `
                   )
                   .join("")}
          
                    <tr>
                    <td colspan="4" style="font-size: 12px">
                      <br /><b>SEMESTER REMARKS : ${mark.remarks}</b><br />&nbsp;
                    </td>
                    <td colspan="2" style="font-size: 12px">
                      <br /><b>GPA : ${mark.GPA}</b><br />&nbsp;
                    </td>
                    <td colspan="1" style="font-size: 12px">
                      <br /><b>CGPA : ${mark.CGPA}</b><br />&nbsp;
                    </td>
                  </tr>
                  `
                  )
                  .join("")}
                </tbody>
              </table>
              <table style="width: 100%; font-size: 11px">
                <tbody>
                  <tr>
                    <td style="width: 50%">Minimum Graduation Load : <b></b></td>
                    <td>Total Credit Units : <b></b></td>
                  </tr>
                  <tr style="vertical-align: bottom">
                    <td style="height: 60px; width: 50%">
                      _____________________________________
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style="width: 50%">Faculty/School Dean</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <br />
              <div style="font-size: 9px">
                <u>NOTE</u><br />
                THE RESULTS ON THIS DOCUMENT ARE PROVISIONAL. A FULL TRANSCRIPT IS ISSUED
                BY THE ACADEMIC REGISTRAR. THE MEDIUM OF INSTRUCTION IS ENGLISH.
              </div>
              <table style="font-size: 9px; width: 100%">
                <tbody>
                  <tr>
                    <td>RT - Paper passed after being Retaken</td>
                    <td>CTR - Paper with less than Pass Mark Score</td>
                    <td>MIS - Missing Paper</td>
                  </tr>
                </tbody>
              </table>
          
               <script>
                  var qrcode = new QRCode(document.getElementById("qrcode${marksDetails?.student_no}"), {
                      text: "http://localhost/2323/testimonial/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGRubyI6IjIwMDAxMDAxMjEiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.CQB259qCUd2rsY4JEQQsavC8SJ1OpzJgtDMsyz46oz4",
                      width: 100,
                      height: 100,
                      // colorDark: "#1677ff",
                      // colorLight: "#ffffff",
                      correctLevel: QRCode.CorrectLevel.L
                  });
              </script>
            </body>
          </html>
          <br />
          <br />
          <br />
          `;
      });

      const allTestimonialsHTML = htmlTemplates.join("");

      // Open a popup window with specific dimensions
      const popup = window.open(
        "",
        "_blank",
        "width=900,height=650,scrollbars=yes,resizable=no"
      );

      if (popup) {
        // Write the testimonial HTML to the popup window
        popup.document.open();
        popup.document.write(allTestimonialsHTML);
        popup.document.close();
      }
    }
  };

  return (
    <div
      style={{
        padding: 15,
        // backgroundColor: "rgb(223, 229, 239)",
      }}
    >
      <Table
        className={styles.customTable}
        loading={loadingResults}
        style={{
          //   backgroundColor: "red",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
        }}
        title={() => (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  // backgroundColor: "red",
                  maxWidth: "65%",
                }}
              >
                <Typography.Text
                  ellipsis={{
                    tooltip: selectedItem
                      ? `RESULTS FOR ${selectedItem.details.course_title} (${selectedItem.details.course_code}) - ${selectedItem.details.course_version_title}`
                      : null,
                  }}
                >
                  {selectedItem
                    ? `RESULTS FOR ${selectedItem.details.course_title} (${selectedItem.details.course_code}) - ${selectedItem.details.course_version_title}`
                    : null}
                </Typography.Text>
              </div>

              {loading || !configurations ? (
                <Typography.Text>Loading configurations...</Typography.Text>
              ) : (
                <div>
                  <Typography.Text
                    style={{
                      color: "blue",
                    }}
                  >
                    {configurations.intake == "all"
                      ? "ALL INTAKES"
                      : `${configurations.intake} INTAKE`}
                  </Typography.Text>
                  <Divider
                    type="vertical"
                    style={{
                      backgroundColor: "maroon",
                    }}
                  />
                  <Typography.Text
                    style={{
                      color: "blue",
                    }}
                  >
                    {`${configurations.campus} CAMPUS`}
                  </Typography.Text>
                  <Divider
                    type="vertical"
                    style={{
                      backgroundColor: "maroon",
                    }}
                  />
                  <Space size="middle">
                    <Typography.Text
                      style={{
                        color: "blue",
                      }}
                    >
                      {configurations.acc_yr}
                    </Typography.Text>

                    <Button
                      size="small"
                      variant="solid"
                      color="#1890ff"
                      icon={<Settings size={15} />}
                      onClick={() =>
                        dispatch(setResultsConfigModalVisible(true))
                      }
                    ></Button>
                  </Space>
                </div>
              )}
            </div>

            <Divider
              style={{
                marginTop: 5,
                marginBottom: 10,
                padding: 0,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space size="small">
                <Button
                  variant="solid"
                  color="orange"
                  size="small"
                  danger
                  icon={<Upload size={15} />}
                  onClick={() => dispatch(setPublishResultsModalVisible(true))}
                >
                  Publish
                </Button>
                <Button
                  type="primary"
                  size="small"
                  ghost
                  icon={<Download size={15} />}
                >
                  Download
                </Button>
                <Button
                  variant="solid"
                  color="pink"
                  size="small"
                  icon={<Printer size={15} />}
                  disabled={
                    testimonialsToPrint.length == 0 || loadingStdsResults
                  }
                  onClick={handlePrintTestimonnials}
                  loading={loadingStdsResults}
                >
                  {`Print Testimonial(s) ${testimonialsToPrint.length == 0 ? "" : `[${testimonialsToPrint.length}]`}`}
                </Button>
              </Space>

              <Space>
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<LucideView size={15} />}
                >
                  Load Results Report
                </Button>

                <Button
                  variant="solid"
                  color="purple"
                  size="small"
                  icon={<History size={15} />}
                >
                  Publish History
                </Button>
              </Space>
            </div>
          </div>
        )}
        //   title={<Typography.Title>Results View</Typography.Title>}
        columns={columns}
        dataSource={results ? results.students_marks : []}
        rowKey={"student_no"}
        rowSelection={{
          type: "checkbox",
          onChange: handleSelections,
        }}
        bordered
        size="small"
        scroll={{
          x: "calc(700px + 50%)",
          y: "calc(100vh - 345px)",
        }}
      />
      <PublishResultsModal />
    </div>
  );
};
export default ResultDetails;
