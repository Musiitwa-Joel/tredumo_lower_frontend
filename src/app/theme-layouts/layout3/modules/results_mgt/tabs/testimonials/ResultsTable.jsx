import { Download, Edit, Info, Print } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Space, Button, ConfigProvider, Table, Typography, theme } from "antd";
// import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectExpandedMarksKeys,
  selectMarksDetails,
  setExpandedMarksKeys,
} from "../../store/resultsSlice";
import { useEffect, useState } from "react";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";

export const getUniqueRecords = (allRecords) => {
  if (!allRecords) return [];
  const uniqueRecords = allRecords.reduce((acc, current) => {
    // Check if `yrsem` already exists in the accumulator array
    if (!acc.some((item) => item.yrsem === current.yrsem)) {
      acc.push(current); // Add the current record if it's unique by `yrsem`
    }
    return acc;
  }, []);

  return uniqueRecords;
};

const columns = [
  {
    title: "Row Name",
    dataIndex: "name",
    key: "name",
    render: (text, record, index) => (
      <span
        style={{
          // color: "dodgerblue",
          fontWeight: "500",
        }}
      >
        {text}
      </span>
    ),
  },
];

function ResultsTable() {
  const dispatch = useDispatch();
  const marksDetails = useSelector(selectMarksDetails);
  const uniqueRecords = getUniqueRecords(marksDetails?.student_marks);
  const expandedKeys = useSelector(selectExpandedMarksKeys);

  // console.log("marksDetails", marksDetails);

  useEffect(() => {
    if (marksDetails) {
      dispatch(
        setExpandedMarksKeys([...uniqueRecords.map((record) => record.yrsem)])
      );
    }
  }, [marksDetails]);

  const expandedRowRender = (row) => {
    // console.log("details", row);

    const columns2 = [
      {
        title: "#",
        dataIndex: "index",
        key: "date",
        render: (text, record, index) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {index + 1}
          </Typography.Text>
        ),
        width: "5%",
      },
      {
        title: "Code",
        dataIndex: "course_unit_code",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
        width: "21%",
        key: "code",
        ellipsis: true,
      },
      {
        title: "Title",
        dataIndex: "course_unit_title",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
        key: "title",
        width: "70%",
        ellipsis: true,
      },
      {
        title: "CSWK",
        dataIndex: "coursework",
        key: "coursework",
        ellipsis: true,
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
        width: "10%",
      },
      {
        title: "Exam",
        key: "exam",
        dataIndex: "exam",
        width: "10%",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
      },
      {
        title: "Final Mark",
        dataIndex: "final_mark",
        key: "final_mark",
        width: "14%",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
        // render: (text, record, index) => parseInt(text).toLocaleString(),
      },

      {
        title: "Grade",
        dataIndex: "grade",
        key: "grade",
        width: "12%",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
      },
      {
        title: "Grade Point",
        dataIndex: "grade_point",
        key: "grade_point",
        width: "16%",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
      },
      {
        title: "C.U",
        dataIndex: "credit_units",
        key: "credit_units",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
        width: "8%",
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        key: "remarks",
        render: (text) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text}
          </Typography.Text>
        ),
        width: "16%",
      },
    ];

    // const data2 = [
    //   {
    //     code: "BCS920933",
    //     title: "COMPUTER MATHEMATICS",
    //     cswk: "20",
    //     exam: "50",
    //     final_mark: "70",
    //     grade: "B",
    //     grade_point: "4",
    //     credit_units: "4",
    //     remarks: "NP",
    //   },
    //   {
    //     code: "BCS920933",
    //     title: "COMPUTER REPAIR AND MAINTAINENCE",
    //     cswk: "20",
    //     exam: "50",
    //     final_mark: "70",
    //     grade: "B",
    //     grade_point: "4",
    //     credit_units: "4",
    //     remarks: "NP",
    //   },
    //   {
    //     code: "BCS920933",
    //     title: "COMPUTER MATHEMATICS",
    //     cswk: "20",
    //     exam: "50",
    //     final_mark: "70",
    //     grade: "B",
    //     grade_point: "4",
    //     credit_units: "4",
    //     remarks: "NP",
    //   },
    //   {
    //     code: "BCS920933",
    //     title: "COMPUTER REPAIR AND MAINTAINENCE",
    //     cswk: "20",
    //     exam: "50",
    //     final_mark: "70",
    //     grade: "B",
    //     grade_point: "4",
    //     credit_units: "4",
    //     remarks: "NP",
    //   },
    //   {
    //     code: "BCS920933",
    //     title: "COMPUTER MATHEMATICS",
    //     cswk: "20",
    //     exam: "50",
    //     final_mark: "70",
    //     grade: "B",
    //     grade_point: "4",
    //     credit_units: "4",
    //     remarks: "NP",
    //   },
    //   {
    //     code: "BCS920933",
    //     title: "COMPUTER REPAIR AND MAINTAINENCE hjsdb jkdsb",
    //     cswk: "20",
    //     exam: "50",
    //     final_mark: "70",
    //     grade: "B",
    //     grade_point: "4",
    //     credit_units: "4",
    //     remarks: "NP",
    //   },
    // ];

    const handleSelect = (record) => {
      // console.log("selected inv", record);
      //   dispatch(setSelectedInvoice(record));
    };

    const data2 = marksDetails?.student_marks.filter(
      (mark) => mark.yrsem == row.key
    );

    return (
      <Table
        size="middle"
        // bordered
        columns={columns2}
        dataSource={data2}
        pagination={false}
        // rowKey={"invoice_no"}
        rowHoverable
        // rowSelection={{
        //   type: "radio",
        //   onSelect: handleSelect,
        //   selectedRowKeys: selectedInvoice
        //     ? [selectedInvoice.invoice_no]
        //     : null,
        // }}
        // rowSelection={{
        //   type: "radio",
        // }}
      />
    );
  };

  const handlePrint = () => {
    // console.log("marks", marksDetails);
    const testimonialHTML = `
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
                    id="qrcode"
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
        <br />
        <br />
        <br />
        <br /><br /><br /><br />
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
            var qrcode = new QRCode(document.getElementById("qrcode"), {
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
    `;

    // Open a popup window with specific dimensions
    const popup = window.open(
      "",
      "_blank",
      "width=900,height=650,scrollbars=yes,resizable=no"
    );

    if (popup) {
      // Write the testimonial HTML to the popup window
      popup.document.open();
      popup.document.write(testimonialHTML);
      popup.document.close();
    }
  };

  const data = uniqueRecords.map((group) => ({
    key: group.yrsem,
    name: (
      <Space size="middle">
        <Space size={30}>
          <Space size="small">
            <Typography.Text
              style={{
                color: "rgb(8, 50, 183)",
                fontSize: 13,
              }}
              strong
            >
              {"Academic Yr:"}
            </Typography.Text>
            <Typography.Text
              style={{
                fontSize: 13,
              }}
            >
              {group.acc_yr_title}
            </Typography.Text>
          </Space>
        </Space>

        <Space size="small">
          <Typography.Text
            style={{
              color: "rgb(8, 50, 183)",
              fontSize: 13,
            }}
            strong
          >
            {"Year:"}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {group.study_yr}
          </Typography.Text>

          <Typography.Text
            style={{
              color: "rgb(8, 50, 183)",
              fontSize: 13,
            }}
            strong
          >
            {"Sem:"}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {group.semester}
          </Typography.Text>
        </Space>

        <div
          style={{
            paddingLeft: 25,
          }}
        />

        <Space size="small">
          <Typography.Text
            style={{
              color: "rgb(8, 50, 183)",
              fontSize: 13,
            }}
            strong
          >
            {"GPA: "}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {group.GPA}
          </Typography.Text>
        </Space>

        <Space size="small">
          <Typography.Text
            style={{
              color: "rgb(8, 50, 183)",
              fontSize: 13,
            }}
            strong
          >
            {"CGPA: "}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {group.CGPA}
          </Typography.Text>
        </Space>

        <Space size="small">
          <Typography.Text
            style={{
              color: "rgb(8, 50, 183)",
              fontSize: 13,
            }}
            strong
          >
            {"Remarks: "}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {group.remarks}
          </Typography.Text>
        </Space>
      </Space>
    ),
  }));

  //   const handleInvoiceDetails = () => {
  //     if (!selectedInvoice) {
  //       dispatch(
  //         showMessage({
  //           message: "Please select an invoice!!!",
  //           variant: "info",
  //         })
  //       );

  //       return;
  //     }
  //     console.log("selected invoice", selectedInvoice);
  //     dispatch(setInvoiceDetailsModalVisible(true));
  //   };

  return (
    <div
      style={{
        padding: 0,
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Table: {
              // headerBg: "rgba(0, 0, 0, 0.04)",
              borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
              // cellFontSize: 10,
              // fontSize: 13,
              // lineHeight: 0.8,
            },
          },
          token: {
            fontSize: 15,
          },
          algorithm: theme.compactAlgorithm,
        }}
      >
        <Table
          bordered
          showHeader={false}
          pagination={false}
          title={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Title
                level={5}
                style={{
                  padding: 0,
                  margin: 0,
                }}
              >
                Testimonial
              </Typography.Title>

              <Space size="middle">
                <Button
                  type="primary"
                  ghost
                  // size="small"
                  icon={<Print size={12} />}
                  onClick={handlePrint}
                  disabled={marksDetails.length == 0}
                >
                  Print Testimonial
                </Button>

                <Button
                  type="primary"
                  ghost
                  disabled={marksDetails.length == 0}
                >
                  Actions
                </Button>
              </Space>
            </div>
          )}
          // loading={loading || deletingItem}
          // size="middle"
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: true,
            // defaultExpandedRowKeys: [...feesCategories.map((cat) => cat.id)],
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: (e) => dispatch(setExpandedMarksKeys(e)),
          }}
          dataSource={data}
          scroll={{
            y: "calc(100vh - 205px)",
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default ResultsTable;
