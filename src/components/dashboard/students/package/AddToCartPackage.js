import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Button, Tooltip } from "@mui/material";
import { toastify } from "../../../../helper/toast";

import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

const AddToCartPackage = ({ id }) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const addToCart = () => {
    try {
      setLoading(true);
      const response = axios.post(
        "dashboard/basket",
        [{ buyID: +id, type: "student" }],
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      toastify("success-login", "پکیج به سبد خرید شما اضافه شد");
      console.log(response);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Tooltip title="افزودن به سبد خرید">
      <Button onClick={addToCart}>
        <LocalMallOutlinedIcon />
      </Button>
    </Tooltip>
  );
};

export default AddToCartPackage;
