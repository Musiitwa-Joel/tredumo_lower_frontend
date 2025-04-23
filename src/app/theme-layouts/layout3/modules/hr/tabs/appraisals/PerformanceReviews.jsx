import React from "react";
import { Tabs } from "antd";
import PendingReviews from "./reviews/PendingReviews";
import CreateReview from "./reviews/CreateReview";
import ReviewHistory from "./reviews/ReviewHistory";
import { useSelector } from "react-redux";
import { selectRespondReviewVisible } from "../../store/hrSlice";
import RespondReview from "./reviews/review_response/RespondReview";
import { selectUserPermissions } from "app/store/userSlice";
import hasPermission from "src/utils/hasPermission";

const Reviews = () => {
  const respondReviewVisible = useSelector(selectRespondReviewVisible);
  const userPermissions = useSelector(selectUserPermissions);

  const can_create_appraisals = hasPermission(
    userPermissions,
    "can_create_appraisals"
  );

  return respondReviewVisible ? (
    <RespondReview />
  ) : (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Performance Reviews</h1>
      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: "pending",
            label: "Pending Reviews",
            children: <PendingReviews />,
          },
          ...(can_create_appraisals
            ? [
                {
                  key: "create",
                  label: "Create Review",
                  children: <CreateReview />,
                },
              ]
            : []),
          {
            key: "history",
            label: "Review History",
            children: <ReviewHistory />,
          },
        ]}
      />
    </div>
  );
};

export default Reviews;
