import {
  Box,
  Button,
  Card,
  Grid,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { DefiContext } from "../../../../context/DefiContext";
import toastify from "../../../../helper/toast";
import useAuth from "../../../../hooks/useAuth";

const Pay = ({ wallet, data }) => {
  const { setReload } = useContext(DefiContext);
  const [discount, setDiscount] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [regent, setRegent] = useState("");
  const { auth } = useAuth();

  const discountHandler = async () => {
    try {
      const response = await axios.post(
        "dashboard/discount",
        {
          code: discount,
          amount: data.final_price,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setNewPrice(response.data.amount);
      console.log(response);
      toastify("success-login", "کد تخفیف اعمال شد");
    } catch (err) {
      if (err.response.status === 404) {
        toastify("error-login", "کد تخفیف اشتباه است");
      }
    }
  };
  const regentHandler = async () => {
    try {
      const response = await axios.post(
        "dashboard/userdiscount",
        {
          code: regent,
          amount: data.final_price,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setNewPrice(response.data.amount);
      console.log(response);
      toastify("success-login", "کد معرف اعمال شد");
    } catch (err) {
      if (err.response.status === 404) {
        toastify("error-login", "کد معرف اشتباه است");
      }
    }
  };

  const payByWallet = async () => {
    try {
      const response = await axios.get(
        `zarinpal/buywallet/?amount=${newPrice ? newPrice : data.final_price}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      toastify("success-login", "از خرید شما متشکریم");
      setTimeout(() => {
        setReload((prevState) => !prevState);
      }, 2000);
    } catch (err) {
      if (err.response.status === 400) {
        toastify("error-login", "موجودی کیف پول شما کافی نیست");
      } else if (err.response.status === 405) {
        toastify("error-login", "شما قبلا این دوره را خریداری کرده اید");
      }
    }
  };

  const payByCard = async () => {
    try {
      const response = await axios.post(
        "zarinpal/buybasket/",
        {
          amount: newPrice ? newPrice : data.final_price,
          url: "https://srvschool.ir/panel/my-course",
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      console.log(response);
      window.location.replace(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: "10px",
              backgroundColor: "#eee",
              padding: "4px",
              width: "50%",
              display: "flex",
            }}
          >
            <InputBase
              placeholder="کدتخفیف"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ boxShadow: "none", borderRadius: "10px" }}
              onClick={discountHandler}
            >
              اعمال
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: "10px",
              backgroundColor: "#eee",
              padding: "4px",
              width: "50%",
              display: "flex",
            }}
          >
            <InputBase
              placeholder="کدمعرف"
              value={regent}
              onChange={(e) => setRegent(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ boxShadow: "none", borderRadius: "10px" }}
              onClick={regentHandler}
            >
              ثبت
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} mt={2}>
          <Stack
            direction="row"
            sx={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}
            justifyContent="space-between"
          >
            <Typography
              color="text.secondary"
              fontFamily="iranyekanFn"
              fontWeight={600}
            >
              موجودی کیف پول:
            </Typography>
            <Typography fontFamily="iranyekanFn" fontWeight={600}>
              {wallet?.amount?.toLocaleString()} تومان
            </Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
              marginTop: 1,
            }}
            justifyContent="space-between"
          >
            <Typography
              color="text.secondary"
              fontFamily="iranyekanFn"
              fontWeight={600}
            >
              جمع مبلغ پرداختی:
            </Typography>
            <Typography fontFamily="iranyekanFn" fontWeight={600}>
              {newPrice
                ? newPrice.toLocaleString()
                : data?.final_price?.toLocaleString()}
              تومان
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" variant="subtitle2">
            دانش آموز عزیز لطفاً در انتخاب کلاس و استاد موردنظر دقت نمایید؛ پس
            از ثبت‌نام جابه‌جایی و لغو کلاس امکان‌پذیر نمی‌باشد.
          </Typography>
        </Grid>
        <Grid item xs={12} mt={2}>
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              padding: "10px 0",
              borderRadius: 3,
              color: "#fff",
            }}
            color="success"
            fullWidth
            onClick={payByWallet}
          >
            پرداخت با کیف پول
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Pay;
