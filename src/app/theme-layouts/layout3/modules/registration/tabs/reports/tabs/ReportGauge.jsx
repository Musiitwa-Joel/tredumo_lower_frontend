import React from "react";
import GaugeComponent from "react-gauge-component";
import { useSelector } from "react-redux";
import { selectRegistrationReport } from "../../../store/registrationSlice";

function ReportGauge() {
  const regReport = useSelector(selectRegistrationReport);
  return (
    <div style={{ padding: "0px" }}>
      <GaugeComponent
        arc={{
          subArcs: [
            {
              limit: 20,
              color: "#EA4228",
              showTick: true,
            },
            {
              limit: 40,
              color: "#F58B19",
              showTick: true,
            },
            {
              limit: 60,
              color: "#F5CD19",
              showTick: true,
            },
            {
              limit: 100,
              color: "#5BE12C",
              showTick: true,
            },
          ],
        }}
        value={
          regReport?.totals
            ? parseInt(
                (regReport?.totals.total_registered /
                  regReport?.totals.total_enrolled) *
                  100
              )
            : 0
        }
        labels={{
          valueLabel: {
            style: {
              fontSize: "35px",
              fill: "red",
              color: "red",
              textShadow: "none",
            },
            matchColorWithArc: true,
            formatTextValue: (value) => `${value}%`,
          },
        }}
        pointer={{
          type: "arrow",
          elastic: true,
        }}
        style={{
          width: "100%", // Ensures the gauge fits within its container
          backgroundColor: "#fff",
          padding: 0,
        }}
      />
    </div>
  );
}

export default ReportGauge;
