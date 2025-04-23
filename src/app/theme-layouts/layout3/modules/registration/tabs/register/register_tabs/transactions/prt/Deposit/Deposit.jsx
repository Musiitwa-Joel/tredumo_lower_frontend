import React, { useEffect, useState } from "react";
import { Input, Button, Modal, Alert } from "antd";
import "./PRT.css";
import { GENERATE_PRT } from "app/theme-layouts/layout3/modules/registration/gql/mutations";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { selectUser } from "app/store/userSlice";
import {
  selectStudentData,
  setPaymentSlipVisible,
  setTokenRes,
} from "app/theme-layouts/layout3/modules/registration/store/registrationSlice";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState(0);
  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const userObj = useSelector(selectUser);
  const [generatePRT, { error, loading, data }] = useMutation(GENERATE_PRT);

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

  const handleAmountChange = (e) => {
    setDepositAmount(Number(e.target.value));
  };

  const totalAmountToDeposit = depositAmount; // Assuming some logic to calculate total

  const handleGenerateToken = async () => {
    const payload = {
      studentNo: studentFile?.student_no,
      amount: depositAmount,
      type: "prepayment_ref",
      generatedBy: userObj.user.user_id,
      invoices: null,
    };

    // console.log("payload", payload);

    const res = await generatePRT({
      variables: payload,
    });

    dispatch(setTokenRes(res.data.generatePRT));

    setDepositAmount(0);

    dispatch(setPaymentSlipVisible(true));
  };
  return (
    <div style={{ margin: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="amountToDeposit">Amount to deposit in UGX </label>
        <Input
          required
          id="amountToDeposit"
          type="number"
          placeholder="Enter amount"
          value={depositAmount}
          onChange={handleAmountChange}
          style={{ width: 300 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            backgroundColor: "#E0E7FF",
            color: "#5C67F2",
            borderColor: "#E0E7FF",
            textAlign: "center",
          }}
          disabled
        >
          TOTAL AMOUNT TO DEPOSIT: UGX {totalAmountToDeposit.toLocaleString()}
        </Button>
        <Button
          type="primary"
          onClick={handleGenerateToken}
          disabled={depositAmount == 0}
          loading={loading}
        >
          GENERATE TOKEN
        </Button>
      </div>
    </div>
  );
};

export default Deposit;
