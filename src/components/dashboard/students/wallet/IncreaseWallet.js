import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";

const IncreaseWallet = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { auth } = useAuth();

  const payByCard = async () => {
    try {
      const response = await axios.post(
        "zarinpal/buybasket/",
        {
          amount: +amount,
          url: "https://srvschool.ir/panel/wallet",
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      window.location.replace(response.data);
    } catch (err) {}
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ boxShadow: "none", borderRadius: "5px" }}
        onClick={() => setOpen(true)}
        fullWidth
      >
        افزایش موجودی
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ textAlign: "center" }}>افزایش موجودی</DialogTitle>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <TextField
              label="مبلغ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              variant="standard"
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              color="text.secondary"
              textAlign="end"
              fontFamily="iranyekanFn"
              fontWeight={500}
            >
              {amount} تومان
            </Typography>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ boxShadow: "none", borderRadius: "5px" }}
              fullWidth
              onClick={payByCard}
            >
              افزایش موجودی
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth onClick={() => setOpen(false)}>
              انصراف
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default IncreaseWallet;
