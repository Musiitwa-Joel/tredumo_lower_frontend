import React from "react";
import { Typography, Collapse, Button } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const AppraisalInstructions = () => {
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f9f9f9",
        height: "calc(100vh - 230px)",
        overflow: "scroll",
      }}
    >
      <Typography>
        {/* Main Heading */}
        <Title level={3}>Performance Evaluation Instructions</Title>
        <Paragraph>
          Performance evaluations are intended to measure the extent to which
          the employee’s performance meets the requirements of a particular
          position and to establish goals for the future; strengthen the
          relationship between you and the employee; open up channels of
          communication; appraise past performance; recognize good performance;
          identify areas that might require improvement; enable you to assess
          your own communication and supervisory skills.
        </Paragraph>

        {/* Subheading */}
        <Title level={4}>INSTRUCTIONS:</Title>
        <Paragraph>
          Listed on the following pages are a number of performance factors that
          are important in the successful completion of most assignments. A list
          of qualities has been included to assist in evaluating an employee’s
          performance in each area.
        </Paragraph>
        <Paragraph>
          To complete the <Text strong>Performance Appraisal Form</Text>, fill
          in the circle under the level of achievement which most accurately
          describes the employee’s performance on each factor.
        </Paragraph>
        <Paragraph>
          In the spaces provided at the end of each section, you are encouraged
          to support your ratings with clarifying comments or specific examples
          which occurred during the review period that determined or affected
          the level of achievement marked.
        </Paragraph>

        <Text strong style={{ color: "#ff4d4f" }}>
          Factors rated anything other than “Meets Requirements” must be
          supported with examples or reasons within the appropriate section
          below and should be listed in the Employee Goals and Objectives for
          next year section (last page) of the Administrator Performance Review.
        </Text>

        <Paragraph>
          After the entire form has been completed and reviewed, the original is
          forwarded to the <Text strong>Office of Human Resources*</Text>. Both
          the supervisor and the employee retain a copy.
        </Paragraph>

        {/* Definition of Terms */}
        <Title level={4}>DEFINITION OF TERMS:</Title>

        <Collapse accordion>
          <Panel header="NEEDS IMPROVEMENT" key="1">
            <Paragraph>
              Performance is at a level below established objectives with the
              result that overall contribution is marginal and substandard.
              Performance requires a high degree of supervision.
            </Paragraph>
          </Panel>
          <Panel header="MEETS REQUIREMENTS" key="2">
            <Paragraph>
              Meets established objectives in a satisfactory and adequate
              manner. Performance requires normal to some degree of supervision.
            </Paragraph>
          </Panel>
          <Panel header="EXCEEDS REQUIREMENTS" key="3">
            <Paragraph>
              Job performance easily exceeds job requirements; performance
              approaches best possible attainment.
            </Paragraph>
          </Panel>
        </Collapse>
      </Typography>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="primary"
          style={{
            marginTop: 20,
          }}
        >
          Begin Evaluation
        </Button>
      </div> */}
    </div>
  );
};

export default AppraisalInstructions;
