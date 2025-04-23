import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedTemplatePreview,
  selectTemplatePreviewVisible,
  setLoadingSections,
  setTemplatePreviewVisible,
  setTemplateSections,
} from "../../../store/hrSlice";
import EvaluationTable from "./EvaluationTable";
import { useLazyQuery, useQuery } from "@apollo/client";
import { LOAD_EVALUATION_TEMPLATE_QNS } from "../../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import AppraisalInstructions from "./AppraisalInstructions";

const TemplatePreview = () => {
  const [_isModalOpen, setIsModalOpen] = useState(true);
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectTemplatePreviewVisible);
  const [current, setCurrent] = useState(-1);
  const [steps, setSteps] = useState([]);
  const selectedTemplate = useSelector(selectSelectedTemplatePreview);
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
    dispatch(setLoadingSections(loading));
  }, [loading]);

  const loadQns = async () => {
    const res = await loadEvaluationQns({
      variables: {
        templateId: selectedTemplate.template_id,
      },
    });

    if (res.data) {
      const formattedSteps = res.data.evaluation_template_questions.map(
        (section) => ({
          title: section.section_title,
          content: (
            <EvaluationTable questions={section.questions} section={section} />
          ),
        })
      );
      setSteps(formattedSteps);
      dispatch(setTemplateSections(res.data.evaluation_template_questions));
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      loadQns();
    }
  }, [selectedTemplate, data, dispatch]);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item, index) => ({
    key: index,
    title: item.title,
  }));

  const contentStyle = {
    marginTop: 16,
  };

  useEffect(() => {
    setIsModalOpen(true);
  }, [isModalOpen]);

  const handleOk = () => {
    dispatch(setTemplatePreviewVisible(false));
  };
  const handleCancel = () => {
    dispatch(setTemplatePreviewVisible(false));
  };

  return (
    <>
      <Modal
        title={`Template Preview - ${selectedTemplate?.template_name}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1100}
        footer={false}
        style={{
          top: 20,
        }}
      >
        {current == -1 && <AppraisalInstructions />}

        {current >= 0 && (
          <Steps direction="horizontal" current={current} items={items} />
        )}
        <div style={contentStyle}>{steps[current]?.content}</div>
        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
        >
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TemplatePreview;
