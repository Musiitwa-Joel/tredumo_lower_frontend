import React, { useEffect, useState } from "react";
import { Collapse } from "antd";
import { useLazyQuery } from "@apollo/client";
import {
  LOAD_EVALUATION_TEMPLATE_QNS,
  LOAD_EVALUATION_TEMPLATES,
} from "../../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { selectSelectedPerformanceReview } from "../../../store/hrSlice";
import EvaluationTable from "../../appraisals/appraisal_templates/EvaluationTable";
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
  },
];
const Questionnare = () => {
  const dispatch = useDispatch();
  const selectedPerformanceReview = useSelector(
    selectSelectedPerformanceReview
  );
  const [steps, setSteps] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadEvaluationQns, { loading, error, data }] = useLazyQuery(
    LOAD_EVALUATION_TEMPLATE_QNS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (selectedPerformanceReview) {
      loadQns();
    }
  }, [selectedPerformanceReview, data, dispatch]);

  const loadQns = async () => {
    const res = await loadEvaluationQns({
      variables: {
        templateId: selectedPerformanceReview.template_id,
      },
    });

    console.log("response", res.data);

    if (res.data) {
      const formattedSteps = res.data.evaluation_template_questions.map(
        (section) => ({
          key: section.section_id,
          label: section.section_title,
          children: (
            <EvaluationTable questions={section.questions} section={section} />
          ),
        })
      );
      setSteps(formattedSteps);
      setSections(res.data.evaluation_template_questions);
    }
  };

  const onChange = (key) => {
    console.log(key);
  };

  console.log("the steps", steps);
  console.log("selected performance", selectedPerformanceReview);
  return (
    <Collapse
      accordion
      items={steps}
      // defaultActiveKey={["1"]}
      onChange={onChange}
    />
  );
};
export default Questionnare;
